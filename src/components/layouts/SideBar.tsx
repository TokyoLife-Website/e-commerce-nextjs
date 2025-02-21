"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, JSX, useState } from "react";
import { FaRegUser, FaRegStar } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { FiTag } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";

interface MenuItem {
  label: string;
  icon?: JSX.Element;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { label: "Đơn hàng của tôi", icon: <BsBoxSeam />, href: "/profile/orders" },
  {
    label: "Tài khoản của tôi",
    icon: <FaRegUser />,
    children: [
      { label: "Hồ sơ", href: "/profile/account/personal-info" },
      { label: "Địa chỉ", href: "/profile/account/address" },
      { label: "Đổi mật khẩu", href: "/profile/account/change-password" },
    ],
  },
  {
    label: "Mã khuyến mại",
    icon: <FiTag />,
    href: "/profile/vouchers",
  },
  { label: "Đánh giá của tôi", icon: <FaRegStar />, href: "/profile/reviews" },
  {
    label: "Sản phẩm đã xem",
    icon: <IoEyeOutline />,
    href: "/profile/viewed-products",
  },
];

const Sidebar: FC = () => {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string>("");

  const handleToggle = (label: string) => {
    setOpenSection(openSection === label ? "" : label);
  };

  return (
    <ul className="space-y-2 bg-white p-4 h-fit">
      {menuItems.map((item) => (
        <li key={item.label}>
          {item.children ? (
            <div>
              <div
                className={`flex items-center gap-2.5 p-2 rounded-[4px] cursor-pointer hover:bg-primary hover:text-white ${
                  item.children.some((child) => child.href === pathname) &&
                  "bg-primary text-white"
                }
                }`}
                onClick={() => handleToggle(item.label)}
              >
                {item.icon}
                <span className="font-semibold leading-[18px]">
                  {item.label}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openSection === item.label ? "max-h-60" : "max-h-0 "
                }`}
              >
                <ul className="px-8 space-y-2">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href!}
                        className={`block p-1 font-normal leading-[18px] rounded-lg text-gray-700 hover:text-primary ${
                          pathname === child.href && "text-primary"
                        }`}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <Link
              href={item.href!}
              className={`flex items-center gap-2.5 p-2 rounded-[4px] ${
                pathname === item.href && "bg-primary text-white"
              } hover:bg-primary hover:text-white text-gray-700`}
            >
              {item.icon}
              <span className="font-semibold leading-[18px] ">
                {item.label}
              </span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
