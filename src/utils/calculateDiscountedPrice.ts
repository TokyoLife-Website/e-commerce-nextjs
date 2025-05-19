import { DiscountType } from "@/types/discountType";

interface CalculateDiscountedPriceParams {
  basePrice: number;
  discountType: DiscountType;
  discountValue: number;
}

interface DiscountedPriceResult {
  discountedPrice: number;
  discountPercent: number;
}

export const calculateDiscountedPrice = ({
  basePrice,
  discountType,
  discountValue = 0,
}: CalculateDiscountedPriceParams): DiscountedPriceResult => {
  let discountedPrice = basePrice;
  let discountPercent = 0;

  if (discountType === DiscountType.FIXED) {
    discountedPrice = basePrice - discountValue;
    discountPercent = Math.round((discountValue / basePrice) * 100);
  } else if (discountType === DiscountType.PERCENTAGE) {
    discountedPrice = basePrice - (basePrice * discountValue) / 100;
    discountPercent = discountValue;
  }

  return {
    discountedPrice,
    discountPercent,
  };
};
