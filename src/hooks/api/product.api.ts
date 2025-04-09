import { CreateProductFormValues } from "@/schemas/createProductSchema";
import axiosInstance from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { ResponseData } from "@/types/response";
import { Pagination } from "@/types/paginate";

const createProduct = async (data: CreateProductFormValues) => {
  const response = await axiosInstance.post("/products", data);
  return response.data;
};

const fetchProducts = async (
  page?: number | string,
  size?: number | string
): Promise<ResponseData<Pagination<any>>> => {
  const response = await axiosInstance.get("/products", {
    params: { page, size },
  });
  return response.data;
};

const fetchProduct = async (
  id: string | number
): Promise<ResponseData<any>> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

const updateProduct = async (id: number, data: CreateProductFormValues) => {
  const response = await axiosInstance.patch(`/products/${id}`, data);
  return response.data;
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProductFormValues }) =>
      updateProduct(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT(variables.id)],
      });
    },
  });
};

export const useProductQuery = (id: string | number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT(id)],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
};

export const useProductsQuery = (
  page?: number | string,
  size?: number | string
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, page, size],
    queryFn: () => fetchProducts(page, size),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductFormValues) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
  });
};
