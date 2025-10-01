import { User } from "./user";
import { OrderStatus } from "./orderStatus";
import { PaymentMethod } from "./paymentMethod";
import { SKU } from "./sku";
import { Address } from "./address";
import { Coupon } from "./coupon";

export interface OrderStatusHistory {
  id: number;
  orderId: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface Order {
  id: number;
  code: string;
  user: User;
  address: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  discount: number;
  shippingFee: number;
  total: number;
  finalAmount: number;
  coupon?: Coupon;
  note?: string;
  items: OrderItem[];
  isReviewed: boolean;
  orderStatusHistory?: OrderStatusHistory[];
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
