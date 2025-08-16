"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import {
  useConversationsQuery,
  ConversationResponse,
  useMessagesInfiniteQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  MessageResponse,
} from "@/hooks/api/chat.api";

import { useSocket } from "@/hooks/useSocket";
import {
  formatTimeAgo,
  formatTimeShort,
  isUserOnline,
} from "@/utils/timeFormat";

// Types
interface TransformedConversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastMessageContent: string;
  isOnline: boolean;
  unread: number;
  receiverId: number;
  updatedAt: string;
}

interface CurrentUser {
  id: number;
  name: string;
  role: string;
}

// Transform conversation data for display
const transformConversationData = (
  currentConversationId: string,
  conversations: ConversationResponse[]
): TransformedConversation[] => {
  return conversations.map((conv) => ({
    id: conv.id,
    name: conv.receiver.fullName,
    role: conv.receiver.email,
    avatar: conv.receiver.avatar || "/images/user/default-avatar.png",
    lastMessage: conv.lastMessage
      ? formatTimeShort(conv.lastMessage.createdAt)
      : "",
    lastMessageContent: conv.lastMessage?.content || "Chưa có tin nhắn",
    isOnline: isUserOnline(conv.lastMessage?.createdAt),
    unread: conv.id === currentConversationId ? 0 : conv.unreadCount,
    receiverId: conv.receiverId,
    updatedAt: conv.updatedAt,
  }));
};

// Helper function to get current user info
const getCurrentUser = (): CurrentUser => {
  return { id: 1, name: "Admin", role: "admin" };
};

// Conversation List Component
const ConversationList: React.FC<{
  chatUsers: TransformedConversation[];
  selectedUser: TransformedConversation | null;
  onSelectUser: (user: TransformedConversation) => void;
  showUserList: boolean;
  onCloseUserList: () => void;
}> = ({
  chatUsers,
  selectedUser,
  onSelectUser,
  showUserList,
  onCloseUserList,
}) => {
  return (
    <ComponentCard
      title="Chats"
      className={`h-full lg:h-[510px] flex flex-col ${
        showUserList
          ? "fixed inset-0 z-50 lg:relative lg:z-auto"
          : "hidden lg:flex"
      }`}
    >
      {/* Close button for mobile */}
      {showUserList && (
        <div className="flex lg:hidden justify-end mb-4">
          <button
            onClick={onCloseUserList}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Chat User List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scroll-smooth max-h-[calc(100vh-400px)] lg:max-h-[300px]">
        {chatUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              onSelectUser(user);
            }}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${
              selectedUser?.id === user.id
                ? "bg-blue-50 dark:bg-blue-900/20"
                : ""
            }`}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                {user.avatar &&
                user.avatar !== "/images/user/default-avatar.png" ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-left justify-center flex-col gap-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.lastMessageContent}
                  </p>
                </div>
                <div className="flex items-center justify-center flex-col gap-2">
                  {user.unread > 0 && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{user.unread}</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {user.lastMessage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ComponentCard>
  );
};

// Chat Area Component
const ChatArea: React.FC<{
  selectedUser: TransformedConversation | null;
  allMessages: MessageResponse[];
  messagesLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  newMessage: string;
  onNewMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  typingUsers: Set<string>;
  currentUser: CurrentUser;
  sendMessageMutation: any;
  onToggleUserList: () => void;
}> = ({
  selectedUser,
  allMessages,
  messagesLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  typingUsers,
  currentUser,
  sendMessageMutation,
  onToggleUserList,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, typingUsers]);

  return (
    <ComponentCard
      title={`Chat with ${selectedUser?.name || "Chọn một cuộc trò chuyện"}`}
      className="lg:col-span-2 h-full lg:h-[510px] flex flex-col"
    >
      {/* Mobile toggle button */}
      <div className="flex lg:hidden justify-start mb-4">
        <button
          onClick={onToggleUserList}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="text-sm">Show Chats</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scroll-smooth max-h-[calc(100vh-400px)] lg:max-h-[300px]">
        {/* Loading state */}
        {messagesLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              Đang tải tin nhắn...
            </span>
          </div>
        )}

        {/* Load more button */}
        {hasNextPage && (
          <div className="flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-blue-500 hover:text-blue-600 text-sm disabled:opacity-50"
            >
              {isFetchingNextPage ? "Đang tải..." : "Tải thêm tin nhắn"}
            </button>
          </div>
        )}

        {/* Messages */}
        {allMessages.map((message: MessageResponse) => {
          const isCurrentUser = message.senderId === currentUser.id;
          return (
            <div
              key={message.id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                  {message.sender.avatar ? (
                    <Image
                      src={message.sender.avatar}
                      alt={message.sender.fullName}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {message.sender.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div
                    className={`p-3 rounded-lg ${
                      isCurrentUser
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {message.sender.fullName},{" "}
                    {formatTimeAgo(message.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {!messagesLoading && allMessages.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có tin nhắn nào
            </p>
          </div>
        )}

        {/* Typing indicators */}
        {typingUsers.size > 0 && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
              <div>
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {selectedUser?.name || "User"} đang gõ...
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auto-scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={onSendMessage} className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={onNewMessageChange}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder={
                selectedUser
                  ? `Tin nhắn cho ${selectedUser.name}...`
                  : "Chọn cuộc trò chuyện để gửi tin nhắn"
              }
              disabled={!selectedUser || sendMessageMutation.isPending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage(e);
                }
              }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={
              !newMessage.trim() ||
              !selectedUser ||
              sendMessageMutation.isPending
            }
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </ComponentCard>
  );
};

// Loading Component
const LoadingState: React.FC = () => (
  <div>
    <PageBreadcrumb
      pageTitle="Chat"
      breadcrumbs={[{ label: "Home", path: "/" }]}
    />
    <ComponentCard title="Chat">
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Đang tải danh sách cuộc trò chuyện...
          </p>
        </div>
      </div>
    </ComponentCard>
  </div>
);

// Error Component
const ErrorState: React.FC = () => (
  <div>
    <PageBreadcrumb
      pageTitle="Chat"
      breadcrumbs={[{ label: "Home", path: "/" }]}
    />
    <ComponentCard title="Chat">
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Có lỗi xảy ra khi tải danh sách cuộc trò chuyện
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    </ComponentCard>
  </div>
);

// Empty State Component
const EmptyState: React.FC = () => (
  <div>
    <PageBreadcrumb
      pageTitle="Chat"
      breadcrumbs={[{ label: "Home", path: "/" }]}
    />
    <ComponentCard title="Chat">
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Chưa có cuộc trò chuyện nào
          </p>
        </div>
      </div>
    </ComponentCard>
  </div>
);

// Main Chat Page Component
export default function ChatPage() {
  // State
  const [selectedUser, setSelectedUser] =
    useState<TransformedConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [markedAsReadIds, setMarkedAsReadIds] = useState<Set<string>>(
    new Set()
  );
  const [realTimeMessages, setRealTimeMessages] = useState<MessageResponse[]>(
    []
  );
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Constants
  const breadcrumbItems = [{ label: "Home", path: "/" }];
  const currentUser = getCurrentUser();

  // API Hooks
  const { data: conversationsData, isLoading, error } = useConversationsQuery();
  const conversations = conversationsData?.data || [];

  // Transform conversations data
  const chatUsers = React.useMemo(
    () => transformConversationData(selectedUser?.id || "", conversations),
    [conversations, selectedUser?.id]
  );

  // WebSocket Hook
  const {
    joinConversation,
    leaveConversation,
    onTyping,
    onMessage,
    setTyping,
    sendMessage,
  } = useSocket();

  // Memoize conversation ID to prevent unnecessary re-fetches
  const selectedConversationId = React.useMemo(
    () => selectedUser?.id || "",
    [selectedUser?.id]
  );

  // Fetch messages for selected conversation
  const {
    data: messagesData,
    isLoading: messagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessagesInfiniteQuery(selectedConversationId, 50);

  // Mutations
  const sendMessageMutation = useSendMessageMutation();
  const markAsReadMutation = useMarkAsReadMutation();

  // Flatten messages from all pages and combine with realtime messages
  const allMessages = React.useMemo(() => {
    if (!messagesData?.pages) return realTimeMessages;

    const apiMessages = messagesData.pages
      .flatMap((page) => page.data.messages)
      .reverse();

    const messageMap = new Map<string, MessageResponse>();

    // Add API messages first
    apiMessages.forEach((msg) => {
      messageMap.set(msg.id, msg);
    });

    // Add realtime messages, will overwrite if ID already exists
    realTimeMessages.forEach((msg) => {
      messageMap.set(msg.id, msg);
    });

    // Convert back to array and sort by creation time
    return Array.from(messageMap.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messagesData, realTimeMessages]);

  // Effects
  useEffect(() => {
    if (!selectedConversationId) return;
    joinConversation(selectedConversationId);
    return () => {
      leaveConversation(selectedConversationId);
    };
  }, [selectedConversationId, joinConversation, leaveConversation]);

  // Set default selected user when data loads
  React.useEffect(() => {
    if (chatUsers.length > 0 && !selectedUser) {
      setSelectedUser(chatUsers[0]);
    }
  }, [chatUsers, selectedUser]);

  // Mark conversation as read when selected
  React.useEffect(() => {
    if (
      selectedUser?.id &&
      selectedUser.unread > 0 &&
      !markedAsReadIds.has(selectedUser.id)
    ) {
      const userId = selectedUser.id;
      markAsReadMutation.mutate(userId, {
        onSuccess: () => {
          setMarkedAsReadIds((prev) => new Set([...prev, userId]));
        },
      });
    }
  }, [selectedUser?.id, selectedUser?.unread]);

  // Clear marked as read when conversations refresh
  React.useEffect(() => {
    setMarkedAsReadIds(new Set());
  }, [conversationsData]);

  // WebSocket event listeners for realtime messaging
  React.useEffect(() => {
    const offMessage = onMessage((message) => {
      const isFromSelectedUser =
        Number(message.senderId) === Number(selectedUser?.receiverId);
      const isFromCurrentAdmin =
        Number(message.senderId) === Number(currentUser.id);
      if (isFromSelectedUser || isFromCurrentAdmin) {
        setRealTimeMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    });

    const offTyping = onTyping((data) => {
      if (String(data.userId) !== String(selectedUser?.receiverId)) return;
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    return () => {
      offMessage();
      offTyping();
    };
  }, [
    currentUser.id,
    selectedConversationId,
    onMessage,
    onTyping,
    selectedUser?.receiverId,
  ]);

  // Clear realtime messages when switching conversations
  React.useEffect(() => {
    setRealTimeMessages([]);
    setTypingUsers(new Set());
  }, [selectedUser?.id]);

  // Event Handlers
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNewMessage(value);
      setTyping(selectedConversationId, value.length > 0);
    },
    [selectedConversationId, setTyping]
  );

  const handleSendMessage = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const messageContent = newMessage.trim();
      if (!messageContent || !selectedUser?.receiverId) return;
      sendMessage(selectedConversationId, messageContent);
      setNewMessage("");
      setTyping(selectedConversationId, false);
    },
    [
      newMessage,
      selectedUser?.receiverId,
      selectedConversationId,
      sendMessage,
      setTyping,
    ]
  );

  const handleSelectUser = React.useCallback(
    (user: TransformedConversation) => {
      if (selectedUser?.id !== user.id) {
        setSelectedUser(user);
        setMarkedAsReadIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(user.id);
          return newSet;
        });
      }
      setShowUserList(false);
    },
    [selectedUser?.id]
  );

  const handleToggleUserList = React.useCallback(() => {
    setShowUserList(true);
  }, []);

  const handleCloseUserList = React.useCallback(() => {
    setShowUserList(false);
  }, []);

  // Render states
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (chatUsers.length === 0) return <EmptyState />;

  return (
    <div>
      <PageBreadcrumb pageTitle="Chat" breadcrumbs={breadcrumbItems} />

      {/* Main Chat Container */}
      <div className="relative">
        <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-3 h-[calc(100vh-200px)] lg:h-[510px] overflow-hidden">
          {/* Conversation List */}
          <ConversationList
            chatUsers={chatUsers}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
            showUserList={showUserList}
            onCloseUserList={handleCloseUserList}
          />

          {/* Chat Area */}
          <ChatArea
            selectedUser={selectedUser}
            allMessages={allMessages}
            messagesLoading={messagesLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            newMessage={newMessage}
            onNewMessageChange={handleInputChange}
            onSendMessage={handleSendMessage}
            typingUsers={typingUsers}
            currentUser={currentUser}
            sendMessageMutation={sendMessageMutation}
            onToggleUserList={handleToggleUserList}
          />
        </div>

        {/* Overlay for mobile when user list is open */}
        {showUserList && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleCloseUserList}
          />
        )}
      </div>
    </div>
  );
}
