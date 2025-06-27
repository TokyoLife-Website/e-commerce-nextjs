"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/layouts/CustomBtn";
import Loading from "@/components/common/Loading";
import CartList from "@/components/checkout/CartList";
import NotFound from "@/app/not-found";
import CloseIcon from "@/components/icons/CloseIcon";
import { CheckoutInfo } from "@/components/checkout/CheckoutInfor";
import { formatCurrency } from "@/utils/formatCurrency";
import { handleRequestError } from "@/utils/errorHandler";
import useToast from "@/hooks/useToastify";
import { useLoading } from "@/hooks/useLoading";
import {
  useCarts,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} from "@/hooks/api/cart.api";
import { useCreateOrderMutation } from "@/hooks/api/order.api";
import { PaymentMethod } from "@/types/paymentMethod";
import { Address } from "@/types/address";

export default function CheckoutPage() {
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    PaymentMethod.COD
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [couponCode, setCouponCode] = useState("");

  const {
    data: carts,
    isLoading,
    isFetching,
    error,
    refetch: refetchCart,
  } = useCarts();
  const { mutateAsync, isPending } = useCreateOrderMutation();
  const { mutateAsync: applyCoupon, isPending: isApplyingCoupon } =
    useApplyCouponMutation();
  const { mutateAsync: removeCoupon, isPending: isRemovingCoupon } =
    useRemoveCouponMutation();

  const showLoading = useLoading({ isLoading, isFetching, delay: 0 });

  useEffect(() => {
    if (carts?.data?.coupon?.code) {
      setCouponCode(carts.data.coupon.code);
    }
  }, [carts?.data?.coupon?.code]);

  const handleSubmit = async () => {
    try {
      if (!selectedAddress) {
        showError("Vui lòng chọn địa chỉ giao hàng");
        return;
      }
      if (!carts?.data.items.length) {
        showError("Giỏ hàng của bạn đang trống");
        return;
      }
      const { message, data } = await mutateAsync({
        addressId: +selectedAddress.id,
        paymentMethod: selectedPayment,
      });
      router.push(`/order-complete?code=${data.code}`);
      showSuccess(message);
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return showError("Vui lòng nhập mã giảm giá");
    try {
      const { message } = await applyCoupon(couponCode.trim());
      showSuccess(message || "Áp dụng mã giảm giá thành công");
      refetchCart();
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      setCouponCode("");
      refetchCart();
      showSuccess("Đã xóa mã giảm giá");
    } catch (error) {
      handleRequestError(error);
    }
  };

  if (showLoading) return <Loading fullScreen size="large" />;
  if (!carts?.data || error) return <NotFound />;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] pb-20">
        <div className="lg:col-span-2 flex flex-col gap-y-[20px]">
          <CheckoutInfo
            selectedAddress={selectedAddress}
            selectedPayment={selectedPayment}
            setSelectedAddress={setSelectedAddress}
            setSelectedPayment={setSelectedPayment}
          />
          <div className="p-4 lg:p-6 bg-white">
            <CartList cartItemsData={carts?.data.items} />
          </div>
        </div>
        <div className="lg:col-span-1 bg-white h-fit rounded-sm p-4 lg:p-6">
          <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG</h2>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-[#222222] text-xs">
              MÃ PHIẾU GIẢM GIÁ
            </h3>
            <div className="flex items-stretch h-[40px]">
              <div
                className={`flex items-center border border-gray-500 rounded-s text-sm flex-1 overflow-hidden ${
                  carts.data.coupon ? "bg-gray-100 text-gray-400" : ""
                }`}
              >
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  type="text"
                  className="flex-1 pl-4 py-2 outline-none bg-inherit h-full"
                  placeholder="Mã phiếu giảm giá"
                  disabled={!!carts?.data?.coupon?.code}
                />
                {carts.data.coupon && (
                  <button
                    onClick={handleRemoveCoupon}
                    className="px-2 h-full flex items-center justify-center text-gray-500 hover:text-black"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
              <button
                className="bg-primary text-white px-5 rounded-e font-normal disabled:opacity-70 h-full"
                onClick={handleApplyCoupon}
                disabled={
                  isApplyingCoupon || !!carts.data.coupon || !couponCode
                }
                type="button"
              >
                {isApplyingCoupon ? "ĐANG ÁP DỤNG..." : "ÁP DỤNG"}
              </button>
            </div>
            <p className="font-normal text-[#555555] cursor-pointer text-xs">
              Kiểm tra{" "}
              <span className="text-[#2e7d32] underline">
                Phiếu giảm giá của tôi
              </span>
            </p>
          </div>
          <hr className="border-dashed border border-gray-500 my-4" />
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Tạm tính</span>
            <span className="text-sm leading-[18px] text-[#222222] font-bold">
              {formatCurrency(carts?.data.total || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Phí vận chuyển</span>
            <span className="text-sm leading-[18px] text-[#222222] font-bold">
              {formatCurrency(0)}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Mã giảm giá</span>
            <span className="text-sm leading-[18px] text-[#222222] font-bold">
              -{formatCurrency(carts?.data.discountAmount)}
            </span>
          </div>
          <hr className="border-dashed border border-gray-500 my-4" />
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Tổng thanh toán</span>
            <span className="text-primary text-xl font-bold">
              {formatCurrency(carts?.data.finalAmount || 0)}
            </span>
          </div>
          <hr className="border-dashed border border-gray-500 my-4" />
          <CustomButton
            onClick={handleSubmit}
            size="small"
            className="text-white w-full font-normal"
            disabled={isPending}
          >
            {isPending ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
          </CustomButton>
          <div className="flex items-baseline gap-1 text-xs font-normal text-primary mt-3 leading-[1.5]">
            <span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 11.375C3.035 11.375 0.625 8.965 0.625 6C0.625 3.035 3.035 0.625 6 0.625C8.965 0.625 11.375 3.035 11.375 6C11.375 8.965 8.965 11.375 6 11.375ZM6 1.375C3.45 1.375 1.375 3.45 1.375 6C1.375 8.55 3.45 10.625 6 10.625C8.55 10.625 10.625 8.55 10.625 6C10.625 3.45 8.55 1.375 6 1.375ZM6 6.875C5.795 6.875 5.625 6.705 5.625 6.5V4C5.625 3.795 5.795 3.625 6 3.625C6.205 3.625 6.375 3.795 6.375 4V6.5C6.375 6.705 6.205 6.875 6 6.875ZM5.81 8.45994C5.87 8.48494 5.935 8.49994 6 8.49994C6.065 8.49994 6.13 8.48494 6.19 8.45994C6.25 8.43494 6.305 8.39994 6.355 8.35494C6.4 8.30494 6.435 8.25494 6.46 8.18994C6.485 8.12994 6.5 8.06494 6.5 7.99994C6.5 7.93494 6.485 7.86994 6.46 7.80994C6.435 7.74994 6.4 7.69494 6.355 7.64494C6.305 7.59994 6.25 7.56494 6.19 7.53994C6.07 7.48994 5.93 7.48994 5.81 7.53994C5.75 7.56494 5.695 7.59994 5.645 7.64494C5.6 7.69494 5.565 7.74994 5.54 7.80994C5.515 7.86994 5.5 7.93494 5.5 7.99994C5.5 8.06494 5.515 8.12994 5.54 8.18994C5.565 8.25494 5.6 8.30494 5.645 8.35494C5.695 8.39994 5.75 8.43494 5.81 8.45994Z"
                  fill="#C92127"
                ></path>
              </svg>
            </span>
            Nếu đơn hàng không có thay đổi, TokyoLife sẽ không gọi xác nhận!​
          </div>
        </div>
      </div>
    </div>
  );
}
