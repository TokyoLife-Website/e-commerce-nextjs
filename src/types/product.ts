import { DiscountType } from "./discountType";
import { SKU } from "./sku";

export interface Product {
  id: string | number;
  name: string;
  price: number;
  finalPrice: number;
  discountType: DiscountType;
  discountValue: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  skus: SKU[];
  slug: string;
  images: string[];
  description: string;
  createdAt: string;
}
