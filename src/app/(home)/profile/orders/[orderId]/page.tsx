"use client";
import CartList from "@/components/checkout/CartList";
import Loading from "@/components/common/Loading";
import PreviousIcon from "@/components/icons/PreviousIcon";
import { ShippingIcon } from "@/components/icons/ShippingIcon";
import CustomButton from "@/components/layouts/CustomBtn";
import OrderInfo from "@/components/order/OrderInfo";
import OrderStatusTag from "@/components/order/OrderStatusTag";
import { useOrderQuery } from "@/hooks/api/order.api";
import { useVNPayURLMutation } from "@/hooks/api/payment.api";
import useToast from "@/hooks/useToastify";
import { openModal } from "@/redux/modalSlice";
import { useAppDispatch } from "@/redux/store";
import { ModalType } from "@/types/modal";
import { OrderStatus } from "@/types/orderStatus";
import { PaymentMethod } from "@/types/paymentMethod";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { use } from "react";

type Props = {
  params: Promise<{ orderId: string }>;
};

const OrderDetailPage = ({ params }: Props) => {
  const { orderId } = use(params);
  const { showError } = useToast();
  const { data, isLoading, isError } = useOrderQuery(orderId);
  const { mutateAsync: createVNPayURL } = useVNPayURLMutation();
  const dispatch = useAppDispatch();

  if (isLoading) return <Loading />;
  if (isError || !data?.data) return notFound();
  const order = data.data;
  const handlePay = async () => {
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
  return (
    <div className="flex flex-col gap-6 text-sm leading-[18px]">
      <Link
        href={"/profile/orders"}
        className="flex items-center gap-3 cursor-pointer w-fit"
      >
        <PreviousIcon />
        <p>Quay lại</p>
      </Link>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl leading-6">
          Chi tiết đơn hàng #{order.code}
        </h3>
        <OrderStatusTag orderStatus={order.status} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5">
        <OrderInfo title="Địa chỉ người nhận">
          <div className="font-bold ">
            {order.user.firstName} {order.user.lastName}
          </div>
          <div>
            <span className="text-[#555555]">Địa chỉ: </span>
            {order.address}
          </div>
          <div>
            <span className="text-[#555555]">Điện thoại: </span>
            {order.user.phone}
          </div>
        </OrderInfo>
        <OrderInfo title="Hình thức giao hàng">
          <div className="font-bold ">
            {order.user.firstName} {order.user.lastName}
          </div>
          <div className="flex items-center gap-2">
            <ShippingIcon />
            <p>Giao hàng tại nhà</p>
          </div>
        </OrderInfo>
        <OrderInfo title="Hình thức thanh toán">
          {order.paymentMethod === PaymentMethod.COD
            ? "Thanh toán tiền mặt khi nhận hàng (COD)"
            : "Thanh toán qua cổng thanh toán"}
        </OrderInfo>
      </div>
      <CartList cartItemsData={order.items} />
      <div className="flex justify-between items-center">
        <span>Tạm tính</span>
        <span className="font-black">{formatCurrency(order.total)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Phí vận chuyển</span>
        <span className="font-black">{formatCurrency(order.shippingFee)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Mã giảm giá</span>
        <span className="font-black">-{formatCurrency(order.discount)}</span>
      </div>
      <hr className="m-0 bg-[#0000001f] border-solid" />
      <div className="flex justify-between items-center">
        <span>Tổng cộng</span>
        <span className="font-black text-2xl text-primary">
          {formatCurrency(order.finalAmount)}
        </span>
      </div>
      {order.status === OrderStatus.PROCESSING && (
        <CustomButton
          onClick={() =>
            dispatch(
              openModal({
                type: ModalType.CONFIRM_CANCEL_ORDER,
                data: order.code,
              })
            )
          }
          className="self-end border-gray-200 px-3 py-2"
        >
          Hủy đơn hàng
        </CustomButton>
      )}
      {order.status === OrderStatus.PENDING && (
        <CustomButton
          onClick={handlePay}
          className="self-end border-gray-200 px-3 py-2"
        >
          Thanh toán
        </CustomButton>
      )}
    </div>
  );
};

export default OrderDetailPage;
