import axiosInstance from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { ResponseData } from "@/types/response";
import { Coupon, CouponStatus } from "@/types/coupon";

const fetchCoupons = async (): Promise<ResponseData<Coupon[]>> => {
  const response = await axiosInstance.get("/coupons");
  return response.data;
};

export const useCouponsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COUPONS],
    queryFn: fetchCoupons,
  });
};

type CreateCouponPayload = {
  code: string;
  description?: string;
  type: string;
  value: number;
  minOrderAmout?: number | null;
  maxDiscountAmount?: number | null;
  startDate: string; // ISO string or date-time string
  endDate: string; // ISO string or date-time string
  usageLimit: number;
};

const createCoupon = async (
  payload: CreateCouponPayload
): Promise<ResponseData<Coupon>> => {
  const response = await axiosInstance.post("/coupons", payload);
  return response.data;
};

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCouponPayload) => createCoupon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUPONS] });
    },
  });
};

type UpdateCouponStatusPayload = {
  id: number;
  status: CouponStatus;
};

const updateCouponStatus = async (
  payload: UpdateCouponStatusPayload
): Promise<ResponseData<Coupon>> => {
  const response = await axiosInstance.patch(`/coupons/${payload.id}`, {
    status: payload.status,
  });
  return response.data;
};

export const useUpdateCouponStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCouponStatusPayload) =>
      updateCouponStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUPONS] });
    },
  });
};

const deleteCoupon = async (id: number): Promise<ResponseData<void>> => {
  const response = await axiosInstance.delete(`/coupons/${id}`);
  return response.data;
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUPONS] });
    },
  });
};
