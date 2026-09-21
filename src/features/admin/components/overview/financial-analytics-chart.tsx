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
import { LuChevronDown, LuWallet } from "react-icons/lu";
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
  data = [],
}) => {
  const [selectedYear, setSelectedYear] = useState("2026");

  const totalRevenue = (data ?? []).reduce((acc, d) => acc + d.revenue, 0);
  const maxVal = Math.max(...(data ?? []).map((d) => d.revenue), 0);
  const maxRevenue = maxVal > 0 ? Math.ceil(maxVal * 1.2) : 1000;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col justify-between select-none h-full min-h-75">
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

      {totalRevenue === 0 && data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
            <LuWallet className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-neutral-primary">
            No Revenue Recorded
          </h4>
          <p className="text-xs text-neutral-secondary mt-1 max-w-xs">
            Financial analytics will be generated once enrollments or course
            purchases occur.
          </p>
        </div>
      ) : (
        <>
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
                  domain={[0, maxRevenue]}
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

          <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-gray-50">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#8280EA]" />
            <span className="text-xs font-semibold text-neutral-secondary">
              Revenue
            </span>
          </div>
        </>
      )}
    </div>
  );
};
