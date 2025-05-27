"use client";
import CustomButton from "@/components/layouts/CustomBtn";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import { useLoading } from "@/hooks/useLoading";
import Loading from "@/components/common/Loading";
import { useCarts } from "@/hooks/api/cart.api";
import CheckoutInfo from "@/components/checkout/CheckoutInfor";
import CartItem from "@/components/checkout/CartItem";
import CartList from "@/components/checkout/CartList";
import NotFound from "@/app/not-found";

export default function CheckoutPage() {
  const { data: carts, isLoading, isFetching, error } = useCarts();
  const quantity = carts?.data?.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const showLoading = useLoading({ isLoading, isFetching, delay: 0 });

  if (showLoading) return <Loading fullScreen size="large" />;
  if (!carts?.data || error) return <NotFound />;
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] pb-20">
        <div className="lg:col-span-2 flex flex-col gap-y-[20px]">
          <CheckoutInfo />
          <CartList cartData={carts?.data} />
        </div>

        <div className="lg:col-span-1 bg-white h-fit rounded-sm p-4 lg:p-6">
          <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG</h2>

          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Tổng giá trị đơn hàng</span>
            <span className="text-primary text-xl font-bold">
              {formatCurrency(carts?.data.total || 0)}
            </span>
          </div>

          <hr className="border-dashed border-2 my-4" />

          <CustomButton size="small" className="text-white w-full font-normal">
            TIẾP TỤC THANH TOÁN ➔
          </CustomButton>
          <p className="text-sm text-gray-600 mt-3">
            Dùng mã giảm giá của{" "}
            <span className="text-primary font-semibold">TokyoLife</span> trong
            bước tiếp theo
          </p>
        </div>
      </div>
    </div>
  );
}
