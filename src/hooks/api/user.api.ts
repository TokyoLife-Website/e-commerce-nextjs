import { ChangePasswordFormData } from "@/schemas/changePasswordSchema";
import { ResponseData } from "@/types/response";
import { User } from "@/types/user";
import axiosInstance from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { personalInfoFormData } from "@/schemas/personalInfoSchema";
import { QUERY_KEYS } from "./queryKeys";

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

const fetchCurrentUser = async (): Promise<ResponseData<User>> => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};

const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await axiosInstance.post("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => fetchUpdatePassword(data),
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: personalInfoFormData) => fetchUpdateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });
};

export const useCurrentUserQuery = (isAuthenticated: boolean) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () => fetchCurrentUser(),
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  });
};
