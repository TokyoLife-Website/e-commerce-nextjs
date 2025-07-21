"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { CategoryList } from "../layouts/category/CategoryList";
import { HeaderProfile } from "./HeaderProfile";
import { CartBlackIcon } from "@/components/icons/CartBlackIcon";
import { useProductsQuery } from "@/hooks/api/product.api";
import { useDebounce } from "@/hooks/useDebounce";
import ProductItem from "@/components/product/ProductItem";
import { Product } from "@/types/product";
import { useCarts } from "@/hooks/api/cart.api";
import NoSearchResult from "./NoSearchResult";
import SearchItem from "./SearchItem";
import { FireIcon } from "../icons/FireIcon";
import RightIcon from "../icons/RightIcon";

export const Header = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const debouncedSetKeyword = useDebounce((value: string) => {
    setKeyword(value);
  }, 500);

  const { data: searchResult } = useProductsQuery(1, 5, keyword);
  const { data: carts } = useCarts();

  // Handler: click outside search panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsSearchActive(false);
      }
    }
    if (isSearchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchActive]);

  // Handler: search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      debouncedSetKeyword(e.target.value);
    },
    [debouncedSetKeyword]
  );

  // Handler: focus search input
  const handleSearchFocus = useCallback(() => {
    setIsSearchActive(true);
  }, []);

  const cartCount = carts?.data?.items?.length ?? 0;
  const searchItems = searchResult?.data?.items ?? [];
  const totalRemaining = (searchResult?.data?.totalItems ?? 0) - 5;

  return (
    <div className="top-0 sticky w-full z-40">
      <div className="flex relative flex-col md:flex-row bg-secondary items-center justify-between py-3 px-4 md:px-8 lg:px-20 xl:px-40 gap-3 md:gap-0 z-50">
        <Link href="/" className="flex-shrink-0">
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
            ref={inputRef}
            type="search"
            id="location-search"
            className="focus:border-gray-500 border border-gray-300 block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-md outline-none"
            placeholder="Tìm kiếm..."
            required
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute top-0 end-0 h-full px-4 text-sm font-medium text-white bg-primary rounded-e-md"
          >
            <CiSearch size={20} />
          </button>
        </div>
        <div className="flex gap-3 items-center order-3 md:order-none w-full md:w-auto justify-end">
          <Link href="/cart" className="relative">
            <CartBlackIcon />
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-6 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
          <HeaderProfile />
        </div>
      </div>
      {isSearchActive && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            onClick={() => setIsSearchActive(false)}
          />
          <div
            ref={panelRef}
            className="absolute left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="max-w-[1200px] mx-auto py-6 px-4">
              <div>
                {searchItems.length > 0 ? (
                  <>
                    <h3 className="flex items-center gap-x-1.5 text-sm leading-[18px] font-semibold mb-4">
                      <FireIcon /> Sản phẩm gợi ý
                    </h3>
                    <div className="flex flex-col md:grid grid-cols-5 gap-2 md:gap-4 p-2 md:p-4">
                      {searchItems.map((product: Product) => (
                        <div
                          key={product.id}
                          onClick={() => setIsSearchActive(false)}
                        >
                          <SearchItem product={product} />
                        </div>
                      ))}
                    </div>
                    {totalRemaining > 0 && (
                      <Link
                        href={`/search?keyword=${keyword}`}
                        className="flex items-center text-primary justify-end gap-x-1 cursor-pointer text-sm leading-[18px] font-semibold mb-4"
                      >
                        Xem tất cả ({totalRemaining}) <RightIcon />
                      </Link>
                    )}
                  </>
                ) : (
                  <NoSearchResult keyword={keyword} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {!isSearchActive && (
        <div className="hidden md:block">
          <CategoryList />
        </div>
      )}
    </div>
  );
};
