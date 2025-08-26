"use client";

import React, { useState } from "react";
import CustomButton from "@/components/layouts/CustomBtn";

type VoucherCardProps = {
  headline: string;
  code: string;
  minOrderText?: string;
  expiresAtText?: string;
  onCopy?: (code: string) => void;
  className?: string;
  ctaText?: string;
};

const VoucherCard: React.FC<VoucherCardProps> = ({
  headline,
  code,
  minOrderText,
  expiresAtText,
  onCopy,
  className,
  ctaText = "Sao chép mã",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.(code);

      // Reset button state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div
      className={`relative flex items-stretch bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md ${
        className || ""
      }`}
    >
      <div className="flex-1 p-3 pr-3">
        <div className="text-red-600 font-extrabold tracking-wide text-sm">
          {headline}
        </div>
        <div className="mt-1 text-gray-900 text-sm">
          Nhập mã <span className="font-extrabold">{code}</span>
        </div>
        {minOrderText && (
          <div className="mt-1 text-gray-600 text-sm">{minOrderText}</div>
        )}
        {expiresAtText && (
          <div className="mt-2 text-[13px] text-red-500 font-semibold">
            {expiresAtText}
          </div>
        )}
      </div>

      {/* Right action area with dashed divider */}
      <div className="relative flex items-center justify-center border-l border-dashed border-gray-300 px-3 bg-white">
        <CustomButton
          onClick={handleCopy}
          size="small"
          variant={isCopied ? "outline" : "primary"}
          className={
            isCopied
              ? "border-red-600 text-red-600 hover:bg-red-50 min-w-28 w-28"
              : "min-w-28 w-28"
          }
        >
          {isCopied ? "Đã chép" : ctaText}
        </CustomButton>
      </div>
    </div>
  );
};

export default VoucherCard;
