import React from "react";
import RightIcon from "../icons/RightIcon";
import { Product } from "@/types/product";
import { FireIcon } from "../icons/FireIcon";
import SearchItem from "./SearchItem";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendSuggestions } from "@/constants/trendSuggestion";
import TrendSuggestionItem from "./TrendSuggestionItem";

const SearchSuggestions = ({
  searchItems,
  totalRemaining,
  keyword,
  onClose,
}: {
  searchItems: Product[];
  totalRemaining: number;
  keyword: string;
  onClose: () => void;
}) => {
  const router = useRouter();
  const isTrendSuggestion =
    keyword.trim().length === 0 && searchItems.length === 0;

  const handleTrendSuggestion = (suggestion: string) => {
    onClose();
    router.push(`/search?keyword=${suggestion}`);
  };

  return (
    <>
      <h3 className="flex items-center gap-x-1.5 text-md leading-[18px] font-semibold mb-4">
        <FireIcon />{" "}
        {isTrendSuggestion ? "Tìm kiếm phổ biến" : "Sản phẩm gợi ý"}
      </h3>
      {isTrendSuggestion && (
        <div className="flex items-center gap-2">
          {TrendSuggestions.map((suggestion) => (
            <TrendSuggestionItem
              key={suggestion}
              suggestion={suggestion}
              handleTrendSuggestion={handleTrendSuggestion}
            />
          ))}
        </div>
      )}
      {!isTrendSuggestion && (
        <div className="flex flex-col md:grid grid-cols-5 gap-2 md:gap-4 p-2 md:p-4">
          {searchItems.map((product: Product) => (
            <div key={product.id} onClick={onClose}>
              <SearchItem product={product} />
            </div>
          ))}
        </div>
      )}
      {totalRemaining > 0 && !isTrendSuggestion && (
        <Link
          onClick={onClose}
          href={`/search?keyword=${keyword}`}
          className="flex items-center text-primary justify-end gap-x-1 cursor-pointer text-sm leading-[18px] font-semibold mb-4"
        >
          Xem tất cả ({totalRemaining}) <RightIcon />
        </Link>
      )}
    </>
  );
};

export default SearchSuggestions;
