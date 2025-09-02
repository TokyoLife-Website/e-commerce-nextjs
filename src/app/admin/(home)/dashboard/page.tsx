"use client";

import React from "react";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import ComponentCard from "@/components/admin/common/ComponentCard";
import {
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaEye,
} from "react-icons/fa";
import { BiSolidCoupon } from "react-icons/bi";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import {
  useDashboardStats,
  useRecentOrders,
  useTopProducts,
} from "@/hooks/api/dashboard.api";
import { formatCurrency } from "@/utils/formatCurrency";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import OrderStatusChart from "@/components/admin/dashboard/OrderStatusChart";
import RevenueTrendChart from "@/components/admin/dashboard/RevenueTrendChart";
import PaymentMethodChart from "@/components/admin/dashboard/PaymentMethodChart";
import CustomerGrowthChart from "@/components/admin/dashboard/CustomerGrowthChart";
import Link from "next/link";

const breadcrumbItems = [{ label: "Home", path: "/admin/dashboard" }];

export default function AdminDashboardPage() {
  const { data: statsData } = useDashboardStats();
  const { data: recentOrders } = useRecentOrders();
  const { data: topProducts } = useTopProducts();
  const { totalCustomers, totalOrders, totalRevenue, conversionRate } =
    statsData?.data || {};

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Dashboard" breadcrumbs={breadcrumbItems} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue?.value || 0)}
          change={totalRevenue?.change}
          icon={FaDollarSign}
          color="bg-green-500"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders?.value || 0}
          change={totalOrders?.change}
          icon={FaShoppingCart}
          color="bg-blue-500"
        />
        <StatsCard
          title="Total Customers"
          value={totalCustomers?.value || 0}
          change={totalCustomers?.change || "0%"}
          icon={FaUsers}
          color="bg-purple-500"
        />
        <StatsCard
          title="Conversion Rate"
          value={conversionRate?.value || "0%"}
          change={conversionRate?.change || "0%"}
          icon={FaChartLine}
          color="bg-orange-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Distribution */}
          <ComponentCard
            title="Order Status Distribution"
            desc="Current distribution of orders by status"
          >
            <OrderStatusChart />
          </ComponentCard>

          <ComponentCard title="Revenue Trend" desc="Revenue trends over time">
            <RevenueTrendChart />
          </ComponentCard>

          <ComponentCard
            title="Customer Growth"
            desc="New customer sign-ups over time"
          >
            <CustomerGrowthChart />
          </ComponentCard>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-1 space-y-6">
          <TopProducts products={topProducts?.data || []} />
          <RecentOrders orders={recentOrders?.data || []} />
          <ComponentCard
            title="Payment Method Distribution"
            desc="Popular payment methods among orders"
          >
            <PaymentMethodChart />
          </ComponentCard>
        </div>
      </div>

      {/* Quick Actions */}
      <ComponentCard title="Quick Actions" desc="Frequently used functions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/orders"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">
              Manage Orders
            </span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaUsers className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">
              Manage Customers
            </span>
          </Link>
          <Link
            href="/admin/reviews"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FaEye className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">
              View Reports
            </span>
          </Link>
          <Link
            href="/admin/coupons"
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <BiSolidCoupon className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">
              Manage Discounts
            </span>
          </Link>
        </div>
      </ComponentCard>
    </div>
  );
}
