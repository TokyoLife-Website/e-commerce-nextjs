export enum CouponType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export enum CouponStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
}

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderAmout?: number;
  maxDiscountAmount?: number;
  startDate: string; // ISO string cho Date
  endDate: string; // ISO string cho Date
  usageLimit: number;
  usedCount: number;
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
}
