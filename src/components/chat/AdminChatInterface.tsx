"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaTimes } from "react-icons/fa";
import { IoSend, IoPerson } from "react-icons/io5";
import { useSelector } from "react-redux";
import {
  useCreateConversationMutation,
  useSendMessageMutation,
  useMessagesInfiniteQuery,
  useMarkAsReadMutation,
  MessageResponse,
} from "@/hooks/api/chat.api";
import { useSocket } from "@/hooks/useSocket";

// Types
interface AdminChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TypingData {
  userId: string | number;
  isTyping: boolean;
}

// Constants
const ADMIN_ID = 1;

// Header Component
const ChatHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between p-3 border-b bg-blue-500 text-white rounded-t-lg">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
        <IoPerson size={12} />
      </div>
      <div>
        <h3 className="font-semibold text-sm">Chat với Admin</h3>
        <p className="text-xs opacity-90">Phản hồi trong vài phút</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
    >
      <FaTimes size={16} />
    </button>
  </div>
);

// Message Component
const Message: React.FC<{
  message: MessageResponse;
  isCurrentUser: boolean;
}> = ({ message, isCurrentUser }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-2 py-1 text-sm ${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <p className="text-xs">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isCurrentUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {formatTime(new Date(message.createdAt))}
        </p>
      </div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-2">
    <div className="bg-gray-100 text-gray-800 rounded-lg px-2 py-1">
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
        <div
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  </div>
);

// Load More Button Component
const LoadMoreButton: React.FC<{
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}> = ({ hasNextPage, isFetchingNextPage, onLoadMore }) => {
  if (!hasNextPage) return null;

  return (
    <div className="flex justify-center mb-2">
      <button
        onClick={onLoadMore}
        disabled={isFetchingNextPage}
        className="text-blue-500 hover:text-blue-600 text-xs disabled:opacity-50"
      >
        {isFetchingNextPage ? "Đang tải..." : "Tải thêm tin nhắn"}
      </button>
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="text-gray-500 text-sm text-center">
      <p>Chưa có tin nhắn nào</p>
      <p className="text-xs mt-1">Hãy gửi tin nhắn đầu tiên!</p>
    </div>
  </div>
);

// Loading State Component
const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="text-gray-500 text-sm">Đang tải tin nhắn...</div>
  </div>
);

// Messages Container Component
const MessagesContainer: React.FC<{
  messages: MessageResponse[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  currentUserId: string | number;
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}> = ({
  messages,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  currentUserId,
  isTyping,
  messagesEndRef,
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <LoadMoreButton
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />

      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;
        return (
          <Message
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
          />
        );
      })}

      {messages.length === 0 && <EmptyState />}

      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </>
  );
};

// Input Component
const ChatInput: React.FC<{
  inputText: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isPending: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}> = ({
  inputText,
  onInputChange,
  onKeyPress,
  onSendMessage,
  isPending,
  inputRef,
}) => (
  <div className="p-3 border-t">
    <div className="flex space-x-2">
      <input
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
        placeholder="Nhập tin nhắn..."
        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        disabled={isPending}
      />
      <button
        onClick={onSendMessage}
        disabled={!inputText.trim() || isPending}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <IoSend size={12} />
        )}
      </button>
    </div>
  </div>
);

// Main AdminChatInterface Component
const AdminChatInterface: React.FC<AdminChatInterfaceProps> = ({
  isOpen,
  onClose,
}) => {
  // State
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [realTimeMessages, setRealTimeMessages] = useState<MessageResponse[]>(
    []
  );
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastMarkedConversationId = useRef<string | null>(null);

  // Redux selectors
  const currentUserId = useSelector((state: any) => state.auth.userId);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const CURRENT_USER_ID = currentUserId || "";

  // API Hooks
  const createConversationMutation = useCreateConversationMutation();
  const sendMessageMutation = useSendMessageMutation();
  const markAsReadMutation = useMarkAsReadMutation();

  // WebSocket Hook
  const {
    socket,
    joinConversation,
    leaveConversation,
    onMessage,
    onTyping,
    setTyping,
    sendMessage,
  } = useSocket();

  // Messages query
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useMessagesInfiniteQuery(conversationId || "", 50);

  // Effects
  useEffect(() => {
    if (!conversationId) return;
    joinConversation(conversationId);
    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId, joinConversation, leaveConversation]);

  // Create conversation when chat opens
  useEffect(() => {
    if (isOpen && !conversationId && isAuthenticated && CURRENT_USER_ID) {
      createConversationMutation.mutate(ADMIN_ID, {
        onSuccess: (response) => {
          setConversationId(response.data.conversationId);
        },
        onError: (error) => {
          console.error("Failed to create conversation:", error);
        },
      });
    }
  }, [isOpen, conversationId, isAuthenticated, CURRENT_USER_ID]);

  // Mark messages as read
  useEffect(() => {
    if (
      conversationId &&
      isOpen &&
      lastMarkedConversationId.current !== conversationId
    ) {
      markAsReadMutation.mutate(conversationId);
      lastMarkedConversationId.current = conversationId;
    }
  }, [conversationId, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // WebSocket event listeners
  useEffect(() => {
    if (!socket || !isOpen) return;

    const handleNewMessage = (message: MessageResponse) => {
      const isFromAdmin = message.senderId === ADMIN_ID;
      const isFromCurrentUser =
        Number(message.senderId) === Number(CURRENT_USER_ID);

      if (conversationId && (isFromAdmin || isFromCurrentUser)) {
        setRealTimeMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    };

    const handleTyping = (data: TypingData) => {
      const typingUserId = Number(data.userId);
      const currentUserId = Number(CURRENT_USER_ID);
      if (typingUserId === ADMIN_ID && typingUserId !== currentUserId) {
        console.log("✅ Client showing admin typing:", data.isTyping);
        setIsTyping(data.isTyping);
      }
    };

    const offMessage = onMessage(handleNewMessage);
    const offTyping = onTyping(handleTyping);

    return () => {
      offMessage();
      offTyping();
    };
  }, [socket, isOpen, conversationId, onMessage, onTyping, CURRENT_USER_ID]);

  // Clear realtime messages when conversation changes
  useEffect(() => {
    setRealTimeMessages([]);
    setIsTyping(false);
  }, [conversationId]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [realTimeMessages, isTyping, scrollToBottom]);

  // Event handlers
  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const messageContent = inputText.trim();
      if (!messageContent || !conversationId) return;

      sendMessage(conversationId, messageContent);
      setInputText("");
      setTyping(conversationId, false);
    },
    [inputText, conversationId, sendMessage, setTyping]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleSendMessage(e);
      }
    },
    [handleSendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!conversationId) return;
      const value = e.target.value;
      setInputText(value);
      setTyping(conversationId, value.length > 0);
    },
    [conversationId, setTyping]
  );

  const handleClose = useCallback(() => {
    setConversationId(null);
    lastMarkedConversationId.current = null;
    setInputText("");
    setRealTimeMessages([]);
    onClose();
  }, [onClose]);

  // Memoized messages
  const messages: MessageResponse[] = React.useMemo(() => {
    if (!messagesData?.pages) return realTimeMessages;

    const apiMessages = messagesData.pages
      .flatMap((page) => page.data.messages)
      .reverse();

    const messageMap = new Map<string, MessageResponse>();

    // Add API messages first
    apiMessages.forEach((msg) => {
      messageMap.set(msg.id, msg);
    });

    // Add realtime messages
    realTimeMessages.forEach((msg) => {
      messageMap.set(msg.id, msg);
    });

    // Convert back to array and sort by creation time
    return Array.from(messageMap.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messagesData, realTimeMessages]);

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border">
      <ChatHeader onClose={handleClose} />

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <MessagesContainer
          messages={messages}
          isLoading={isLoadingMessages}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          currentUserId={CURRENT_USER_ID}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <ChatInput
        inputText={inputText}
        onInputChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onSendMessage={handleSendMessage}
        isPending={sendMessageMutation.isPending}
        inputRef={inputRef}
      />
    </div>
  );
};

export default AdminChatInterface;
