import CustomButton from "@/components/layouts/CustomBtn";
import { Order, OrderItem } from "@/types/order";
import { OrderStatus } from "@/types/orderStatus";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const STATUS_STYLES = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-600",
  [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-600",
  [OrderStatus.DELIVERING]: "bg-purple-100 text-purple-600",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-600",
  [OrderStatus.CANCELLED]: "bg-gray-100 text-gray-600",
  [OrderStatus.RETURNED]: "bg-red-100 text-red-600",
} as const;

interface OrderTableProps {
  orders: Order[];
}

import React, { FC } from "react";
import EmptyOrder from "../icons/EmptyOrder";

const OrdersList: FC<OrderTableProps> = ({ orders }) => {
  if (!orders.length)
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
            <th className="p-4 font-semibold">Mã đơn hàng</th>
            <th className="p-4 font-semibold">Sản phẩm</th>
            <th className="p-4 font-semibold">Ngày mua</th>
            <th className="p-4 font-semibold">Tổng tiền</th>
            <th className="p-4 font-semibold">Trạng thái</th>
            <th className="p-4 font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-4">{order.code}</td>
              <td className="p-4">
                {order.items.reduce(
                  (acc: number, curr: OrderItem) => curr.quantity + acc,
                  0
                )}
              </td>
              <td className="p-4">
                {formatDate(order.createdAt, "DD/MM/YYYY")}
              </td>
              <td className="p-4 text-primary font-semibold">
                {formatCurrency(order.total)}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    STATUS_STYLES[order.status] || ""
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-4">
                <CustomButton
                  variant="outline"
                  size="small"
                  className="border-gray-200 px-3 py-2 text-black hover:bg-primary hover:text-white"
                >
                  Xem chi tiết
                </CustomButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
