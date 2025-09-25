import { DiscountType } from "./discountType";
import { SKU } from "./sku";
import { Category } from "./category";

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
  category?: Category;
  categoryId: number;
  createdAt: string;
}
