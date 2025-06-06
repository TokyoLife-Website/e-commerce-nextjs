import { ResponseData } from "@/types/response";
import axiosInstance from "./axios";
import { QUERY_KEYS } from "./queryKeys";
import { Address } from "@/types/address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressFormData } from "@/schemas/addressSchema";

const fetchUserAddresses = async (): Promise<ResponseData<Address[]>> => {
  const response = await axiosInstance.get(`/users/addresses`);
  return response.data;
};

const deleteUserAddress = async (addressId: number) => {
  const response = await axiosInstance.delete(`/addresses/${addressId}`);
  return response.data;
};

const updateUserAddress = async (addressId: number, data: AddressFormData) => {
  const response = await axiosInstance.patch(`/addresses/${addressId}`, data);
  return response.data;
};

const createUserAddress = async (data: AddressFormData) => {
  const response = await axiosInstance.post(`/addresses`, data);
  return response.data;
};

export const useUserAddressesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_ADDRESSES],
    queryFn: () => fetchUserAddresses(),
  });
};

export const useDeleteUserAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => deleteUserAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ADDRESSES] });
    },
  });
};

export const useUpdateUserAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      updateAddressDto,
    }: {
      addressId: number;
      updateAddressDto: AddressFormData;
    }) => updateUserAddress(addressId, updateAddressDto),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ADDRESSES] });
    },
  });
};

export const useCreateUserAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createAddressDto: AddressFormData) =>
      createUserAddress(createAddressDto),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ADDRESSES] });
    },
  });
};
