import axiosInstance from "./axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { ResponseData } from "@/types/response";
import { Pagination } from "@/types/paginate";
import { Review, ReviewItem, ReviewStatus } from "@/types/review";

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

const fetchReviewItemByStatus = async (
  status: ReviewStatus,
  page?: number | string,
  size?: number | string
): Promise<ResponseData<Pagination<Review>>> => {
  const response = await axiosInstance.get("/reviews/products", {
    params: { page, size, status },
  });
  return response.data;
};

const fetchAllReviewsForAdmin = async (
  rating?: number | string,
  isActive?: boolean,
  page?: number | string,
  size?: number | string
): Promise<ResponseData<Pagination<Review>>> => {
  const response = await axiosInstance.get("/reviews/admin", {
    params: { page, size, rating, isActive },
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
  });
};

export const useAllReviewsForAdminQuery = (
  rating?: number | string,
  isActive?: boolean,
  page?: number | string,
  size?: number | string
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, "admin", page, size, rating, isActive],
    queryFn: () => fetchAllReviewsForAdmin(rating, isActive, page, size),
  });
};

export const useReviewItemsQuery = (
  status: ReviewStatus,
  page?: number | string,
  size?: number | string
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, page, size, status],
    queryFn: () => fetchReviewItemByStatus(status, page, size),
    enabled: !!status,
  });
};

interface CreateReviewDto {
  orderItemId: number;
  rating: number;
  comment: string;
}

const createReview = async (data: CreateReviewDto) => {
  const response = await axiosInstance.post("/reviews", data);
  return response.data;
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      // Invalidate review queries if needed
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] });
    },
  });
};

const updateReviewStatus = async (reviewId: number, isActive: boolean) => {
  const response = await axiosInstance.patch(`/reviews/${reviewId}/status`, {
    isActive,
  });
  return response.data;
};

export const useUpdateReviewStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      isActive,
    }: {
      reviewId: number;
      isActive: boolean;
    }) => updateReviewStatus(reviewId, isActive),
    onSuccess: () => {
      // Invalidate review queries to refresh the data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] });
    },
  });
};
