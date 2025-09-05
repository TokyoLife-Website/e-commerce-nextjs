import CustomButton from "@/components/layouts/CustomBtn";
import { Order, OrderItem } from "@/types/order";
import { OrderStatus } from "@/types/orderStatus";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/timeFormat";

interface OrderTableProps {
  orders: Order[];
}

import React, { FC } from "react";
import EmptyOrder from "../icons/EmptyOrder";
import OrderStatusTag from "./OrderStatusTag";
import { useAppDispatch } from "@/redux/store";
import { openModal } from "@/redux/modalSlice";
import { ModalType } from "@/types/modal";
import { useVNPayURLMutation } from "@/hooks/api/payment.api";
import useToast from "@/hooks/useToastify";

const OrdersList: FC<OrderTableProps> = ({ orders }) => {
  const dispatch = useAppDispatch();
  const { showError } = useToast();
  const { mutateAsync: createVNPayURL } = useVNPayURLMutation();
  const handlePay = async (order: Order) => {
    const paymentRes = await createVNPayURL({
      orderId: order.code,
      amount: order.finalAmount,
      orderInfo: `Thanh toán đơn hàng #${order.code}`,
      ipAddr: "127.0.0.1",
    });
    if (paymentRes?.data?.paymentUrl) {
      window.location.href = paymentRes.data.paymentUrl;
      return;
    } else {
      showError("Không lấy được link thanh toán VNPay");
      return;
    }
  };

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
                {formatCurrency(order.finalAmount)}
              </td>
              <td className="p-4">
                <OrderStatusTag orderStatus={order.status} />
              </td>
              <td className="p-4">
                {order.status === OrderStatus.PENDING ? (
                  <CustomButton
                    onClick={() => handlePay(order)}
                    variant="outline"
                    size="small"
                    className="border-gray-200 px-3 py-2 text-black hover:bg-primary hover:text-white"
                  >
                    Thanh toán
                  </CustomButton>
                ) : order.status === OrderStatus.PROCESSING ? (
                  <CustomButton
                    variant="outline"
                    size="small"
                    className="border-gray-200 px-3 py-2 text-black hover:bg-primary hover:text-white"
                    onClick={() =>
                      dispatch(
                        openModal({
                          type: ModalType.CONFIRM_CANCEL_ORDER,
                          data: order.code,
                        })
                      )
                    }
                  >
                    Hủy đơn hàng
                  </CustomButton>
                ) : (
                  <CustomButton
                    href={`/profile/orders/${order.code}`}
                    variant="outline"
                    size="small"
                    className="border-gray-200 px-3 py-2 text-black hover:bg-primary hover:text-white"
                  >
                    Xem chi tiết
                  </CustomButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
