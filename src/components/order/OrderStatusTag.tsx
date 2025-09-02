import { OrderStatus } from "@/types/orderStatus";
import React, { FC } from "react";

interface OrderStatusTagProps {
  orderStatus: OrderStatus;
}

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return "bg-green-100 text-green-600";
    case OrderStatus.PROCESSING:
      return "bg-blue-100 text-blue-600";
    case OrderStatus.DELIVERING:
      return "bg-purple-100 text-purple-600";
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-600";
    case OrderStatus.CANCELLED:
      return "bg-gray-100 text-gray-600";
    case OrderStatus.RETURNED:
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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
      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
        orderStatus
      )}`}
    >
      {getOrderStatusLabel(orderStatus)}
    </span>
  );
};

export default OrderStatusTag;
