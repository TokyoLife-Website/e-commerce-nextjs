import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { QUERY_KEYS } from "./queryKeys";
import { ResponseData } from "@/types/response";

// Types
export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatCompletionRequest {
  messages: string;
}

export interface ChatCompletionResponse {
  data: DeepSeekResponse;
  success: boolean;
}

// API Functions
const chatCompletion = async (
  data: ChatCompletionRequest
): Promise<ResponseData<ChatCompletionResponse>> => {
  const response = await axiosInstance.post("/deepseek/chat", data, {
    timeout: 60000,
  });
  return response.data;
};

// React Query Hooks
export const useChatCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatCompletion,
    onSuccess: (data) => {
      // Invalidate AI conversations cache if needed
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AI_CONVERSATIONS],
      });
    },
    onError: (error) => {
      console.error("DeepSeek chat completion error:", error);
    },
  });
};

// Utility function to extract AI response content
export const extractAIResponse = (response: ChatCompletionResponse): string => {
  return (
    response.data.choices[0].message.content ||
    "Xin lỗi, tôi không thể xử lý yêu cầu của bạn ngay lúc này. Vui lòng thử lại sau."
  );
};

// Utility function to check if response is successful
export const isResponseSuccessful = (
  response: ChatCompletionResponse
): boolean => {
  return response.success && !!response.data?.choices?.[0]?.message?.content;
};

// Utility function to get token usage information
export const getTokenUsage = (response: ChatCompletionResponse) => {
  return response.data?.usage || null;
};

// Utility function to get model information
export const getModelInfo = (response: ChatCompletionResponse): string => {
  return response.data?.model || "unknown";
};
