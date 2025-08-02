import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/store";
import { Notification as NotificationType } from "./api/notification.api";

interface WebSocketMessage {
  type: string;
  data: any;
}

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { accessToken } = useAppSelector((state) => state.auth);

  const connect = useCallback(() => {
    if (!accessToken) return;

    // Disconnect existing connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Create new connection
    socketRef.current = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      {
        auth: {
          token: accessToken,
        },
        transports: ["websocket", "polling"],
      }
    );

    // Connection events
    socketRef.current.on("connect", () => {
      console.log("✅ WebSocket connected");
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
    });

    socketRef.current.on("connect_error", (error: any) => {
      console.error("WebSocket connection error:", error);
    });

    // Notification events
    socketRef.current.on(
      "notification:new",
      (notification: NotificationType) => {
        console.log("🔔 New notification received:", notification);

        // Invalidate notifications query to refetch
        queryClient.invalidateQueries({ queryKey: ["notifications"] });

        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.ico",
          });
        }
      }
    );

    // Chat events
    socketRef.current.on("chat:message", (message: any) => {
      console.log("💬 New chat message:", message);
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
    });

    // AI chat events
    socketRef.current.on("ai:message", (message: any) => {
      console.log("🤖 AI response:", message);
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    });

    // System events
    socketRef.current.on("system:error", (error: any) => {
      console.error("System error:", error);
    });

    socketRef.current.on("system:success", (message: any) => {
      console.log("System success:", message);
    });

    return socketRef.current;
  }, [accessToken, queryClient]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return Notification.permission === "granted";
  }, []);

  useEffect(() => {
    if (accessToken) {
      connect();
      requestNotificationPermission();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [accessToken, connect, disconnect, requestNotificationPermission]);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    emit,
    requestNotificationPermission,
  };
};
