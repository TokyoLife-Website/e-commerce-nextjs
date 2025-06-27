import { Coupon } from "./coupon";
import { SKU } from "./sku";

export interface CartItem {
  id: string | number;
  quantity: number;
  total: number;
  sku: SKU;
}

export interface Cart {
  id: number;
  discountAmount: number;
  total: number;
  coupon: Coupon;
  finalAmount: number;
  items: CartItem[];
}
