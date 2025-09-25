import { Category } from "@/types/category";
import { ResponseData } from "@/types/response";
import axiosInstance from "./axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

const fetchCategory = async (): Promise<ResponseData<Category[]>> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

const fetchCategoryBySlug = async (
  slug: string
): Promise<ResponseData<Category>> => {
  const response = await axiosInstance.get(`/categories/${slug}`);
  return response.data;
};

// Interface cho dữ liệu tạo category mới
export interface CreateCategoryData {
  name: string;
  slug: string;
  description: string;
  parentId?: number;
}

// Function tạo category mới
const createCategory = async (
  categoryData: CreateCategoryData
): Promise<ResponseData<Category>> => {
  const response = await axiosInstance.post("/categories", categoryData);
  return response.data;
};

// Hook để fetch danh sách categories
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: fetchCategory,
  });
};

// Hook để fetch category theo slug
export const useCategoryBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: slug ? [QUERY_KEYS.CATEGORY, slug] : [],
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: !!slug,
  });
};

// Hook để tạo category mới
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate và refetch danh sách categories sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });
};
