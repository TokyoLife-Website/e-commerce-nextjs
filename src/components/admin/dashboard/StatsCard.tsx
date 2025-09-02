import React from "react";
import { IconType } from "react-icons";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  icon: IconType;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={`text-sm font-medium ${
            Number(change) > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change ? `${change}%` : "0%"}
        </span>
        <span className="text-sm text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
