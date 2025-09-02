import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import ComponentCard from "@/components/admin/common/ComponentCard";
import OrderStatusTag from "@/components/order/OrderStatusTag";
import { formatTimeAgo } from "@/utils/timeFormat";
import { formatCurrency } from "@/utils/formatCurrency";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const router = useRouter();
  const handleOrderClick = (orderCode: string) => {
    router.push(`/admin/orders/${orderCode}`);
  };
  return (
    <ComponentCard title="Recent Orders" desc="Recent orders in the system">
      <div className="space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleOrderClick(order.code)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    {order.items?.length > 0 &&
                    order.items[0].sku?.product?.images?.[0] ? (
                      <img
                        src={order.items[0].sku.product.images[0]}
                        alt="Product"
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <FaShoppingCart className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="relative group">
                    <Tooltip title={order.code} placement="top">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] cursor-pointer">
                        #{order.code}
                      </p>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-gray-500">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.finalAmount)}
                </p>

                <OrderStatusTag orderStatus={order.status} />
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimeAgo(order.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Chưa có đơn hàng nào</p>
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default RecentOrders;
