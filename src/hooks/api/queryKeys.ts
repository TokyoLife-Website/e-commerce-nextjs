export const QUERY_KEYS = {
  USER: "user",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  PRODUCT: (id: string | number) => `product-${id}`,
};
