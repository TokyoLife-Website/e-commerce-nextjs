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

const fetchAdminOrders = async (
  page?: number | string,
  size?: number | string,
  status?: OrderStatus,
  userId?: number
): Promise<ResponseData<Pagination<Order>>> => {
  const response = await axiosInstance.get("/orders/admin/all", {
    params: { page, size, status, userId },
  });
  return response.data;
};

const updateOrderStatus = async (
  orderCode: string,
  newStatus: OrderStatus
): Promise<ResponseData<Order>> => {
  const response = await axiosInstance.patch(`/orders/${orderCode}`, {
    newStatus,
  });
  return response.data;
};

const fetchOrder = async (orderCode: string): Promise<ResponseData<Order>> => {
  const response = await axiosInstance.get(`/orders/${orderCode}`);
  return response.data;
};

// Download order PDF
const downloadOrderPdf = async (orderCode: string): Promise<Blob> => {
  const response = await axiosInstance.get(`/orders/${orderCode}/pdf`, {
    responseType: "blob",
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

export const useAdminOrdersQuery = (
  page?: number | string,
  size?: number | string,
  status?: OrderStatus,
  userId?: number
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_ORDERS, page, size, status, userId],
    queryFn: () => fetchAdminOrders(page, size, status, userId),
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderCode,
      newStatus,
    }: {
      orderCode: string;
      newStatus: OrderStatus;
    }) => updateOrderStatus(orderCode, newStatus),
    onSuccess: (data, variables) => {
      // Invalidate all orders queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_ORDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDER(variables.orderCode)],
      });
    },
  });
};

export const useOrderQuery = (orderCode: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER(orderCode), orderCode],
    queryFn: () => fetchOrder(orderCode),
    enabled: !!orderCode,
  });
};

export const useDownloadOrderPdfMutation = () => {
  return useMutation({
    mutationFn: downloadOrderPdf,
    onSuccess: (blob, orderCode) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `order-${orderCode}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};
