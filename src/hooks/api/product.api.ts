import { CreateProductFormValues } from "@/schemas/createProductSchema";
import axiosInstance from "./axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

const createProduct = async (data: CreateProductFormValues) => {
  console.log(data);
  const response = await axiosInstance.post("/products", data);
  return response.data;
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
