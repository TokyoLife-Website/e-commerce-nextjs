import { SKU } from "./sku";

export interface CartItem {
  id: string | number;
  quantity: number;
  total: number;
  sku: SKU;
}

export interface Cart {
  id: number;
  total: number;
  items: CartItem[];
}
