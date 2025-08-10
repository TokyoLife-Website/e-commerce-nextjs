import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axiosInstance from "./axios";
import { QUERY_KEYS } from "./queryKeys";
import { ResponseData } from "@/types/response";

// Types
export interface ConversationResponse {
  id: string;
  receiverId: number;
  receiver: {
    id: number;
    fullName: string;
    email: string;
    avatar?: string;
  };
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface MessageResponse {
  id: string;
  content: string;
  senderId: number;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: number;
    fullName: string;
    avatar?: string;
  };
}

export interface SendMessageDto {
  content: string;
  conversationId: number;
}

export interface MessagesListResponse {
  messages: MessageResponse[];
  total: number;
}

// API Functions
const fetchConversations = async (): Promise<
  ResponseData<ConversationResponse[]>
> => {
  const response = await axiosInstance.get("/chat/conversations");
  return response.data;
};

const fetchMessages = async (
  conversationId: string,
  page: number = 1,
  limit: number = 50
): Promise<ResponseData<MessagesListResponse>> => {
  const response = await axiosInstance.get(
    `/chat/conversations/${conversationId}/messages`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

const sendMessage = async (
  data: SendMessageDto
): Promise<ResponseData<MessageResponse>> => {
  const response = await axiosInstance.post("/chat/messages", data);
  return response.data;
};

const markAsRead = async (
  conversationId: string
): Promise<ResponseData<{ message: string }>> => {
  const response = await axiosInstance.put(
    `/chat/conversations/${conversationId}/read`
  );
  return response.data;
};

const createConversation = async (
  receiverId: number
): Promise<ResponseData<{ conversationId: string }>> => {
  const response = await axiosInstance.post("/chat/conversations", {
    receiverId,
  });
  return response.data;
};

// React Query Hooks

// Get conversations list
export const useConversationsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CONVERSATIONS],
    queryFn: () => fetchConversations(),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

// Get messages with infinite scroll
export const useMessagesInfiniteQuery = (
  conversationId: string,
  limit: number = 50
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.CHAT_MESSAGES, conversationId],
    queryFn: ({ pageParam = 1 }) =>
      fetchMessages(conversationId, pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const typedLastPage = lastPage as ResponseData<MessagesListResponse>;
      const typedAllPages = allPages as ResponseData<MessagesListResponse>[];

      const totalMessages = typedLastPage.data.total;
      const loadedMessages = typedAllPages.reduce(
        (count, page) => count + page.data.messages.length,
        0
      );
      return loadedMessages < totalMessages ? allPages.length + 1 : undefined;
    },
    enabled: !!conversationId,
    staleTime: 60000, // 1 minute
  });
};

// Get messages (regular pagination)
export const useMessagesQuery = (
  conversationId: string,
  page: number = 1,
  limit: number = 50
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAT_MESSAGES, conversationId, page, limit],
    queryFn: () => fetchMessages(conversationId, page, limit),
    enabled: !!conversationId,
    staleTime: 60000, // 1 minute
  });
};

// Send message mutation
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageDto) => sendMessage(data),
    onSuccess: (response, variables) => {
      // Invalidate conversations to update last message and unread count
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });

      // Invalidate messages for the specific conversation
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHAT_MESSAGES],
        predicate: (query) => {
          const [key, conversationId] = query.queryKey;
          return key === QUERY_KEYS.CHAT_MESSAGES;
        },
      });
    },
  });
};

// Mark as read mutation
export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markAsRead(conversationId),
    onSuccess: (response, conversationId) => {
      // Invalidate conversations to update unread count
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });

      // Invalidate messages for the specific conversation to reflect read status
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHAT_MESSAGES, conversationId],
      });
    },
  });
};

// Create conversation mutation
export const useCreateConversationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: number) => createConversation(receiverId),
    onSuccess: () => {
      // Invalidate conversations to show the new conversation
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
    },
  });
};
