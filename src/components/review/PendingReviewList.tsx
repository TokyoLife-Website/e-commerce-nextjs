import React, { FC } from "react";
import CustomButton from "../layouts/CustomBtn";
import EmptyOrder from "../icons/EmptyOrder";
import { OrderItem } from "@/types/order";
import { formatDate } from "@/utils/formatDate";
import dayjs from "dayjs";
import { ReviewItem } from "@/types/review";

interface Props {
  orderItems: ReviewItem[];
}

const PendingReviewList: FC<Props> = ({ orderItems }) => {
  if (!orderItems.length)
    return (
      <div className="flex flex-col gap-3 my-[100px] items-center">
        <EmptyOrder />
        <span className="text-sm">Đơn hàng trống</span>
      </div>
    );
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full rounded-lg text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-4 min-w-32 font-semibold">Hình ảnh</th>
            <th className="p-4 min-w-32 font-semibold">Tên sản phẩm</th>
            <th className="p-4 min-w-32 font-semibold">Phiên bản</th>
            <th className="p-4 min-w-32 font-semibold">Ngày mua</th>
            <th className="p-4 min-w-32 font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((orderItem) => (
            <tr>
              <td className="p-4">
                {" "}
                <img
                  src={orderItem?.productImage || ""}
                  alt={orderItem.productName}
                  className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded"
                />
              </td>
              <td className="p-4">{orderItem.productName}</td>
              <td className="p-4 text-primary font-semibold">
                Size {orderItem.size} - {orderItem.color}
              </td>
              <td className="p-4">
                {formatDate(
                  orderItem?.orderDate || dayjs().toDate(),
                  "DD/MM/YYYY"
                )}
              </td>
              <td className="p-4">
                <CustomButton
                  href={`/profile/orders/`}
                  variant="outline"
                  size="small"
                  className="border-gray-200 px-3 py-2 text-black hover:bg-primary hover:text-white"
                >
                  Đánh giá
                </CustomButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingReviewList;
