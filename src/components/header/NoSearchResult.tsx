import React from "react";
import PaymentFailedIcon from "../icons/PaymentFailedIcon";
import { FireIcon } from "../icons/FireIcon";
import { useRouter } from "next/navigation";
import { TrendSuggestions } from "@/constants/trendSuggestion";
import TrendSuggestionItem from "./TrendSuggestionItem";

interface NoSearchResultProps {
  keyword: string;
  isSearching?: boolean;
}

const NoSearchResult: React.FC<NoSearchResultProps> = ({
  keyword,
  isSearching = false,
}) => {
  const router = useRouter();
  const handleTrendSuggestion = (suggestion: string) => {
    router.push(`/search?keyword=${suggestion}`);
  };
  return (
    <div className="flex flex-col items-center w-full px-6 pt-10 text-center">
      <PaymentFailedIcon />
      <p className="text-center text-gray-700 text-lg mt-8 mb-12">
        Không tìm thấy sản phẩm với từ khóa <strong>{keyword}</strong>
      </p>
      {!isSearching && (
        <div className="max-w-[500px] mx-auto">
          <h3 className="flex items-center gap-x-1.5 text-md leading-[18px] font-semibold mb-4">
            <FireIcon /> Tìm kiếm phổ biến
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {TrendSuggestions.map((suggestion) => (
              <TrendSuggestionItem
                key={suggestion}
                suggestion={suggestion}
                handleTrendSuggestion={handleTrendSuggestion}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoSearchResult;
