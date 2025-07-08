import React from "react";
import PaymentFailedIcon from "../icons/PaymentFailedIcon";
import CustomButton from "../layouts/CustomBtn";
import { CartWhiteIcon } from "../icons/CartWhiteIcon";

const PaymentFailed = ({
  orderCode,
  isCartEmpty = false,
}: {
  orderCode?: string;
  isCartEmpty?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center px-6 pt-10 pb-[60px] text-center ">
      <PaymentFailedIcon />
      {isCartEmpty ? (
        <div className="mt-8 mb-10 text-sm">
          Bạn chưa có sản phẩm nào trong giỏ hàng.
        </div>
      ) : (
        <>
          <h1 className="font-bold leading-[30px] text-2xl mt-6">
            Thanh toán thất bại
          </h1>
          <div className="mt-4 mb-6 flex flex-col gap-2 text-sm leading-[18px]">
            <div>
              Mã đơn đặt hàng: <b>{orderCode}</b>
            </div>
            <div className="text-primary">
              Lỗi thanh toán VNPAY, giao dịch thất bại.
            </div>
          </div>
        </>
      )}
      <CustomButton
        href="/"
        size="large"
        className="flex items-center gap-2 font-normal px-14"
      >
        <CartWhiteIcon /> Tiếp tục mua sắm
      </CustomButton>
    </div>
  );
};

export default PaymentFailed;
