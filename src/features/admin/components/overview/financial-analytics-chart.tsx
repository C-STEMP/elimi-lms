"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LuChevronDown } from "react-icons/lu";
import { DEFAULT_MONTHLY_REVENUE } from "../../constants/overview-data";
import type { MonthlyRevenueItem } from "../../types/overview";

export interface FinancialAnalyticsChartProps {
  readonly data?: readonly MonthlyRevenueItem[];
}

const formatYAxis = (value: number): string => {
  if (value >= 1_000_000) return `${value / 1_000_000}m`;
  if (value > 0) return `${value / 1_000}k`;
  return "0";
};

export const FinancialAnalyticsChart: React.FC<FinancialAnalyticsChartProps> = ({
  data = DEFAULT_MONTHLY_REVENUE,
}) => {
  const [selectedYear, setSelectedYear] = useState("2026");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col justify-between select-none h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-neutral-primary tracking-tight">
          Financial Analytics
        </h2>

        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold text-neutral-primary cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <LuChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[...data]}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical
              horizontal
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tick={{ fill: "#6B7280", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              tickFormatter={formatYAxis}
              ticks={[0, 200000, 400000, 600000, 800000, 1000000]}
              domain={[0, 1000000]}
            />
            <Tooltip
              formatter={(value: unknown) => [
                `₦${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="revenue"
              fill="#8280EA"
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3 pt-2">
        <span className="w-2.5 h-2.5 rounded-xs bg-[#8280EA]" />
        <span className="text-xs font-semibold text-neutral-secondary">
          Revenue
        </span>
      </div>
    </div>
  );
};
