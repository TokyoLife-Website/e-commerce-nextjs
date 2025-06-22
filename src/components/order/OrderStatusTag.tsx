import { OrderStatus, STATUS_STYLES } from "@/types/orderStatus";
import React, { FC } from "react";

interface OrderStatusTagProps {
  orderStatus: OrderStatus;
}

const OrderStatusTag: FC<OrderStatusTagProps> = ({ orderStatus }) => {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[orderStatus]}`}
    >
      {orderStatus}
    </span>
  );
};

export default OrderStatusTag;
