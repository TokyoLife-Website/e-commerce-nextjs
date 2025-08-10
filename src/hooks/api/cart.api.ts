import axiosInstance from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { ResponseData } from "@/types/response";
import { Cart } from "@/types/cartItem";

export interface CreateCartItemDto {
  productSkuId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  cartItemId: number;
  productSkuId?: number | null;
  quantity?: number | null;
}

// API functions
const getCart = async (): Promise<ResponseData<Cart>> => {
  const { data } = await axiosInstance.get("/carts");
  return data;
};

const addToCart = async (
  createCartItemDto: CreateCartItemDto
): Promise<ResponseData<Cart>> => {
  const { data } = await axiosInstance.post("/carts", createCartItemDto);
  return data;
};

const applyCoupon = async (code: string): Promise<ResponseData<Cart>> => {
  const { data } = await axiosInstance.post("/carts/apply-coupon", { code });
  return data;
};

const removeCoupon = async (): Promise<ResponseData<Cart>> => {
  const { data } = await axiosInstance.delete("/carts/remove-coupon");
  return data;
};

const updateCartItem = async (
  updateCartItemDto: UpdateCartItemDto
): Promise<ResponseData<Cart>> => {
  const { data } = await axiosInstance.patch("/carts", updateCartItemDto);
  return data;
};

const removeCartItem = async (
  cartItemId: number
): Promise<ResponseData<Cart>> => {
  const { data } = await axiosInstance.delete(`/carts/${cartItemId}`);
  return data;
};

const clearCart = async (): Promise<void> => {
  await axiosInstance.delete("/carts");
};

// React Query Hooks
export const useCarts = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CARTS],
    queryFn: getCart,
    enabled: options?.enabled,
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      // Invalidate and refetch cart data
      queryClient.setQueryData([QUERY_KEYS.CARTS], data);
    },
  });
};

export const useApplyCouponMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyCoupon,
    onSuccess: (data) => {
      // Invalidate and refetch cart data
      queryClient.setQueryData([QUERY_KEYS.CARTS], data);
    },
  });
};

export const useRemoveCouponMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCoupon,
    onSuccess: (data) => {
      // Invalidate and refetch cart data
      queryClient.setQueryData([QUERY_KEYS.CARTS], data);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.CARTS], data);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.CARTS], data);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.setQueryData([QUERY_KEYS.CARTS], { items: [], total: 0 });
    },
  });
};
