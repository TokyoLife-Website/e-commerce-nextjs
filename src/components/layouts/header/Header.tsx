import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";
import React from "react";
import { CategoryList } from "../category/CategoryList";
import { HeaderProfile } from "./HeaderProfile";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="top-0 sticky w-full bg-secondary z-50">
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
            <SearchIcon />
          </button>
        </div>
        <div className="flex gap-3 items-center">
          <ShoppingCartOutlinedIcon />
          <HeaderProfile />
        </div>
      </div>
      <CategoryList />
    </div>
  );
};
