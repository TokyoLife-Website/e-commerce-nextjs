"use client";
import NotFound from "@/app/not-found";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/common/Pagination";
import PendingReviewList from "@/components/review/PendingReviewList";
import ReviewedList from "@/components/review/ReviewedList";
import { useReviewItemsQuery } from "@/hooks/api/review.api";
import { Review, ReviewItem, ReviewStatus } from "@/types/review";
import { useMemo, useState } from "react";

const TABS = [
  { id: 1, status: ReviewStatus.NOT_REVIEWED, label: "Chưa đánh giá" },
  { id: 2, status: ReviewStatus.REVIEWED, label: "Đã đánh giá" },
] as const;

export default function Home() {
  const [isReviewed, setIsReviewed] = useState<ReviewStatus>(
    ReviewStatus.NOT_REVIEWED
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, error } = useReviewItemsQuery(
    isReviewed,
    currentPage
  );

  const reviewItems = useMemo(() => {
    const res = data?.data?.items || [];
    return res;
  }, [data]);
  if (!reviewItems || error) return <NotFound />;
  return (
    <div className="w-full max-w-6xl mx-auto bg-white">
      <div className="uppercase font-extrabold leading-6 text-xl mb-6 pb-6 border-b">
        Đánh giá của tôi
      </div>
      <div className="border-b border-gray-200">
        <div className="flex" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isReviewed === tab.status}
              aria-label={tab.label}
              onClick={() => {
                setIsReviewed(tab.status);
                setCurrentPage(1);
              }}
              className={`p-4 text-sm font-bold leading-[18px] border-b-2 transition-colors ${
                isReviewed === tab.status
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {isLoading && <Loading size="small" />}
      {isReviewed === ReviewStatus.REVIEWED ? (
        <ReviewedList reviewedListData={reviewItems as ReviewItem[]} />
      ) : (
        <PendingReviewList orderItems={reviewItems as ReviewItem[]} />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={data?.data.totalPages || 0}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
