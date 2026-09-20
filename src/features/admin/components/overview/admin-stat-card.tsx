import React from "react";
import type { AdminStatItem } from "../../types/overview";

export interface AdminStatCardProps {
  readonly stat: AdminStatItem;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-xs sm:text-sm font-semibold text-neutral-secondary">
          {stat.title}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-neutral-primary mt-2 tracking-tight">
          {stat.value}
        </p>
      </div>

      <div className={`p-2 rounded-xl bg-gray-50 ${stat.iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
