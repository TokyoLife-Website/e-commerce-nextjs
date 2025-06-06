import React from "react";
import { FaShoppingBag, FaClipboardCheck, FaTruck } from "react-icons/fa";

const steps = [
  { label: "Giỏ hàng", path: "/cart", icon: <FaShoppingBag /> },
  { label: "Đặt hàng", path: "/checkout", icon: <FaClipboardCheck /> },
  {
    label: "Hoàn thành đơn hàng",
    shortLabel: "Hoàn thành",
    path: "/order-complete",
    icon: <FaTruck />,
  },
];

const CheckoutStepper = ({ pathname }: { pathname: string }) => {
  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path)
  );
  const isOrderCompletePage = pathname === "/order-complete";
  return (
    <div className="flex items-center justify-center bg-inherit py-8">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;

        return (
          <div key={step.path} className="flex items-center w-fit">
            <div
              className={`flex flex-col md:flex-row items-center text-sm md:text-xl space-y-1 md:space-y-0 md:space-x-2 ${
                isActive
                  ? "text-primary font-bold"
                  : isOrderCompletePage
                  ? "text-black font-normal"
                  : "text-gray-400 font-normal"
              }`}
            >
              <div className="text-base md:text-lg">{step.icon}</div>
              <div className="uppercase">
                <span className="hidden md:inline">{step.label}</span>
                <span className="md:hidden">
                  {step.shortLabel || step.label}
                </span>
              </div>
            </div>
            {index !== steps.length - 1 && (
              <div className="mx-2 md:mx-3 w-6 md:w-10 border-t border-dashed border-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;
