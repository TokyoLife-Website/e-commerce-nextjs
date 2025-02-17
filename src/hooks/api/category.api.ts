import { Category } from "@/types/category";
import { ResponseData } from "@/types/response";
import axiosInstance from "./axios";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

const fetchCategory = async (): Promise<ResponseData<Category[]>> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: fetchCategory,
    staleTime: 5 * 60 * 1000,
  });
};
