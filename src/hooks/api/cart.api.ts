import axiosInstance from './axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { Product } from '@/types/product';
import { ResponseData } from '@/types/response';

export interface CreateCartItemDto {
  productSkuId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  cartItemId: number;
  productSkuId: number;
  quantity: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  total: number;
  sku: {
    id: number;
    product: Product;
  };
}

export interface Cart {
  id: number;
  total: number;
  items: CartItem[];
}

// API functions
const getCart = async (): Promise<Cart> => {
  const { data } = await axiosInstance.get('/carts');
  return data;
};

const addToCart = async (createCartItemDto: CreateCartItemDto): Promise<ResponseData<Cart>> => {
  const { data } = await axiosInstance.post('/carts', createCartItemDto);
  return data;
};

const updateCartItem = async (updateCartItemDto: UpdateCartItemDto): Promise<Cart> => {
  const { data } = await axiosInstance.put('/carts', updateCartItemDto);
  return data;
};

const removeCartItem = async (cartItemId: number): Promise<Cart> => {
  const { data } = await axiosInstance.delete(`/carts/${cartItemId}`);
  return data;
};

const clearCart = async (): Promise<void> => {
  await axiosInstance.delete('/carts');
};

// React Query Hooks
export const useCart = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: getCart,
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      // Invalidate and refetch cart data
      queryClient.setQueryData([QUERY_KEYS.CART], data);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.CART], data);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.CART], data);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.setQueryData([QUERY_KEYS.CART], { items: [], total: 0 });
    },
  });
}; 