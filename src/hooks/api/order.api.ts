import { ResponseData } from "@/types/response";
import axiosInstance from "./axios";
import { CreateOrderDto, Order } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { OrderStatus } from "@/types/orderStatus";
import { Pagination } from "@/types/paginate";

const createOrder = async (
  createOrderDto: CreateOrderDto
): Promise<ResponseData<Order>> => {
  const { data } = await axiosInstance.post("/orders", createOrderDto);
  return data;
};

const fetchOrders = async (
  page?: number | string,
  size?: number | string,
  status?: OrderStatus
): Promise<ResponseData<Pagination<Order>>> => {
  const response = await axiosInstance.get("/orders", {
    params: { page, size, status },
  });
  return response.data;
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

export const useOrdersQuery = (
  status?: OrderStatus,
  page?: number | string,
  size?: number | string
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, status, page, size],
    queryFn: () => fetchOrders(page, size, status),
  });
};
