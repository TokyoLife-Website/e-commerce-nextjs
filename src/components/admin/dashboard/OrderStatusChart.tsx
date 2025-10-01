"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { OrderStatus } from "@/types/orderStatus";
import { useOrderStatusDistribution } from "@/hooks/api/dashboard.api";
import { getOrderStatusLabel } from "@/components/order/OrderStatusTag";
import { PeriodType } from "@/types/periodType";
import Loading from "@/components/common/Loading";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "#F59E0B"; // yellow-500
    case OrderStatus.PROCESSING:
      return "#3B82F6"; // blue-500
    case OrderStatus.DELIVERING:
      return "#8B5CF6"; // purple-500
    case OrderStatus.DELIVERED:
      return "#10B981"; // green-500
    case OrderStatus.CANCELLED:
      return "#EF4444"; // red-500
    case OrderStatus.RETURNED:
      return "#6B7280"; // gray-500
    default:
      return "#9CA3AF"; // gray-400
  }
};

const OrderStatusChart: React.FC = () => {
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.MONTH);
  const {
    data: statusData,
    isLoading,
    error,
  } = useOrderStatusDistribution(period);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load order status data</div>;
  }

  if (!statusData?.data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  const distribution = statusData.data;
  const statuses = Object.keys(distribution) as OrderStatus[];

  // Filter out statuses with 0 count for cleaner chart
  const filteredStatuses = statuses.filter(
    (status) => distribution[status] > 0
  );

  if (filteredStatuses.length === 0) {
    return (
      <>
        {/* Period Selector */}
        <div className="flex items-center justify-end gap-2">
          {(
            [
              { key: PeriodType.WEEK, label: "This Week" },
              { key: PeriodType.MONTH, label: "This Month" },
              { key: PeriodType.YEAR, label: "This Year" },
            ] as const
          ).map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1 rounded text-sm border transition-colors ${
                period === p.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No orders found
        </div>
      </>
    );
  }

  const chartData = {
    labels: filteredStatuses.map(getOrderStatusLabel),
    datasets: [
      {
        data: filteredStatuses.map((status) => distribution[status]),
        backgroundColor: filteredStatuses.map(getStatusColor),
        borderColor: filteredStatuses.map(getStatusColor),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} orders (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  const totalOrders = filteredStatuses.reduce(
    (sum, status) => sum + distribution[status],
    0
  );

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex items-center justify-end gap-2">
        {(
          [
            { key: PeriodType.WEEK, label: "This Week" },
            { key: PeriodType.MONTH, label: "This Month" },
            { key: PeriodType.YEAR, label: "This Year" },
          ] as const
        ).map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-3 py-1 rounded text-sm border transition-colors ${
              period === p.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>

      {/* Summary */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Total Orders:{" "}
          <span className="font-semibold text-gray-900">{totalOrders}</span>
        </p>
      </div>

      {/* Status List */}
      <div className="space-y-2">
        {filteredStatuses.map((status) => {
          const count = distribution[status];
          const percentage = ((count / totalOrders) * 100).toFixed(1);

          return (
            <div
              key={status}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(status) }}
                />
                <span className="text-gray-700">
                  {getOrderStatusLabel(status)}
                </span>
              </div>
              <div className="text-right">
                <span className="font-medium text-gray-900">{count}</span>
                <span className="text-gray-500 ml-1">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusChart;
