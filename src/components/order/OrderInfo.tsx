import React, { FC, ReactNode } from "react";

interface OrderInfoProps {
  title: string;
  children: ReactNode;
}

const OrderInfo: FC<OrderInfoProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-base">{title}</h3>
      <div className="p-5 bg-[#f5f5f5] flex flex-col gap-2 h-full">
        {children}
      </div>
    </div>
  );
};

export default OrderInfo;
