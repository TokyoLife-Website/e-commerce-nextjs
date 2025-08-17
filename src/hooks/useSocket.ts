import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/store";
import { Notification as NotificationType } from "./api/notification.api";
import { MessageResponse } from "./api/chat.api";
import { useDebounce } from "./useDebounce";
import { QUERY_KEYS } from "./api/queryKeys";

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // Chat
  JOIN_CONVERSATION: "room:join",
  LEAVE_CONVERSATION: "room:leave",
  SEND_MESSAGE: "send_message",
  TYPING: "room:typing",
  LAST_MESSAGE_UPDATE: "last_message_update",

  // Notification
  NOTIFICATION: "notification:new",

  // AI
  AI_MESSAGE: "ai:message",
} as const;

type TypingPayload = {
  userId: string;
  isTyping: boolean;
};

type UseSocketReturn = {
  connected: boolean;
  socket?: Socket;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  onMessage: (cb: (msg: MessageResponse) => void) => () => void;
  onTyping: (cb: (payload: TypingPayload) => void) => () => void;
  onNotification: (cb: (payload: any) => void) => () => void;
};

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const queryClient = useQueryClient();
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      {
        withCredentials: true,
        transports: ["websocket"],
      }
    );

    socketRef.current = socket;

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      setConnected(true);
      console.log("✅ WebSocket connected");
    });
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setConnected(false);
      console.log("❌ WebSocket disconnected");
    });
    socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) =>
      console.error("Socket error:", err)
    );
    socket.on(SOCKET_EVENTS.NOTIFICATION, (notification: NotificationType) => {
      console.log("🔔 New notification received:", notification);
      // Invalidate notifications query to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
        });
      }
    });
    socket.on(SOCKET_EVENTS.LAST_MESSAGE_UPDATE, () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, conversationId);
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, content: string, metadata?: any) => {
      socketRef.current?.emit(SOCKET_EVENTS.SEND_MESSAGE, {
        conversationId,
        content,
        metadata,
      });
    },
    [queryClient]
  );

  const emitTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      socketRef.current?.emit(SOCKET_EVENTS.TYPING, {
        conversationId,
        isTyping,
      });
    },
    []
  );

  const debouncedTypingOff = useRef(
    useDebounce((conversationId: string) => {
      emitTyping(conversationId, false);
    }, 1500)
  );

  const setTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      if (isTyping) {
        emitTyping(conversationId, true);
        debouncedTypingOff.current(conversationId);
      } else {
        emitTyping(conversationId, false);
      }
    },
    [emitTyping]
  );

  const onMessage = useCallback((cb: (msg: MessageResponse) => void) => {
    socketRef.current?.on(SOCKET_EVENTS.SEND_MESSAGE, cb);
    return () => socketRef.current?.off(SOCKET_EVENTS.SEND_MESSAGE, cb);
  }, []);

  const onTyping = useCallback((cb: (payload: TypingPayload) => void) => {
    socketRef.current?.on(SOCKET_EVENTS.TYPING, cb);
    return () => socketRef.current?.off(SOCKET_EVENTS.TYPING, cb);
  }, []);

  const onNotification = useCallback((cb: (payload: any) => void) => {
    socketRef.current?.on(SOCKET_EVENTS.NOTIFICATION, cb);
    return () => socketRef.current?.off(SOCKET_EVENTS.NOTIFICATION, cb);
  }, []);

  return {
    connected,
    socket: socketRef.current ?? undefined,
    joinConversation,
    leaveConversation,
    sendMessage,
    setTyping,
    onMessage,
    onTyping,
    onNotification,
  };
};
