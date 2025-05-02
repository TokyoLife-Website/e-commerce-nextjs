import { SKU } from "./sku";
import { User } from "./user";

export interface Review {
  id: string | number;
  rating: number;
  comment: string;
  userId: string | number;
  user: User;
  sku: SKU;
  skuId: string | number;
  createdAt: string;
}
