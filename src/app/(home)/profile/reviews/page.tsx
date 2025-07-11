"use client";
import NotFound from "@/app/not-found";
import Loading from "@/components/common/Loading";
import OrdersList from "@/components/order/OrdersList";
import ReviewPagination from "@/components/product/ReviewPagination";
import PendingReviewList from "@/components/review/PendingReviewList";
import ReviewedList from "@/components/review/ReviewedList";
import { useOrdersQuery } from "@/hooks/api/order.api";
import { OrderStatus } from "@/types/orderStatus";
import { useMemo, useState } from "react";

const TABS = [
  { id: 1, status: false, label: "Chưa đánh giá" },
  { id: 2, status: true, label: "Đã đánh giá" },
] as const;

export default function Home() {
  const [isReviewed, setIsReviewed] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, error } = useOrdersQuery(undefined, currentPage);

  const orders = useMemo(() => {
    const res = data?.data?.items || [];
    return res;
  }, [data]);

  if (!orders || error) return <NotFound />;
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
              onClick={() => setIsReviewed(tab.status)}
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
      {!isLoading &&
        (isReviewed ? (
          <ReviewedList />
        ) : (
          <PendingReviewList orderItems={[]} />
          // <>
          //   <OrdersList orders={orders} />
          //   {!!orders.length && (
          //     <div className="flex justify-center py-4">
          //       <ReviewPagination
          //         currentPage={currentPage}
          //         onPageChange={(page) => setCurrentPage(page)}
          //         totalPages={data?.data.totalPages || 0}
          //       />
          //     </div>
          //   )}
          // </>
        ))}
    </div>
  );
}
