import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import { CartItem as CartItemType } from "@/types/cartItem";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";
import { useDebounce } from "@/hooks/useDebounce";
import { FaAngleDown } from "react-icons/fa6";
import EditCartItemOptionsModal from "./EditCartItemOptionsModal";
import { UpdateCartItemDto } from "@/hooks/api/cart.api";

interface CartItemProps {
  item: CartItemType;
  onUpdateItem?: ({
    cartItemId,
    quantity,
    productSkuId,
  }: UpdateCartItemDto) => void;
  onRemoveItem?: (id: number) => void;
}

const CartItem = ({ item, onUpdateItem, onRemoveItem }: CartItemProps) => {
  const isCheckout = !(onUpdateItem && onRemoveItem);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const { price, discountType, discountValue } = item.sku.product;
  const { discountedPrice, discountPercent } = calculateDiscountedPrice({
    basePrice: price,
    discountType,
    discountValue,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !dropdownRef.current ||
        !triggerRef.current ||
        dropdownRef.current.contains(e.target as Node) ||
        triggerRef.current.contains(e.target as Node)
      )
        return;
      setIsPopupOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDecreaseQuantity = useDebounce(() => {
    onUpdateItem?.({
      cartItemId: Number(item.id),
      quantity: Math.max(1, item.quantity - 1),
    });
  });

  const handleIncreaseQuantity = useDebounce(() => {
    onUpdateItem?.({
      cartItemId: Number(item.id),
      quantity: item.quantity + 1,
    });
  });

  const handleSkuSelect = (newSkuId: number) => {
    onUpdateItem?.({ cartItemId: Number(item.id), productSkuId: newSkuId });
    setIsPopupOpen(false);
  };

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
          {!isCheckout && (
            <div ref={triggerRef} className="relative">
              <div
                onClick={() => setIsPopupOpen(!isPopupOpen)}
                className="my-2 px-2 py-1 cursor-pointer border rounded flex items-center gap-3 bg-[#f5f5f5]"
              >
                Chọn phân loại <FaAngleDown />
              </div>

              {isPopupOpen && (
                <div ref={dropdownRef}>
                  <EditCartItemOptionsModal
                    item={item}
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    onConfirm={(skuId) => handleSkuSelect(skuId)}
                  />
                </div>
              )}
            </div>
          )}
          <div
            className={`${isCheckout ? "mt-5" : "mt-1"} text-sm text-gray-600`}
          >
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
        {isCheckout ? (
          <p className="text-base">{item.quantity}</p>
        ) : (
          <div className="flex border border-[#c4c4c4] rounded overflow-hidden w-fit">
            <button
              disabled={item.quantity === 1}
              onClick={handleDecreaseQuantity}
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
              onClick={handleIncreaseQuantity}
              className="w-6 h-6 flex items-center justify-center border-l border-[#c4c4c4] text-black hover:bg-primary/5"
            >
              +
            </button>
          </div>
        )}
      </td>
      <td className="py-4 font-bold text-right">
        <div>{formatCurrency(discountedPrice * item.quantity)}</div>
        {!isCheckout && (
          <button
            onClick={() => onRemoveItem(Number(item.id))}
            className="text-gray-500 hover:text-primary transition pt-4 lg:pt-16"
          >
            <FaTrash />
          </button>
        )}
      </td>
    </tr>
  );
};

export default CartItem;
