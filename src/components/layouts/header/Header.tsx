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
      <div className="flex flex-col md:flex-row items-center justify-between py-3 px-4 md:px-8 lg:px-20 xl:mx-40 gap-3 md:gap-0">
        <Link href={"/"} className="flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="logo"
            width={128}
            height={32}
            priority
            className="w-32 md:w-52 h-auto"
          />
        </Link>
        <div className="relative w-full md:w-1/2 order-2 md:order-none mt-2 md:mt-0">
          <input
            type="search"
            id="location-search"
            className="focus:border-gray-500 border border-gray-300 block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-md outline-none"
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
        <div className="flex gap-3 items-center order-3 md:order-none w-full md:w-auto justify-end">
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
      <div className="hidden md:block">
        <CategoryList />
      </div>
    </div>
  );
};
