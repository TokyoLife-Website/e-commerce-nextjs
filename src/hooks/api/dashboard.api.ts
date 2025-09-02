import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { ResponseData } from "@/types/response";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { QUERY_KEYS } from "./queryKeys";
import { PeriodType } from "@/types/periodType";

// Types cho response từ API
export interface DashboardStats {
  totalRevenue: {
    value: number;
    change: number;
  };
  totalOrders: {
    value: number;
    change: number;
  };
  totalCustomers: {
    value: number;
    change: number;
  };
  conversionRate: {
    value: number;
    change: number;
  };
}

export interface OrderStatusDistribution {
  [key: string]: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentOrders: any[];
  topProducts: any[];
  orderStatusDistribution: OrderStatusDistribution;
  revenueByMonth: any[];
}

// API functions
export const dashboardApi = {
  // Lấy thống kê tổng quan
  getDashboardStats: async (): Promise<ResponseData<DashboardStats>> => {
    const response = await axiosInstance.get("/dashboard/stats");
    return response.data;
  },

  // Lấy tất cả dữ liệu dashboard
  getDashboardOverview: async (): Promise<ResponseData<DashboardOverview>> => {
    const response = await axiosInstance.get("/dashboard/overview");
    return response.data;
  },

  // Lấy đơn hàng gần đây
  getRecentOrders: async (
    limit: number = 5
  ): Promise<ResponseData<Order[]>> => {
    const response = await axiosInstance.get(
      `/dashboard/recent-orders?limit=${limit}`
    );
    return response.data;
  },

  // Lấy sản phẩm bán chập
  getTopProducts: async (
    limit: number = 5
  ): Promise<ResponseData<Product[]>> => {
    const response = await axiosInstance.get(
      `/dashboard/top-products?limit=${limit}`
    );
    return response.data;
  },

  // Lấy phân bố trạng thái đơn hàng
  getOrderStatusDistribution: async (
    period?: PeriodType
  ): Promise<ResponseData<OrderStatusDistribution>> => {
    const response = await axiosInstance.get(
      `/dashboard/order-status-distribution${period ? `?period=${period}` : ""}`
    );
    return response.data;
  },

  // Lấy doanh thu theo tháng
  getRevenueByMonth: async (
    months: number = 6
  ): Promise<ResponseData<any[]>> => {
    const response = await axiosInstance.get(
      `/dashboard/revenue-by-month?months=${months}`
    );
    return response.data;
  },

  // Lấy phân bố phương thức thanh toán
  getPaymentMethodDistribution: async (): Promise<
    ResponseData<Record<string, number>>
  > => {
    const response = await axiosInstance.get(
      `/dashboard/payment-method-distribution`
    );
    return response.data;
  },

  // Lấy tăng trưởng khách hàng
  getCustomerGrowth: async (
    granularity: "day" | "month" = "day",
    range?: number
  ): Promise<ResponseData<Array<{ period: string; count: number }>>> => {
    const params = new URLSearchParams();
    if (granularity) params.set("granularity", granularity);
    if (range) params.set("range", String(range));
    const response = await axiosInstance.get(
      `/dashboard/customer-growth?${params.toString()}`
    );
    return response.data;
  },
};

// React Query hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "stats"],
    queryFn: dashboardApi.getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchInterval: 5 * 60 * 1000, // Tự động refetch mỗi 5 phút
  });
};

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "overview"],
    queryFn: dashboardApi.getDashboardOverview,
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchInterval: 5 * 60 * 1000, // Tự động refetch mỗi 5 phút
  });
};

export const useRecentOrders = (limit: number = 5) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "recent-orders", limit],
    queryFn: () => dashboardApi.getRecentOrders(limit),
    staleTime: 2 * 60 * 1000, // 2 phút
    refetchInterval: 2 * 60 * 1000, // Tự động refetch mỗi 2 phút
  });
};

export const useTopProducts = (limit: number = 5) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "top-products", limit],
    queryFn: () => dashboardApi.getTopProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 phút
    refetchInterval: 10 * 60 * 1000, // Tự động refetch mỗi 10 phút
  });
};

export const useOrderStatusDistribution = (period?: PeriodType) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "order-status-distribution", period],
    queryFn: () => dashboardApi.getOrderStatusDistribution(period),
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchInterval: 5 * 60 * 1000, // Tự động refetch mỗi 5 phút
  });
};

export const useRevenueByMonth = (months: number = 6) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "revenue-by-month", months],
    queryFn: () => dashboardApi.getRevenueByMonth(months),
    staleTime: 15 * 60 * 1000, // 15 phút
    refetchInterval: 15 * 60 * 1000, // Tự động refetch mỗi 15 phút
  });
};

export const usePaymentMethodDistribution = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "payment-method-distribution"],
    queryFn: dashboardApi.getPaymentMethodDistribution,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useCustomerGrowth = (
  granularity: "day" | "month" = "day",
  range?: number
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "customer-growth", granularity, range],
    queryFn: () => dashboardApi.getCustomerGrowth(granularity, range),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};
