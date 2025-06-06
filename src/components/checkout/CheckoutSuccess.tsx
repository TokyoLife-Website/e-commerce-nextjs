import React from "react";
import CustomButton from "../layouts/CustomBtn";
import { CheckoutSuccessIcon } from "../icons/CheckoutSuccessIcon";
import { CartWhiteIcon } from "../icons/CartWhiteIcon";

const CheckoutSuccess = ({ orderCode }: { orderCode: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-5 text-center">
      <CheckoutSuccessIcon />
      <h1 className="mt-6 leading-[30px] text-2xl font-bold mb-2">
        Đặt hàng thành công
      </h1>
      <p className="text-gray-700 mb-8 text-base">
        Nếu đơn hàng không có thay đổi, TokyoLife sẽ không gọi xác nhận.
        <br />
        Trường hợp Quý khách cần hỗ trợ hoặc có yêu cầu khác, vui lòng liên hệ
        Dịch vụ Khách hàng qua hotline{" "}
        <span className="text-primary font-semibold">0373 635 003</span>
      </p>

      <div className="bg-[#fff6f6] flex flex-col justify-center gap-2 text-gray-800 py-4 px-40 mb-6 rounded-md">
        <p className="m-0 text-sm leading-[1.5]">
          Mã đơn đặt hàng: <span className="font-semibold">{orderCode}</span>
        </p>
        <p>
          Chúng tôi sẽ gửi thông tin chi tiết đơn hàng về địa chỉ email của Quý
          Khách hoặc{" "}
          <a href={`/profile/orders`} className="text-blue-600 underline">
            Xem tại đây
          </a>
          .
        </p>
      </div>

      <CustomButton
        href="/"
        className="text-white flex items-center gap-[10px]"
      >
        <CartWhiteIcon /> TIẾP TỤC MUA SẮM
      </CustomButton>
    </div>
  );
};

export default CheckoutSuccess;
