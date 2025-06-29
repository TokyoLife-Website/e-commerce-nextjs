import React from "react";
import { Coupon } from "@/types/coupon";

interface CouponBannerProps {
  coupon: Coupon;
}

const CouponBanner: React.FC<CouponBannerProps> = ({ coupon }) => {
  if (!coupon) return null;

  return (
    <div className="px-5 py-4 bg-[#fffbeb] rounded">
      <p className="m-0 font-normal text-sm leading-[18px]">
        Quý khách đã được áp dụng mã giảm giá:{" "}
        <span className="text-primary font-bold">{coupon.code}</span>
      </p>
    </div>
  );
};

export default CouponBanner;
