"use client";
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
import CouponBanner from "@/components/checkout/CouponBanner";
import ShippingBanner from "@/components/checkout/ShippingBanner";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import PaymentFailed from "@/components/checkout/PaymentFailed";
import { withAuth } from "@/hoc/withAuth";
import { Role } from "@/types/role";

function CartPage() {
  const { data: carts, isLoading, isFetching, error } = useCarts();
  const { mutateAsync: removeCartItem } = useRemoveCartItem();
  const { mutateAsync: updateCartItem } = useUpdateCartItem();
  const { showSuccess } = useToast();
  const showLoading = useLoading({ isLoading, isFetching, delay: 0 });

  // Destructure cart data to avoid repetitive usage
  const cartData = carts?.data;

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
  if (!cartData || error) return <NotFound />;

  if (cartData.items.length === 0) return <PaymentFailed isCartEmpty />;
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] pb-20">
        {/* Cart Items List - 2/3 width on large screens, full width on small screens */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          {cartData.coupon && <CouponBanner coupon={cartData.coupon} />}
          <ShippingBanner
            total={cartData.total}
            finalAmount={cartData.finalAmount}
          />
          <div className="bg-white p-4 lg:p-6">
            <CartList
              cartItemsData={cartData.items}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
            />
          </div>
        </div>

        {/* Payment Summary - 1/3 width on large screens, full width on small screens */}
        <PaymentSummary finalAmount={cartData.finalAmount} />
      </div>
    </div>
  );
}

export default withAuth(CartPage, { role: Role.USER });
