import { UpdateCartItemDto } from "@/hooks/api/cart.api";
import { Cart, CartItem as CartItemType } from "@/types/cartItem";
import React, { FC } from "react";
import CartItem from "./CartItem";

interface CartListProps {
  cartItemsData: CartItemType[];
  onUpdateItem?: ({
    cartItemId,
    quantity,
    productSkuId,
  }: UpdateCartItemDto) => void;
  onRemoveItem?: (id: number) => void;
}

const CartList: FC<CartListProps> = ({
  cartItemsData,
  onRemoveItem,
  onUpdateItem,
}) => {
  const quantity = cartItemsData.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <div className="bg-white rounded-sm h-fit overflow-x-auto">
      <h1 className="flex items-center gap-2 text-xl font-extrabold text-gray-900 mb-6 uppercase">
        Giỏ hàng
        <p className="text-primary font-normal text-xs leading-[1.5] lowercase">
          ({quantity} sản phẩm)
        </p>
      </h1>
      <div className="space-y-4">
        <table className="w-full table-auto min-w-[600px]">
          <thead className="border-b">
            <tr className="text-left text-sm text-gray-600">
              <th className="py-2 w-1/2">Tên Hàng</th>
              <th className="py-2 w-1/5">Giá</th>
              <th className="py-2 w-1/5">Số Lượng</th>
              <th className="py-2 text-right w-1/4">Tổng Tiền</th>
            </tr>
          </thead>
          <tbody>
            {cartItemsData.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemoveItem={onRemoveItem}
                onUpdateItem={onUpdateItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CartList;
