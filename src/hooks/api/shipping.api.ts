import { ResponseData } from "@/types/response";
import axiosInstance from "./axios";
import { QUERY_KEYS } from "./queryKeys";
import { useQuery } from "@tanstack/react-query";

// Define the shipping fee calculation DTO interface
export interface CalculateShippingFeeDto {
  pick_province: string;
  pick_district: string;
  pick_ward?: string;
  pick_address?: string;
  province: string;
  district: string;
  ward?: string;
  address?: string;
  weight: number;
}

const calculateShippingFee = async (
  shippingData: CalculateShippingFeeDto
): Promise<ResponseData<{ shippingFee: number }>> => {
  const { data } = await axiosInstance.get("/shipping/fee", {
    params: shippingData,
  });
  return data;
};

export const useShippingFeeQuery = (shippingData: CalculateShippingFeeDto) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SHIPPING, shippingData],
    queryFn: () => calculateShippingFee(shippingData),
    enabled:
      !!shippingData &&
      !!shippingData.pick_province &&
      !!shippingData.province &&
      !!shippingData.weight,
  });
};
