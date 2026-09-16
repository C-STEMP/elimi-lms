"use client";

import React from "react";
import { useDashboardStats } from "@/features/dashboard/hooks";

export const StatsGrid: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-border-gray/60 rounded-2xl p-5 flex flex-col gap-1"
        >
          <span className="text-sm font-semibold text-neutral-primary">{stat.label}</span>
          <span className="text-2xl font-extrabold text-text-dark">
            {isLoading ? "—" : stat.value}{" "}
            <span className="text-sm font-medium text-neutral-secondary">{stat.suffix}</span>
          </span>
        </div>
      ))}
    </div>
  );
};
