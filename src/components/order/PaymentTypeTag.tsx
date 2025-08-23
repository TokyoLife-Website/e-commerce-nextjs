import React from "react";
import { PaymentMethod } from "@/types/paymentMethod";

interface PaymentTypeTagProps {
  paymentMethod: PaymentMethod;
}

const PaymentTypeTag: React.FC<PaymentTypeTagProps> = ({ paymentMethod }) => {
  const getPaymentStyles = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.COD:
        return "bg-green-100 text-green-700 border-green-200";
      case PaymentMethod.VN_PAY:
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentLabel = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.COD:
        return "Cash on Delivery";
      case PaymentMethod.VN_PAY:
        return "VNPay";
      default:
        return method;
    }
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.COD:
        return "💵";
      case PaymentMethod.VN_PAY:
        return "💳";
      default:
        return "💰";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStyles(
        paymentMethod
      )}`}
    >
      <span className="text-base">{getPaymentIcon(paymentMethod)}</span>
      {getPaymentLabel(paymentMethod)}
    </span>
  );
};

export default PaymentTypeTag;
