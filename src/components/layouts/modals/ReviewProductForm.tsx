import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { useCreateReviewMutation } from "@/hooks/api/review.api";
import { closeModal } from "@/redux/modalSlice";

const ReviewProductForm = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const modalData = useAppSelector((state) => state.modal.data) as {
    orderItemId?: number;
  } | null;
  const dispatch = useAppDispatch();
  const mutation = useCreateReviewMutation();

  const orderItemId = modalData?.orderItemId;

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderItemId) return;
    mutation.mutate(
      { orderItemId, rating, comment },
      {
        onSuccess: () => {
          dispatch(closeModal());
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[582px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 py-16 px-24 bg-white"
    >
      <div className="font-extrabold text-center text-xl leading-6  mb-6 ">
        Đánh giá sản phẩm
      </div>
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleStarClick(star)}
            className={`text-2xl cursor-pointer ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            role="button"
            aria-label={`Chọn ${star} sao`}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2 mb-4"
        placeholder="Nhập đánh giá của bạn..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={rating === 0 || !comment.trim() || mutation.isPending}
      >
        {mutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
      {mutation.isError && (
        <div className="text-red-500 mt-2 text-sm">
          {(mutation.error as any)?.response?.data?.message || "Có lỗi xảy ra!"}
        </div>
      )}
    </form>
  );
};

export default ReviewProductForm;
