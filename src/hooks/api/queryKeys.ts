export const QUERY_KEYS = {
  USER: "user",
  REVIEWS: "reviews",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  USER_ADDRESSES: "user-addresses",
  CARTS: "carts",
  ORDERS: "orders",
  ORDER: (orderCode: string) => `order-${orderCode}`,
  PRODUCT: (id: string | number) => `product-${id}`,
};
