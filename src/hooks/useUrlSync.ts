import { DEFAULT_PRICE_RANGE } from "@/constants";
import { Color } from "@/types/color";
import { SortType } from "@/types/sortType";
import { useEffect, useState } from "react";

const parseColorFromUrl = (colorParam: string | null): Color | null => {
  return colorParam as Color | null;
};

const parsePriceFromUrl = (
  priceParam: string | null
): [number, number] | null => {
  if (!priceParam) return null;
  const [min, max] = priceParam.split("_").map(Number);
  return [min || 0, max || DEFAULT_PRICE_RANGE[1]];
};

const parseSortFromUrl = (sortParam: string | null): SortType => {
  return sortParam && Object.values(SortType).includes(sortParam as SortType)
    ? (sortParam as SortType)
    : SortType.DEFAULT;
};

const parsePageFromUrl = (pageParam: string | null): number => {
  const page = Number(pageParam);
  return page > 0 ? page : 1;
};

export const useUrlSync = (searchParams: URLSearchParams) => {
  const [sortType, setSortType] = useState<SortType>(() =>
    parseSortFromUrl(searchParams.get("sort"))
  );
  const [selectedColor, setSelectedColor] = useState<Color | null>(() =>
    parseColorFromUrl(searchParams.get("color"))
  );
  const [priceRange, setPriceRange] = useState<[number, number] | null>(() =>
    parsePriceFromUrl(searchParams.get("price"))
  );
  const [currentPage, setCurrentPage] = useState<number>(() =>
    parsePageFromUrl(searchParams.get("page"))
  );

  // Sync state with URL params
  useEffect(() => {
    const urlColor = parseColorFromUrl(searchParams.get("color"));
    const urlPrice = parsePriceFromUrl(searchParams.get("price"));
    const urlSort = parseSortFromUrl(searchParams.get("sort"));
    const urlPage = parsePageFromUrl(searchParams.get("page"));

    if (urlColor !== selectedColor) setSelectedColor(urlColor);

    if (urlPrice === null && priceRange !== null) {
      setPriceRange(null);
    } else if (
      urlPrice &&
      priceRange &&
      (urlPrice[0] !== priceRange[0] || urlPrice[1] !== priceRange[1])
    ) {
      setPriceRange(urlPrice);
    }
    if (urlSort !== sortType) setSortType(urlSort);
    if (urlPage !== currentPage) setCurrentPage(urlPage);
  }, [searchParams]);

  return {
    sortType,
    setSortType,
    selectedColor,
    setSelectedColor,
    priceRange,
    setPriceRange,
    currentPage,
    setCurrentPage,
  };
};
