import { DiscountType } from "@/types/discountType";
import { formatCurrency } from "@/utils/formatCurrency";
import { calculateDiscountPercent } from "@/utils/calculateDiscountedPrice";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { Product } from "@/types/product";

interface ProductItemProps {
  product: Product;
}

const SearchItem: FC<ProductItemProps> = ({ product }) => {
  const basePrice = product.price ?? 0;
  const { discountType, discountValue = 0 } = product;

  const discountPercent = calculateDiscountPercent({
    basePrice,
    discountType,
    discountValue,
  });
  return (
    <Link
      href={`/${product.slug}`}
      className="flex items-center gap-3 px-2 py-2 md:block md:px-[6px] transition hover:bg-gray-100 rounded"
    >
      <div className="relative w-16 h-16 flex-shrink-0 md:w-full md:h-[300px] md:min-h-[300px]">
        <Image
          fill
          alt={product.name}
          className="object-cover"
          src={product.images[0]}
          sizes="(max-width: 768px) 64px, 300px"
        />
      </div>
      <div className="flex-1 py-0 md:py-3">
        <h3 className="leading-[18px] my-2 text-black line-clamp-2 text-sm md:text-base">
          {product.name}
        </h3>
        <span className="flex md:flex-col gap-2 text-primary font-bold">
          <div>{formatCurrency(product.finalPrice)}</div>
          {discountType !== DiscountType.NONE && (
            <div className="flex items-center">
              <span className="text-[#737373] font-normal line-through mr-2">
                {formatCurrency(basePrice)}
              </span>
              <span className="hidden md:block">{`-${discountPercent}%`}</span>
            </div>
          )}
        </span>
      </div>
    </Link>
  );
};

export default SearchItem;
