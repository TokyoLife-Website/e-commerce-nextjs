"use client";
import CustomButton from "@/components/layouts/CustomBtn";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import useToast from "@/hooks/useToastify";
import { useLoading } from "@/hooks/useLoading";
import Loading from "@/components/common/Loading";
import {
  UpdateCartItemDto,
  useCarts,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/api/cart.api";
import { handleRequestError } from "@/utils/errorHandler";
import CartList from "@/components/checkout/CartList";
import NotFound from "@/app/not-found";

export default function CartPage() {
  const { data: carts, isLoading, isFetching, error } = useCarts();
  const quantity =
    carts?.data?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const { mutateAsync: removeCartItem } = useRemoveCartItem();
  const { mutateAsync: updateCartItem } = useUpdateCartItem();
  const { showSuccess } = useToast();
  const showLoading = useLoading({ isLoading, isFetching, delay: 0 });

  const handleRemoveItem = async (id: string | number) => {
    try {
      const { message } = await removeCartItem(Number(id));
      showSuccess(message);
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleUpdateItem = async ({
    cartItemId,
    quantity,
    productSkuId,
  }: UpdateCartItemDto) => {
    try {
      const { message } = await updateCartItem({
        cartItemId: Number(cartItemId),
        quantity,
        productSkuId,
      });
      showSuccess(message);
    } catch (error) {
      handleRequestError(error);
    }
  };

  if (showLoading) return <Loading fullScreen size="large" />;
  if (!carts?.data || error) return <NotFound />;
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] pb-20">
        {/* Cart Items List - 2/3 width on large screens, full width on small screens */}
        <div className="lg:col-span-2 p-4 lg:p-6 bg-white">
          <CartList
            cartItemsData={carts?.data?.items}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
          />
        </div>

        {/* Payment Summary - 1/3 width on large screens, full width on small screens */}
        <div className="lg:col-span-1 bg-white h-fit rounded-sm p-4 lg:p-6">
          <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG</h2>

          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Tổng giá trị đơn hàng</span>
            <span className="text-primary text-xl font-bold">
              {formatCurrency(carts?.data.finalAmount || 0)}
            </span>
          </div>

          <hr className="border-dashed border-2 my-4" />

          <CustomButton
            href="/checkout"
            size="small"
            className="text-white w-full font-normal"
          >
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
