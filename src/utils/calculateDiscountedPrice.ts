import { DiscountType } from "@/types/discountType";

interface CalculateDiscountPercentParams {
  basePrice: number;
  discountType: DiscountType;
  discountValue: number;
}

export const calculateDiscountPercent = ({
  basePrice,
  discountType,
  discountValue = 0,
}: CalculateDiscountPercentParams): number => {
  let discountPercent = 0;

  if (discountType === DiscountType.FIXED) {
    discountPercent = Math.round((discountValue / basePrice) * 100);
  } else if (discountType === DiscountType.PERCENTAGE) {
    discountPercent = discountValue;
  }

  return discountPercent;
};
