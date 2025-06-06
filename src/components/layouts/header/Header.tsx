import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import React from "react";
import { CategoryList } from "../category/CategoryList";
import { HeaderProfile } from "./HeaderProfile";
import Link from "next/link";
import { CartBlackIcon } from "@/components/icons/CartBlackIcon";

export const Header = () => {
  return (
    <div className="top-0 sticky w-full bg-secondary z-40">
      <div className="flex items-center justify-between py-3 mx-40">
        <Link href={"/"}>
          <Image src="/logo.svg" alt="logo" width={212} height={32} priority />
        </Link>
        <div className="relative w-[50%]">
          <input
            type="search"
            id="location-search"
            className="focus:border-gray-500 border border-gray-300  block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-md outline-none"
            placeholder="Tìm kiếm..."
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 h-full px-4 text-sm font-medium text-white bg-primary rounded-e-md"
          >
            <CiSearch size={20} />
          </button>
        </div>
        <div className="flex gap-3 items-center">
          <Link href={"/cart"} className="relative">
            <CartBlackIcon />
            {4 > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-4 flex items-center justify-center">
                {4}
              </span>
            )}
          </Link>
          <HeaderProfile />
        </div>
      </div>
      <CategoryList />
    </div>
  );
};
