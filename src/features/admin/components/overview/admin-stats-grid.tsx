import React from "react";
import { AdminStatCard } from "./admin-stat-card";
import { DEFAULT_ADMIN_STATS } from "../../constants/overview-data";
import type { AdminStatItem } from "../../types/overview";

export interface AdminStatsGridProps {
  readonly stats?: readonly AdminStatItem[];
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({
  stats = DEFAULT_ADMIN_STATS,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <AdminStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
};
