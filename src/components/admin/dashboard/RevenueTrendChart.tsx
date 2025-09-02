"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useRevenueByMonth } from "@/hooks/api/dashboard.api";
import { formatCurrency } from "@/utils/formatCurrency";
import Loading from "@/components/common/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const monthsPresets = [
  { label: "Last 6 months", value: 6 },
  { label: "Last 12 months", value: 12 },
  { label: "Last 24 months", value: 24 },
];

const RevenueTrendChart: React.FC = () => {
  const [months, setMonths] = React.useState<number>(6);
  const { data, isLoading, error } = useRevenueByMonth(months);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Failed to load revenue data
      </div>
    );
  }

  const rows = data?.data || [];
  const labels = rows.map((r: any) => r.month);
  const values = rows.map((r: any) => r.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: values,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.15)",
        pointBackgroundColor: "#3B82F6",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${formatCurrency(Number(ctx.parsed.y))}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `${formatCurrency(Number(value))}`,
        },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const total = values.reduce((a: number, b: number) => a + Number(b || 0), 0);

  return (
    <div className="space-y-4">
      {/* Preset selector */}
      <div className="flex items-center justify-end gap-2">
        {monthsPresets.map((p) => (
          <button
            key={p.value}
            onClick={() => setMonths(p.value)}
            className={`px-3 py-1 rounded text-sm border transition-colors ${
              months === p.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Total Revenue:{" "}
          <span className="font-semibold text-gray-900">
            {formatCurrency(total)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RevenueTrendChart;
