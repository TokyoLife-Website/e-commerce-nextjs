import { useMutation } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { ResponseData } from "@/types/response";
import { LoginFormData } from "@/components/auth/LoginForm";
import { RegisterFormData } from "@/components/auth/RegisterForm";

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

const fetchLogin = async (
  data: LoginFormData
): Promise<ResponseData<TokenResponse>> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

const fetchRegister = async (
  data: RegisterFormData
): Promise<ResponseData<null>> => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

const fetchLogout = async (
  refreshToken: string
): Promise<ResponseData<null>> => {
  return await axiosInstance.post("/auth/logout", { refreshToken });
};

export const fetchRefreshToken = async (
  refreshToken: string
): Promise<ResponseData<TokenResponse>> => {
  const response = await axiosInstance.post("/auth/refresh-token", {
    refreshToken,
  });
  return response.data;
};

const fetchForgotPassword = async (data): Promise<ResponseData<null>> => {
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
    mutationFn: (data) => fetchForgotPassword(data),
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => fetchLogout(refreshToken),
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
