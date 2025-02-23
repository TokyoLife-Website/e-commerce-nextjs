import { ChangePasswordFormData } from "@/schemas/changePasswordSchema";
import { ResponseData } from "@/types/response";
import { User } from "@/types/user";
import axiosInstance from "./axios";
import { useMutation } from "@tanstack/react-query";
import { personalInfoFormData } from "@/schemas/personalInfoSchema";

export type ChangePasswordDto = Omit<
  ChangePasswordFormData,
  "confirmNewPassword"
>;

const fetchUpdatePassword = async (
  data: ChangePasswordDto
): Promise<ResponseData<User>> => {
  const response = await axiosInstance.put(`/users/change-password`, data);
  return response.data;
};

const fetchUpdateUser = async (
  data: personalInfoFormData
): Promise<ResponseData<User>> => {
  const response = await axiosInstance.patch(`/users`, data);
  return response.data;
};

export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => fetchUpdatePassword(data),
  });
};

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: (data: personalInfoFormData) => fetchUpdateUser(data),
  });
};
