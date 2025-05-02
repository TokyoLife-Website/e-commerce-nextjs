import axiosInstance from "./axios";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { ResponseData } from "@/types/response";
import { Pagination } from "@/types/paginate";
import { Review } from "@/types/review";

const fetchReviews = async (
  productId: number | string,
  rating?: number | string,
  page?: number | string,
  size?: number | string
): Promise<ResponseData<Pagination<Review>>> => {
  const response = await axiosInstance.get("/reviews", {
    params: { page, size, rating, productId },
  });
  return response.data;
};

export const useReviewsQuery = (
  productId: number | string,
  rating?: number | string,
  page?: number | string,
  size?: number | string
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, page, size, rating, productId],
    queryFn: () => fetchReviews(productId, rating, page, size),
    enabled: !!productId,
    staleTime: 5000,
  });
};
