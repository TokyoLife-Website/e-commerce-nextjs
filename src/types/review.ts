import { SKU } from "./sku";
import { User } from "./user";

export interface Review {
  id: string | number;
  rating: number;
  comment: string;
  userId: string | number;
  user: User;
  skuId: string | number;
  sku: SKU;
  orderItemId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewItem {
  productId: number;
  productName: string;
  productSlug: string;
  productImage: string | null;
  size: string;
  color: string;
  comment?: string;
  rating?: number;
  reviewDate?: Date;
  orderDate?: Date;
  orderItemId: number;
}

export enum ReviewStatus {
  REVIEWED = "REVIEWED",
  NOT_REVIEWED = "NOT_REVIEWED",
}
