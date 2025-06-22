export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export const STATUS_STYLES = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-600",
  [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-600",
  [OrderStatus.DELIVERING]: "bg-purple-100 text-purple-600",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-600",
  [OrderStatus.CANCELLED]: "bg-gray-100 text-gray-600",
  [OrderStatus.RETURNED]: "bg-red-100 text-red-600",
} as const;
