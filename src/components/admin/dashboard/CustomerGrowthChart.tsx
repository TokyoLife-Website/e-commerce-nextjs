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
import { useCustomerGrowth } from "@/hooks/api/dashboard.api";
import Loading from "@/components/common/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const CustomerGrowthChart: React.FC = () => {
  const [granularity, setGranularity] = React.useState<"day" | "month">("day");
  const [range, setRange] = React.useState<number | undefined>(30);

  const { data, isLoading, error } = useCustomerGrowth(granularity, range);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Failed to load customer growth
      </div>
    );

  const rows = data?.data || [];
  const labels = rows.map((r: any) => r.period);
  const values = rows.map((r: any) => r.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "New Customers",
        data: values,
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.15)",
        pointBackgroundColor: "#10B981",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: "rgba(0,0,0,0.06)" } },
      x: { grid: { display: false } },
    },
  };

  const total = values.reduce((a: number, b: number) => a + Number(b || 0), 0);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded overflow-hidden border border-gray-300">
          {(
            [
              { k: "day", label: "Daily", range: 30 },
              { k: "month", label: "Monthly", range: 12 },
            ] as const
          ).map((opt) => (
            <button
              key={opt.k}
              onClick={() => {
                setGranularity(opt.k);
                setRange(opt.range);
              }}
              className={`px-3 py-1 text-sm ${
                granularity === opt.k
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Total New Customers:{" "}
          <span className="font-semibold text-gray-900">{total}</span>
        </p>
      </div>
    </div>
  );
};

export default CustomerGrowthChart;
