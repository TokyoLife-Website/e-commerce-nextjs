"use client";
import React, { FC, useState } from "react";
import CommentItem from "./CommentItem";
import { useReviewsQuery } from "@/hooks/api/review.api";
import { formatDate } from "@/utils/formatDate";
import EmptyComment from "./EmptyComment";
import ReviewPagination from "./ReviewPagination";

interface CommentListProps {
  productId: number;
}

const CommentList: FC<CommentListProps> = ({ productId }) => {
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data } = useReviewsQuery(productId, rating, currentPage);
  return (
    <div>
      <div className="flex items-center gap-4 py-4 border-y border-[#eeeeee]">
        <span className="font-semibold text-sm leading-[18px]">
          Lọc đánh giá
        </span>
        <div className="flex gap-3 flex-wrap items-center">
          <button
            className={`border hover:bg-primary/5 px-4 py-2 rounded ${
              rating === undefined
                ? "border-primary text-primary bg-white"
                : "bg-[#f5f5f5]"
            }`}
            onClick={() => {
              setRating(undefined);
              setCurrentPage(1);
            }}
          >
            Tất cả
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              className={`border px-4 py-2 rounded hover:bg-primary/5 ${
                rating === star
                  ? "border-primary text-primary bg-white"
                  : "bg-[#f5f5f5]"
              }`}
              onClick={() => {
                setRating(star);
                setCurrentPage(1);
              }}
            >
              {star} sao
            </button>
          ))}
        </div>
      </div>
      {!!data?.data?.items.length &&
        data?.data.items.map((item) => (
          <CommentItem
            key={item.id}
            avatarAlt={item.user.firstName}
            color={item.sku.color}
            rating={item.rating}
            comment={item.comment}
            date={formatDate(item.createdAt, "DD/MM/YYYY")}
            size={item.sku.size}
            userName={`${item.user.firstName} ${item.user.lastName}`}
          />
        ))}
      {data?.data?.items && data?.data?.items.length === 0 && (
        <EmptyComment content="Không có đánh giá phù hợp" />
      )}
      <ReviewPagination
        currentPage={currentPage}
        totalPages={data?.data.totalPages || 0}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default CommentList;
