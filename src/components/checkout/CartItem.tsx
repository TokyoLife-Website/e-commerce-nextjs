import React from "react";
import { FaTrash } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import { CartItem as CartItemType } from "@/types/cartItem";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) => {
  const { price, discountType, discountValue } = item.sku.product;
  const { discountedPrice, discountPercent } = calculateDiscountedPrice({
    basePrice: price,
    discountType,
    discountValue,
  });
  return (
    <tr key={item.id} className="border-b py-4 text-sm align-top">
      <td className="py-4 flex gap-4">
        <img
          src={item.sku.product.images[0]}
          alt={item.sku.product.name}
          className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded"
        />
        <div>
          <div className="font-semibold">{item.sku.product.name}</div>
          <select className="mt-1 px-2 py-1 border rounded text-sm">
            <option>Chọn phân loại</option>
          </select>
          <div className="mt-1 text-sm text-gray-600">
            Kích thước:{" "}
            <span className="font-semibold">Size {item.sku.size}</span>
            <br />
            Màu sắc: <span className="font-semibold">{item.sku.color}</span>
          </div>
        </div>
      </td>
      <td className="py-4 text-primary font-semibold">
        {formatCurrency(discountedPrice)}
        {discountPercent > 0 && (
          <div className="text-gray-400 line-through text-sm">
            {formatCurrency(price)}
          </div>
        )}
      </td>
      <td className="py-4">
        <div className="flex border border-[#c4c4c4] rounded overflow-hidden w-fit">
          <button
            onClick={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            className="w-6 h-6 flex items-center justify-center border-r border-[#c4c4c4] text-gray-500 hover:bg-primary/5"
          >
            -
          </button>

          <input
            disabled
            min={1}
            value={item.quantity}
            className="focus:ring-2 focus:ring-red-500 focus:border-red-500 w-[30px] h-6 text-center outline-none"
          />

          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 flex items-center justify-center border-l border-[#c4c4c4] text-black hover:bg-primary/5"
          >
            +
          </button>
        </div>
      </td>
      <td className="py-4 font-bold text-right">
        <div>{formatCurrency(discountedPrice * item.quantity)}</div>
        <button
          onClick={() => onRemoveItem(Number(item.id))}
          className="text-gray-500 hover:text-primary transition pt-4 lg:pt-16"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
