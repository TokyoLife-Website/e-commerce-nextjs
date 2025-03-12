import Image from "next/image";
import React, { FC } from "react";
import { CustomTitle } from "./CustomTitle";
import Link from "next/link";

interface ListItemProps {
  content: string;
  to?: string;
}

const ListItem: FC<ListItemProps> = ({ content, to = "/" }) => {
  return (
    <Link
      href={to}
      className="block list-none text-[13px] leading-6 text-black whitespace-normal cursor-pointer font-normal normal-case no-underline transition duration-100 ease-linear hover:underline hover:underline-offset-2 hover:font-semibold"
    >
      {content}
    </Link>
  );
};

export const Footer = () => {
  return (
    <footer>
      <div className="mx-36 flex justify-between gap-x-4 pt-[60px]">
        <div className="grid grid-cols-4 gap-x-4 md:max-w-[900px]">
          <ul>
            <CustomTitle className="mb-6" content="VỀ TOKYOLIFE" />
            <ListItem content="Chúng tôi là ai" />
            <ListItem content="Cam kết của chúng tôi" />
            <ListItem content="Tin tuyển dụng" />
            <ListItem content="Hệ thống cửa hàng" />
          </ul>
          <ul>
            <CustomTitle className="mb-6" content="HỖ TRỢ KHÁCH HÀNG" />
            <ListItem content="Hướng dẫn đặt hàng" />
            <ListItem content="Phương thức thanh toán" />
            <ListItem content="Chính sách thành viên" />
            <ListItem content="Chính sách tích - tiêu điểm" />
          </ul>
          <ul>
            <CustomTitle className="mb-6" content="CHÍNH SÁCH" />
            <ListItem content="Chính sách vận chuyển" />
            <ListItem content="Chính sách kiểm hàng" />
            <ListItem content="Chính sách đổi trả" />
            <ListItem content="Điều kiện & Điều khoản" />
            <ListItem content="Chính sách bảo mật" />
          </ul>
          <ul>
            <CustomTitle className="mb-6" content="LIÊN HỆ" />
            <li className="leading-6 text-[#737373] list-none text-[13px]">
              Tư vấn mua online: 024 7308 2882
            </li>
            <li className="leading-6 text-[#737373] list-none text-[13px]">
              Khiếu nại và bảo hành: 024 7300 6999
            </li>
            <li className="leading-6 text-[#737373] list-none text-[13px]">
              Email: cskh@tokyolife.vn
            </li>
            <li className="leading-6 text-[#737373] list-none text-[13px]">
              Giờ làm việc: 8:30 - 22:00 hàng ngày
            </li>
          </ul>
          <ul>
            <CustomTitle className="mb-6" content="Kết nối với TOKYOLIFE" />
            <div className="flex gap-4">
              <Image
                src="/tiktok.svg"
                alt="Next.js logo"
                width={24}
                height={24}
                priority
              />
              <Image
                src="/facebook.svg"
                alt="Next.js logo"
                width={24}
                height={24}
                priority
              />
              <Image
                src="/zalo.svg"
                alt="Next.js logo"
                width={24}
                height={24}
                priority
              />
              <Image
                src="/youtube.svg"
                alt="Next.js logo"
                width={24}
                height={24}
                priority
              />
              <span className="flex gap-x-2 items-center">
                <Image
                  className="rounded-full"
                  src="/news.gif"
                  alt="Next.js logo"
                  width={24}
                  height={24}
                  unoptimized
                />
                <h6 className="text-[11px] font-medium text-black leading-3">
                  TokyoLife
                  <br />
                  News
                </h6>
              </span>
            </div>
          </ul>
        </div>
        <div className="flex flex-col">
          <CustomTitle
            className="mb-6"
            content="ĐĂNG KÝ NHẬN TIN TỪ TOKYOLIFE"
          />
          <div className="flex flex-col gap-y-4">
            <div className="flex items-stretch border border-[#222222] rounded-sm overflow-hidden outline outline-[1px] outline-solid outline-[#222222]">
              <input
                type="email"
                className="flex-1 p-2 text-sm pl-4 outline-none"
                placeholder="Nhập địa chỉ Email"
                required
              />
              <button
                type="submit"
                className="px-4 bg-black text-white text-base font-bold hover:bg-gray-800"
              >
                Đăng ký
              </button>
            </div>
            <p className="text-[14px] leading-[18px] text-black">
              Cài App nhận{" "}
              <span className="text-primary font-semibold">
                Ưu đãi 50% Sinh Nhật
              </span>
              <br />
              Tích Điểm Mọi Hóa Đơn
            </p>
            <div className="flex items-center gap-x-4">
              <Image
                src="/qrcode.webp"
                alt="QR code"
                width={88}
                height={88}
                priority
              />
              <div className="flex flex-col gap-2">
                <Image
                  src="/app_store.svg"
                  alt="logo"
                  width={125}
                  height={41}
                  priority
                />
                <Image
                  src="/google_play.svg"
                  alt="logo"
                  width={125}
                  height={41}
                  priority
                />
              </div>
            </div>
            <p className="text-[14px] leading-[18px] text-black">
              Chúng tôi kết nối thanh toán qua
            </p>
            <div className="flex gap-2">
              <Image
                src="/cod.svg"
                alt="logo"
                width={100}
                height={40}
                priority
              />
              <Image
                src="/vnpay.svg"
                alt="logo"
                width={130}
                height={40}
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white mx-36 pt-6 mt-6 pb-10 border-dashed border-t-[1px] border-[#999999]">
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <div className="max-w-[670px]">
            <CustomTitle className="mb-6" content="Công ty cổ phần STAAAR" />
            <div className="text-sm flex flex-wrap gap-x-2">
              <p>
                <span className="underline underline-offset-2">Địa chỉ:</span>{" "}
                Tầng 6, số 96 Thái Hà Phường Trung Liệt, Quận Đống Đa, Thành phố
                Hà Nội, Việt Nam.
              </p>
              <p>
                <span className="underline underline-offset-2">
                  Mã số thuế:
                </span>{" "}
                0109749326, ngày cấp ĐKKD 29/04/2021.
              </p>
              <p>
                <span className="underline underline-offset-2">Nơi cấp:</span>{" "}
                Sở kế hoạch và đầu tư thành phố Hà Nội.
              </p>
              <p>
                <span className="underline underline-offset-2">
                  Điện thoại:
                </span>{" "}
                024.7300.6999
              </p>
              <p>
                <span className="underline underline-offset-2">Email:</span>{" "}
                cskh@tokyolife.vn
              </p>
            </div>
          </div>
          <Image
            alt="bocongthuong"
            src="/bocongthuong.webp"
            width={144}
            height={55}
            priority
          />
        </div>
      </div>
      <div className="bg-black gap-4 flex items-center justify-center py-4">
        <Image
          src="/footer-logo.webp"
          alt="logo"
          width={150}
          height={34}
          priority
        />
        <p className="text-[12px] leading-4 font-normal text-white">
          Copyright © 2014-2025 Tokyolife.vn All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
