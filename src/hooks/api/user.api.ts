import { ChangePasswordFormData } from "@/schemas/changePasswordSchema";
import { ResponseData } from "@/types/response";
import { User } from "@/types/user";
import axiosInstance from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { personalInfoFormData } from "@/schemas/personalInfoSchema";
import { QUERY_KEYS } from "./queryKeys";
import { Pagination } from "@/types/paginate";

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

// Users list
const fetchUsers = async (
  page?: number | string,
  size?: number | string
): Promise<ResponseData<Pagination<User>>> => {
  const response = await axiosInstance.get("/users", {
    params: { page, size },
  });
  return response.data;
};

type UseUsersQueryOptions = {
  page?: number | string;
  size?: number | string;
  enabled?: boolean;
};

export const useUsersQuery = ({
  page,
  size,
  enabled = true,
}: UseUsersQueryOptions) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, page, size],
    queryFn: () => fetchUsers(page, size),
    placeholderData: enabled ? (prev) => prev : undefined,
    enabled,
  });
};

// Update user status (isActive)
const updateUserStatus = async (
  id: number,
  isActive: boolean
): Promise<ResponseData<User>> => {
  const response = await axiosInstance.patch(`/users/${id}/status`, {
    isActive,
  });
  return response.data;
};

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
};
