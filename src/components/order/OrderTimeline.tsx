import React from "react";
import { Typography } from "@mui/material";
import { OrderStatus } from "@/types/orderStatus";
import { OrderStatusHistory } from "@/types/order";
import { formatDate } from "@/utils/timeFormat";

interface OrderTimelineProps {
  orderCode: string;
  orderStatusHistory?: OrderStatusHistory[];
  orderCreatedAt: Date;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({
  orderCode,
  orderStatusHistory,
  orderCreatedAt,
}) => {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-8">
        {orderStatusHistory && orderStatusHistory.length > 0 ? (
          orderStatusHistory.map((history) => (
            <div key={history.id} className="relative flex items-start">
              <div
                className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                  history.status === OrderStatus.PENDING
                    ? "bg-yellow-500"
                    : history.status === OrderStatus.PROCESSING
                    ? "bg-blue-500"
                    : history.status === OrderStatus.DELIVERING
                    ? "bg-purple-500"
                    : history.status === OrderStatus.DELIVERED
                    ? "bg-green-500"
                    : history.status === OrderStatus.CANCELLED
                    ? "bg-gray-500"
                    : history.status === OrderStatus.RETURNED
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="ml-12 flex-1">
                <div
                  className={`p-4 rounded-lg border ${
                    history.status === OrderStatus.PENDING
                      ? "bg-yellow-50 border-yellow-200"
                      : history.status === OrderStatus.PROCESSING
                      ? "bg-blue-50 border-blue-200"
                      : history.status === OrderStatus.DELIVERING
                      ? "bg-purple-50 border-purple-200"
                      : history.status === OrderStatus.DELIVERED
                      ? "bg-green-50 border-green-200"
                      : history.status === OrderStatus.CANCELLED
                      ? "bg-gray-50 border-gray-200"
                      : history.status === OrderStatus.RETURNED
                      ? "bg-red-50 border-red-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <Typography
                    variant="h6"
                    component="span"
                    className={`${
                      history.status === OrderStatus.PENDING
                        ? "text-yellow-800"
                        : history.status === OrderStatus.PROCESSING
                        ? "text-blue-800"
                        : history.status === OrderStatus.DELIVERING
                        ? "text-purple-800"
                        : history.status === OrderStatus.DELIVERED
                        ? "text-green-800"
                        : history.status === OrderStatus.CANCELLED
                        ? "text-gray-800"
                        : history.status === OrderStatus.RETURNED
                        ? "text-red-800"
                        : "text-blue-800"
                    }`}
                  >
                    {history.status === OrderStatus.PENDING
                      ? "Order Placed"
                      : history.status === OrderStatus.PROCESSING
                      ? "Processing"
                      : history.status === OrderStatus.DELIVERING
                      ? "Out for Delivery"
                      : history.status === OrderStatus.DELIVERED
                      ? "Delivered"
                      : history.status === OrderStatus.CANCELLED
                      ? "Cancelled"
                      : history.status === OrderStatus.RETURNED
                      ? "Returned"
                      : history.status}
                  </Typography>
                  <Typography
                    className={`mt-1 ${
                      history.status === OrderStatus.PENDING
                        ? "text-yellow-700"
                        : history.status === OrderStatus.PROCESSING
                        ? "text-blue-700"
                        : history.status === OrderStatus.DELIVERING
                        ? "text-purple-700"
                        : history.status === OrderStatus.DELIVERED
                        ? "text-green-700"
                        : history.status === OrderStatus.CANCELLED
                        ? "text-gray-700"
                        : history.status === OrderStatus.RETURNED
                        ? "text-red-700"
                        : "text-blue-700"
                    }`}
                  >
                    {history.status === OrderStatus.PENDING
                      ? `Order #${orderCode} has been created`
                      : history.status === OrderStatus.PROCESSING
                      ? "Order is being processed"
                      : history.status === OrderStatus.DELIVERING
                      ? "Order is on its way"
                      : history.status === OrderStatus.DELIVERED
                      ? "Order has been delivered successfully"
                      : history.status === OrderStatus.CANCELLED
                      ? "Order has been cancelled"
                      : history.status === OrderStatus.RETURNED
                      ? "Order has been returned"
                      : `Order status changed to ${history.status}`}
                  </Typography>
                </div>
                <div className="text-sm text-gray-500 mt-2 ml-4">
                  {formatDate(history.createdAt)}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Fallback to basic timeline if no history
          <div className="relative flex items-start">
            <div className="absolute left-0 w-8 h-8 bg-yellow-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="ml-12 flex-1">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <Typography
                  variant="h6"
                  component="span"
                  className="text-yellow-800"
                >
                  Order Placed
                </Typography>
                <Typography className="text-yellow-700 mt-1">
                  Order #{orderCode} has been created
                </Typography>
              </div>
              <div className="text-sm text-gray-500 mt-2 ml-4">
                {formatDate(orderCreatedAt)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTimeline;
