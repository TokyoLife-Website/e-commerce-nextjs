"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { usePaymentMethodDistribution } from "@/hooks/api/dashboard.api";
import Loading from "@/components/common/Loading";

ChartJS.register(ArcElement, Tooltip, Legend);

const METHOD_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  VN_PAY: "VNPay",
  MOMO: "MoMo",
};

const METHOD_COLORS: Record<string, string> = {
  COD: "#F59E0B",
  VN_PAY: "#3B82F6",
  MOMO: "#EC4899",
};

const PaymentMethodChart: React.FC = () => {
  const { data, isLoading, error } = usePaymentMethodDistribution();

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Failed to load payment method data
      </div>
    );

  const distribution = data?.data || {};
  const methods = Object.keys(distribution);
  const nonZero = methods.filter((m) => (distribution as any)[m] > 0);

  if (nonZero.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No orders found
      </div>
    );
  }

  const chartData = {
    labels: nonZero.map((m) => METHOD_LABELS[m] || m),
    datasets: [
      {
        data: nonZero.map((m) => (distribution as any)[m]),
        backgroundColor: nonZero.map((m) => METHOD_COLORS[m] || "#9CA3AF"),
        borderColor: nonZero.map((m) => METHOD_COLORS[m] || "#9CA3AF"),
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || "";
            const value = ctx.parsed;
            const total = ctx.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const pct = ((Number(value) / Number(total)) * 100).toFixed(1);
            return `${label}: ${value} orders (${pct}%)`;
          },
        },
      },
    },
  };

  const total = nonZero.reduce((sum, m) => sum + (distribution as any)[m], 0);

  return (
    <div className="space-y-4">
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Total Orders:{" "}
          <span className="font-semibold text-gray-900">{total}</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodChart;
