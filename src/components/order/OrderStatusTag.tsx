import { OrderStatus } from "@/types/orderStatus";
import React, { FC } from "react";

interface OrderStatusTagProps {
  orderStatus: OrderStatus;
}

const STATUS_STYLES = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-600",
  [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-600",
  [OrderStatus.DELIVERING]: "bg-purple-100 text-purple-600",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-600",
  [OrderStatus.CANCELLED]: "bg-gray-100 text-gray-600",
  [OrderStatus.RETURNED]: "bg-red-100 text-red-600",
} as const;

export const getOrderStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "Pending";
    case OrderStatus.PROCESSING:
      return "Processing";
    case OrderStatus.DELIVERING:
      return "Delivering";
    case OrderStatus.DELIVERED:
      return "Delivered";
    case OrderStatus.CANCELLED:
      return "Cancelled";
    case OrderStatus.RETURNED:
      return "Returned";
    default:
      return status;
  }
};

const OrderStatusTag: FC<OrderStatusTagProps> = ({ orderStatus }) => {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[orderStatus]}`}
    >
      {getOrderStatusLabel(orderStatus)}
    </span>
  );
};

export default OrderStatusTag;
