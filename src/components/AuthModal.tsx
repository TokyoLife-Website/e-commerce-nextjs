"use client";
import React, { FC, useEffect } from "react";
import { CustomTitle } from "./CustomTitle";
import TextInput from "./TextInput";
import Link from "next/link";
import CustomButton from "./CustomBtn";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  if (!isOpen) return;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-[#00000080] z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className=" overflow-y-auto w-[900px] h-[90%] justify-center flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-[60px] pt-[35px] pb-4 bg-white"
      >
        <div className="pr-[30px] w-1/2 border-r border-[#e9e9e9] h-full">
          <h1 className="font-extrabold text-2xl mb-4">Đăng nhập</h1>
          <p className="text-sm font-medium mb-6">
            Nhập số điện thoại của Quý Khách để đăng nhập tài khoản TokyoLife.
          </p>
          <div className="mb-[15px]">
            <TextInput
              label="SĐT"
              isRequired
              size="small"
              type="tel"
              placeHolder="Vui lòng nhập SĐT"
            />
          </div>
          <div className="mb-[15px]">
            <TextInput
              label="Mật khẩu"
              isRequired
              size="small"
              type="password"
              placeHolder="Nhập mật khẩu"
            />
          </div>
          <p className="underline text-xs leading-4 cursor-pointer my-3 float-right">
            Quên mật khẩu?
          </p>
          <CustomButton className="w-full text-white mt-10">
            Đăng nhập
          </CustomButton>
        </div>
        <div className="pl-[30px] w-1/2 h-full ">
          <h1 className="font-extrabold text-2xl mb-4">Đăng ký</h1>
          <p className="text-sm font-medium mb-6">
            Tạo tài khoản và khám phá tất cả các lợi ích dành riêng cho người
            dùng đã đăng ký của TokyoLife.
          </p>
          <div className="flex items-center gap-5 mb-[15px]">
            <TextInput
              label="Họ"
              isRequired
              size="small"
              placeHolder="Nhập họ của bạn"
            />
            <TextInput
              label="Tên"
              isRequired
              size="small"
              placeHolder="Nhập tên của bạn"
            />
          </div>
          <div className="mb-[15px]">
            <TextInput
              label="SĐT"
              isRequired
              size="small"
              type="tel"
              placeHolder="Vui lòng nhập SĐT"
            />
          </div>
          <div className="mb-[15px]">
            <TextInput
              label="Email"
              isRequired
              size="small"
              type="email"
              placeHolder="Nhập email của bạn"
            />
          </div>
          <div className="mb-[15px]">
            <TextInput
              label="Mật khẩu"
              isRequired
              size="small"
              type="password"
              placeHolder="Nhập mật khẩu"
            />
          </div>
          <div className="mb-[15px]">
            <TextInput
              label="Xác nhận mật khẩu"
              isRequired
              size="small"
              type="password"
              placeHolder="Nhập lại mật khẩu xác nhậns"
            />
          </div>
          <p className="font-medium text-xs leading-4">
            Bằng cách tạo tài khoản, Quý Khách đã đồng ý với{" "}
            <Link
              className="text-[#007aff]"
              href={"https://tokyolife.vn/page/terms-conditions"}
            >
              Điều khoản & Điều kiện
            </Link>{" "}
            và{" "}
            <Link
              className="text-[#007aff]"
              href={"https://tokyolife.vn/page/privacy-policy"}
            >
              Chính sách Bảo mật
            </Link>{" "}
            của chúng tôi.
          </p>
          <CustomButton className="text-white w-full my-10 whitespace-nowrap">
            Đăng ký
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
