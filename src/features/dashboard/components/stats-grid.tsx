"use client";

import React from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FiAward, FiBookOpen, FiCheckCircle, FiClock } from "react-icons/fi";
import { useDashboardStats } from "@/features/dashboard/hooks";

const STAT_META: Record<
  string,
  { href: string; Icon: IconType; iconBg: string; iconColor: string }
> = {
  Enrolled: {
    href: "/courses",
    Icon: FiBookOpen,
    iconBg: "bg-primary-solid/10",
    iconColor: "text-primary-solid",
  },
  Ongoing: {
    href: "/courses",
    Icon: FiClock,
    iconBg: "bg-amber-100/80",
    iconColor: "text-amber-700",
  },
  Completed: {
    href: "/courses",
    Icon: FiCheckCircle,
    iconBg: "bg-emerald-100/80",
    iconColor: "text-emerald-700",
  },
  Certificates: {
    href: "/certificates",
    Icon: FiAward,
    iconBg: "bg-indigo-100/80",
    iconColor: "text-indigo-700",
  },
};

export const StatsGrid: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
      {stats.map((stat) => {
        const meta = STAT_META[stat.label] ?? {
          href: "/courses",
          Icon: FiBookOpen,
          iconBg: "bg-input-bg",
          iconColor: "text-neutral-primary",
        };
        const Icon = meta.Icon;

        return (
          <Link
            key={stat.label}
            href={meta.href}
            className="group bg-white border border-border-gray/55 hover:border-primary-solid/35 rounded-[18px] p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-neutral-secondary group-hover:text-neutral-primary transition-colors">
                {stat.label}
              </span>
              <span
                className={`w-8 h-8 rounded-xl ${meta.iconBg} ${meta.iconColor} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-4 h-4" />
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-text-dark tracking-tight leading-none">
                {isLoading ? "—" : stat.value}
              </span>
              <span className="text-xs font-medium text-neutral-secondary">
                {stat.suffix}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
