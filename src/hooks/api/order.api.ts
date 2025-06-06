import { ResponseData } from "@/types/response";
import axiosInstance from "./axios";
import { CreateOrderDto, Order } from "@/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

const createOrder = async (
  createOrderDto: CreateOrderDto
): Promise<ResponseData<Order>> => {
  const { data } = await axiosInstance.post("/orders", createOrderDto);
  return data;
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.ORDERS], data);
    },
  });
};
