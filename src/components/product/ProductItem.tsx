import { DiscountType } from "@/types/discountType";
import { formatCurrency } from "@/utils/formatCurrency";
import { Rating } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

interface ProductItemProps {
  product: any;
}

const ProductItem: FC<ProductItemProps> = ({ product }) => {
  const basePrice = product.price ?? 0;
  const { discountType, discountValue = 0 } = product;

  let discountedPrice = basePrice;
  let discountPercent = 0;

  if (discountType === DiscountType.FIXED) {
    discountedPrice = basePrice - discountValue;
    discountPercent = Math.round((discountValue / basePrice) * 100);
  } else if (discountType === DiscountType.PERCENTAGE) {
    discountedPrice = basePrice - (basePrice * discountValue) / 100;
    discountPercent = discountValue;
  }

  return (
    <Link href={product.slug} className="px-[6px] py-3">
      <Image
        width={300}
        height={200}
        alt="Product Image"
        className="min-h-[300px] object-cover"
        src={product.images[0]}
      />
      <div className="py-3">
        <h3 className="leading-[18px] my-2 text-black line-clamp-2">
          {product.name}
        </h3>
        {!!product.rating && (
          <div className="flex items-center gap-1 mb-2 text-xs text-[#555555] font-normal leading-4">
            <Rating
              name="half-rating"
              size="small"
              readOnly
              value={product.rating}
            />{" "}
            ({product.reviewCount})
          </div>
        )}
        <span className="flex flex-col gap-2 text-primary font-bold">
          <div className="">{formatCurrency(discountedPrice)}</div>
          {discountType !== DiscountType.NONE && (
            <div className="flex items-center">
              <span className="text-[#737373] font-normal line-through mr-2">
                {formatCurrency(basePrice)}
              </span>
              <span>{`-${discountPercent}%`}</span>
            </div>
          )}
        </span>
      </div>
    </Link>
  );
};

export default ProductItem;
