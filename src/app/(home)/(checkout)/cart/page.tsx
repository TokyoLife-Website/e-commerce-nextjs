"use client";
import CustomButton from "@/components/layouts/CustomBtn";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import CartItem from "@/components/checkout/CartItem";
import useToast from "@/hooks/useToastify";
import { useLoading } from "@/hooks/useLoading";
import Loading from "@/components/common/Loading";
import { useCarts, useRemoveCartItem } from "@/hooks/api/cart.api";

export default function CartPage() {
  const { data: carts, isLoading, isFetching } = useCarts();
  const quantity = carts?.data?.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const { mutateAsync: removeCartItem } = useRemoveCartItem();
  const { showSuccess } = useToast();
  const showLoading = useLoading({ isLoading, isFetching, delay: 0 });

  const handleRemoveItem = async (id: string | number) => {
    const { message } = await removeCartItem(Number(id));
    showSuccess(message);
  };

  if (showLoading) return <Loading fullScreen size="large" />;
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] pb-20">
        {/* Cart Items List - 2/3 width on large screens, full width on small screens */}
        <div className="lg:col-span-2 bg-white rounded-sm p-4 lg:p-6 h-fit">
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-gray-900 mb-6 uppercase">
            Giỏ hàng
            <p className="text-primary font-normal text-xs leading-[1.5] lowercase">
              ({quantity} sản phẩm)
            </p>
          </h1>
          <div className="space-y-4 overflow-x-auto">
            <table className="w-full table-auto min-w-[600px]">
              <thead className="border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="py-2 w-1/2">Tên Hàng</th>
                  <th className="py-2 w-1/4">Giá</th>
                  <th className="py-2 w-1/4">Số Lượng</th>
                  <th className="py-2 text-right w-1/4">Tổng Tiền</th>
                </tr>
              </thead>
              <tbody>
                {carts?.data?.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemoveItem={handleRemoveItem}
                    onUpdateQuantity={(id, quantity) => {}}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary - 1/3 width on large screens, full width on small screens */}
        <div className="lg:col-span-1 bg-white h-fit rounded-sm p-4 lg:p-6">
          <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG</h2>

          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Tổng giá trị đơn hàng</span>
            <span className="text-primary text-xl font-bold">
              {formatCurrency(549000)}
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
