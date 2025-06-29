import React from "react";
import CustomButton from "@/components/layouts/CustomBtn";
import { formatCurrency } from "@/utils/formatCurrency";

interface PaymentSummaryProps {
  finalAmount: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ finalAmount }) => {
  return (
    <div className="lg:col-span-1 bg-white h-fit rounded-sm p-4 lg:p-6">
      <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG</h2>

      <div className="flex justify-between items-center text-gray-600 mb-2">
        <span>Tổng giá trị đơn hàng</span>
        <span className="text-primary text-xl font-bold">
          {formatCurrency(finalAmount)}
        </span>
      </div>

      <hr className="border-dashed border-2 my-4" />

      <CustomButton
        href="/checkout"
        size="small"
        className="text-white w-full font-normal"
      >
        TIẾP TỤC THANH TOÁN ➔
      </CustomButton>
      <p className="text-sm text-gray-600 mt-3">
        Dùng mã giảm giá của{" "}
        <span className="text-primary font-semibold">TokyoLife</span> trong bước
        tiếp theo
      </p>
    </div>
  );
};

export default PaymentSummary;
