import { ResponseData } from "@/types/response";
import axiosInstance from "./axios";
import { QUERY_KEYS } from "./queryKeys";
import { Address } from "@/types/address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchUserAddresses = async (): Promise<ResponseData<Address[]>> => {
  const response = await axiosInstance.get(`/users/addresses`);
  return response.data;
};

const deleteUserAddress = async (addressId: number) => {
  const response = await axiosInstance.delete(`/addresses/${addressId}`);
  return response.data;
};

const updateUserAddress = async (addressId: number, data: any) => {
  const response = await axiosInstance.patch(`/addresses/${addressId}`, data); // Add the data parameter
  return response.data;
};

export const useUserAddressesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_ADDRESSES],
    queryFn: () => fetchUserAddresses(),
    staleTime: 5 * 60 * 1000,
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
      updateAddressDto: any;
    }) => updateUserAddress(addressId, updateAddressDto),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ADDRESSES] });
    },
  });
};
