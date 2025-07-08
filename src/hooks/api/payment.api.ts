import { ResponseData } from "@/types/response";
import axiosInstance from "./axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

export interface CreatePaymentUrlDto {
  orderId: string;
  amount: number;
  orderInfo: string;
  returnUrl?: string;
  ipAddr: string;
  locale?: string;
}

const createVNPayPayment = async (
  data: CreatePaymentUrlDto
): Promise<
  ResponseData<{
    paymentUrl: string;
  }>
> => {
  const response = await axiosInstance.post("/payment/vnpay/create", data);
  return response.data;
};

// Kiểm tra trạng thái đơn hàng (nếu cần)
export const useVNPayURLMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVNPayPayment,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.PAYMENT], data);
    },
  });
};
