import { User } from "./user";
import { OrderStatus } from "./orderStatus";
import { PaymentMethod } from "./paymentMethod";
import { SKU } from "./sku";
import { Address } from "./address";

export interface Order {
  id: number;
  code: string;
  user: User;
  address: Address;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  discount: number;
  shippingFee: number;
  total: number;
  note?: string;
  items: OrderItem[];
  isReviewed: boolean;
  createdAt: Date;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  sku: SKU;
}

export interface CreateOrderDto {
  addressId: number;
  paymentMethod: PaymentMethod;
  note?: string;
}
