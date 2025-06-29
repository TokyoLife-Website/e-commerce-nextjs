import React from "react";
import { TruckIcon } from "@/components/icons/TruckIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { FREE_SHIPPING_THRESHOLD } from "@/constants/shipping";

interface ShippingBannerProps {
  finalAmount: number;
  total: number;
}

const ShippingBanner: React.FC<ShippingBannerProps> = ({
  finalAmount,
  total,
}) => {
  const isFreeShip = total >= FREE_SHIPPING_THRESHOLD;
  const remainingAmount = FREE_SHIPPING_THRESHOLD - finalAmount;

  return (
    <div className="px-5 py-4 bg-[#fffbeb] rounded flex items-center gap-2">
      <TruckIcon />

      <div className="flex flex-col leading-snug">
        <div className="text-sm">
          {isFreeShip ? (
            "Quý khách đã được áp dụng "
          ) : (
            <>Mua thêm {formatCurrency(remainingAmount)} để nhận ngay </>
          )}

          <span className="font-semibold text-primary">
            {isFreeShip ? "FreeShip 0đ" : "Ưu đãi miễn phí vận chuyển."}
          </span>
        </div>
        <span className="text-gray-400 text-xs mt-1">
          (Có thể thay đổi nếu áp dụng code ưu đãi)
        </span>
      </div>
    </div>
  );
};

export default ShippingBanner;
