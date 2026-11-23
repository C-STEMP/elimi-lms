"use client";

import React from "react";
import Link from "next/link";
import { useDashboardStats } from "@/features/dashboard/hooks";

const STAT_HREF: Record<string, string> = {
  Enrolled: "/courses",
  Ongoing: "/courses",
  Completed: "/courses",
  Certificates: "/certificates",
};

export const StatsGrid: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
      {stats.map((stat) => {
        const href = STAT_HREF[stat.label] || "/courses";
        return (
          <Link
            key={stat.label}
            href={href}
            className="bg-white border border-border-gray/60 hover:border-primary-solid/35 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-1 shadow-2xs hover:shadow-sm transition-all"
          >
            <span className="text-xs sm:text-sm font-semibold text-neutral-secondary">
              {stat.label}
            </span>
            <span className="text-2xl font-extrabold text-text-dark">
              {isLoading ? "—" : stat.value}{" "}
              <span className="text-xs sm:text-sm font-medium text-neutral-secondary">
                {stat.suffix}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
};
