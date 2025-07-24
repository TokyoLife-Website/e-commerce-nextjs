export enum SortType {
  RATING_DESC = "rating_desc", // Đánh giá cao → thấp
  RATING_ASC = "rating_asc", // Đánh giá thấp → cao

  LATEST_DESC = "latest_desc", // Mới nhất → cũ nhất
  LATEST_ASC = "latest_asc", // Cũ nhất → mới nhất

  PRICE_ASC = "price_asc", // Giá thấp → cao
  PRICE_DESC = "price_desc", // Giá cao → thấp

  NAME_ASC = "name_asc", // Tên A → Z
  NAME_DESC = "name_desc", // Tên Z → A

  DISCOUNT_DESC = "discount_desc", // Giảm giá nhiều → ít
  DISCOUNT_ASC = "discount_asc", // Giảm giá ít → nhiều

  SOLD_DESC = "sold_desc", // Bán chạy nhất

  DEFAULT = "default",
}

export const sortOptions = [
  { id: SortType.DEFAULT, name: "Mặc định" },
  { id: SortType.RATING_DESC, name: "Đánh giá từ cao đến thấp" },
  { id: SortType.RATING_ASC, name: "Đánh giá từ thấp đến cao" },
  { id: SortType.LATEST_DESC, name: "Mới nhất" },
  { id: SortType.LATEST_ASC, name: "Cũ nhất" },
  { id: SortType.PRICE_ASC, name: "Giá từ thấp đến cao" },
  { id: SortType.PRICE_DESC, name: "Giá từ cao đến thấp" },
  { id: SortType.NAME_ASC, name: "Tên (từ A đến Z)" },
  { id: SortType.NAME_DESC, name: "Tên (từ Z đến A)" },
  { id: SortType.DISCOUNT_DESC, name: "Giảm nhiều nhất" },
  { id: SortType.DISCOUNT_ASC, name: "Giảm ít nhất" },
  { id: SortType.SOLD_DESC, name: "Bán chạy nhất" },
];
