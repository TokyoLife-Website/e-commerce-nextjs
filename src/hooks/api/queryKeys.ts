export const QUERY_KEYS = {
  USER: "user",
  REVIEWS: "reviews",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  USER_ADDRESSES: "user-addresses",
  PRODUCT: (id: string | number) => `product-${id}`,
};
