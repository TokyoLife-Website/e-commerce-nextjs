"use client";
import NotFound from "@/app/not-found";
import Loading from "@/components/common/Loading";
import OrdersList from "@/components/order/OrdersList";
import ReviewPagination from "@/components/product/ReviewPagination";
import { useOrdersQuery } from "@/hooks/api/order.api";
import { OrderStatus } from "@/types/orderStatus";
import { useMemo, useState } from "react";

const TABS = [
  { id: "all", status: undefined, label: "Tất cả đơn hàng", active: true },
  { id: "pending", status: OrderStatus.PENDING, label: "Chờ thanh toán" },
  { id: "processing", status: OrderStatus.PROCESSING, label: "Đang xử lý" },
  { id: "delivering", status: OrderStatus.DELIVERING, label: "Đang giao" },
  { id: "delivered", status: OrderStatus.DELIVERED, label: "Đã giao" },
  { id: "cancelled", status: OrderStatus.CANCELLED, label: "Đã hủy" },
  { id: "returned", status: OrderStatus.RETURNED, label: "Hoàn hàng" },
] as const;

export default function OrderManagement() {
  const [status, setStatus] = useState<OrderStatus | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, error } = useOrdersQuery(status, currentPage);

  const orders = useMemo(() => {
    const res = data?.data?.items || [];
    return res;
  }, [data]);

  if (!orders || error) return <NotFound />;

  return (
    <div className="w-full max-w-6xl mx-auto bg-white">
      <div className="uppercase font-extrabold leading-6 text-xl mb-6 pb-6 border-b">
        Tất cả đơn hàng
      </div>
      <div className="border-b border-gray-200">
        <div className="flex justify-between" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatus(tab.status), setCurrentPage(1);
              }}
              role="tab"
              aria-selected={status === tab.status}
              aria-label={tab.label}
              className={`py-4 px-2 text-sm font-bold leading-[18px] border-b-2 transition-colors ${
                status === tab.status
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Loading size="small" />
      ) : (
        <>
          <OrdersList orders={orders} />
          {!!orders.length && (
            <div className="flex justify-center py-4">
              <ReviewPagination
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
                totalPages={data?.data.totalPages || 0}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
