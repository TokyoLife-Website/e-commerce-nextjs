import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { QUERY_KEYS } from "./queryKeys";
import { ResponseData } from "@/types/response";

// Types
export interface GeminiResponse {
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
  data: GeminiResponse;
  success: boolean;
}

// API Functions
const chatCompletion = async (
  data: ChatCompletionRequest
): Promise<ResponseData<ChatCompletionResponse>> => {
  const response = await axiosInstance.post("/gemini/chat", data, {
    timeout: 60000,
  });
  return response.data;
};

// React Query Hooks
export const useGeminiChatCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatCompletion,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AI_CONVERSATIONS],
      });
    },
    onError: (error) => {
      console.error("Gemini chat completion error:", error);
    },
  });
};

// Utility function to extract AI response content
export const extractGeminiResponse = (
  response: ChatCompletionResponse
): string => {
  return (
    response.data.choices[0].message.content ||
    "Xin lỗi, tôi không thể xử lý yêu cầu của bạn ngay lúc này. Vui lòng thử lại sau."
  );
};

// Utility function to check if response is successful
export const isGeminiResponseSuccessful = (
  response: ChatCompletionResponse
): boolean => {
  return response.success && !!response.data?.choices?.[0]?.message?.content;
};

// Utility function to get token usage information
export const getGeminiTokenUsage = (response: ChatCompletionResponse) => {
  return response.data?.usage || null;
};

// Utility function to get model information
export const getGeminiModelInfo = (
  response: ChatCompletionResponse
): string => {
  return response.data?.model || "unknown";
};
