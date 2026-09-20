"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { LuChevronDown } from "react-icons/lu";
import { DEFAULT_AGE_DISTRIBUTION } from "../../constants/overview-data";
import type { AgeDistributionData } from "../../types/overview";

export interface AgeDistributionChartProps {
  readonly data?: AgeDistributionData;
}

export const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({
  data = DEFAULT_AGE_DISTRIBUTION,
}) => {
  const [selectedYear, setSelectedYear] = useState("2026");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col justify-between select-none h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base sm:text-lg font-bold text-neutral-primary tracking-tight">
          Age Distribution
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

      <div className="relative w-full h-52 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[...data.segments]}
              dataKey="count"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={82}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.segments.map((segment) => (
                <Cell key={segment.name} fill={segment.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: unknown, name: unknown) => [
                Number(value).toLocaleString(),
                String(name),
              ]}
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-neutral-primary tracking-tight">
            {data.centerMetric}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-2 pt-2 border-t border-gray-50 text-xs font-semibold text-neutral-secondary">
        {data.segments.map((segment) => (
          <div key={segment.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <span>
              {segment.name} {segment.count.toLocaleString()} (
              {segment.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
