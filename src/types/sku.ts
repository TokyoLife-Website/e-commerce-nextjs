import { Product } from "./product";

export interface SKU {
  id: number | string;
  sku: string;
  productId: number | string;
  quantity: number;
  size: string;
  color: string;
  product: Product;
}
