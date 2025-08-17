import { useMutation } from "@tanstack/react-query";
import axiosInstance from "./axios";
import axios from "axios";
import { ResponseData } from "@/types/response";
import { LoginFormData } from "@/components/layouts/modals/LoginForm";
import { RegisterFormData } from "@/components/layouts/modals/RegisterForm";
import { ForgotPasswordFormData } from "@/schemas/forgotPasswordSchema";
import { User } from "@/types/user";

// Create a separate axios instance for refresh token with credentials
const refreshAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true, // Enable credentials for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface VerifyOTPPayload {
  otp: string;
  email: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  email: string;
}

const fetchLogin = async (data: LoginFormData): Promise<ResponseData<User>> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

const fetchRegister = async (
  data: RegisterFormData
): Promise<ResponseData<null>> => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

const fetchLogout = async (): Promise<ResponseData<null>> => {
  // Không cần gửi refreshToken trong body nữa vì nó sẽ được gửi tự động qua cookie
  return await axiosInstance.post("/auth/logout");
};

export const fetchRefreshToken = async (): Promise<
  ResponseData<TokenResponse>
> => {
  try {
    // Không cần gửi refreshToken trong body nữa vì nó sẽ được gửi tự động qua cookie
    const response = await refreshAxiosInstance.post("/auth/refresh-token");
    return response.data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

const fetchForgotPassword = async (
  data: ForgotPasswordFormData
): Promise<ResponseData<null>> => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};

const fetchVerifyOTP = async (
  data: VerifyOTPPayload
): Promise<ResponseData<null>> => {
  const response = await axiosInstance.post("/auth/verify-otp", data);
  return response.data;
};

const fetchResetPassword = async (
  data: ResetPasswordPayload
): Promise<ResponseData<null>> => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => fetchLogin(data),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => fetchRegister(data),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) => fetchForgotPassword(data),
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => fetchLogout(), // Không cần tham số nữa
  });
};

export const useVerifyOTPMutation = () => {
  return useMutation({
    mutationFn: (data: VerifyOTPPayload) => fetchVerifyOTP(data),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => fetchResetPassword(data),
  });
};
