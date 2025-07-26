import React from "react";
import { Product } from "@/types/product";
import Loading from "../common/Loading";
import NoSearchResult from "./NoSearchResult";
import SearchSuggestions from "./SearchSuggestions";

interface SearchPanelProps {
  isLoading: boolean;
  searchItems: Product[];
  totalRemaining: number;
  keyword: string;
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  isLoading,
  searchItems,
  totalRemaining,
  keyword,
  onClose,
  panelRef,
}) => (
  <>
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
      onClick={onClose}
    />
    <div
      ref={panelRef}
      className="absolute left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
    >
      <div className="max-w-[1200px] mx-auto py-6 px-4">
        <div>
          {isLoading ? (
            <Loading />
          ) : searchItems.length === 0 && keyword.trim().length > 0 ? (
            <NoSearchResult keyword={keyword} isSearching />
          ) : (
            <SearchSuggestions
              searchItems={searchItems}
              totalRemaining={totalRemaining}
              keyword={keyword}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  </>
);

export default SearchPanel;
