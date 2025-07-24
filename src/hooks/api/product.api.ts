import { CreateProductFormValues } from "@/schemas/createProductSchema";
import axiosInstance from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { ResponseData } from "@/types/response";
import { Pagination } from "@/types/paginate";
import { Product } from "@/types/product";

const createProduct = async (data: CreateProductFormValues) => {
  const response = await axiosInstance.post("/products", data);
  return response.data;
};

const fetchProducts = async (
  page?: number | string,
  size?: number | string,
  keyword?: string,
  color?: string,
  price?: string, // dạng 'min_max', ví dụ: '100_500'
  sort?: string
): Promise<ResponseData<Pagination<Product>>> => {
  const response = await axiosInstance.get("/products", {
    params: { page, size, keyword, color, price, sort },
  });
  return response.data;
};

const fetchProduct = async (
  id: string | number
): Promise<ResponseData<Product>> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

const fetchProductBySlug = async (
  slug: string
): Promise<
  ResponseData<Product & { starCounts: { [star: number]: number } }>
> => {
  const response = await axiosInstance.get(`/products/slug/${slug}`);
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

export const useProductBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: slug ? [QUERY_KEYS.PRODUCT(slug)] : [],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
};

type UseProductsQueryOptions = {
  page?: number | string;
  size?: number | string;
  keyword?: string;
  color?: string;
  price?: string;
  sort?: string;
  enabled?: boolean;
};

export const useProductsQuery = ({
  page,
  size,
  keyword,
  color,
  price,
  sort,
  enabled = true,
}: UseProductsQueryOptions) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, page, size, keyword, color, price, sort],
    queryFn: () => fetchProducts(page, size, keyword, color, price, sort),
    placeholderData: enabled ? (prev) => prev : undefined,
    enabled: enabled,
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
