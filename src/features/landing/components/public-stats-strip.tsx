"use client";

import React from "react";
import { useCapPublicStats, useLmsPublicStats } from "@/features/landing/hooks";

export const PublicStatsStrip: React.FC = () => {
  const { data: lmsStats } = useLmsPublicStats();
  const { data: capStats } = useCapPublicStats();

  const publishedCoursesCount = lmsStats
    ? lmsStats.unitOfferings.byStatus.published +
      lmsStats.standaloneCourses.byStatus.published +
      lmsStats.levelOfferings.byStatus.published
    : null;

  const metrics = [
    {
      value: lmsStats
        ? lmsStats.learners.byStatus.active.toLocaleString()
        : "—",
      label: "Active Learners",
    },
    {
      value:
        publishedCoursesCount !== null
          ? publishedCoursesCount.toLocaleString()
          : "—",
      label: "Published Courses",
    },
    {
      value: lmsStats ? lmsStats.enrollments.total.toLocaleString() : "—",
      label: "Course Enrollments",
    },
    {
      value: capStats
        ? capStats.catalogue.trades.active.toLocaleString()
        : "—",
      label: "Accredited Trades",
    },
  ];

  return (
    <section
      aria-label="Platform statistics"
      className="w-full py-8 sm:py-10 border-b border-neutral-100 bg-white select-none"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-200/80 bg-[#fafafa] px-4 py-4 sm:py-5 text-center transition-all hover:border-primary-solid/30 hover:bg-white hover:shadow-xs"
            >
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] tracking-tight leading-none">
                {stat.value}
              </span>
              <span className="mt-1.5 block text-[11px] sm:text-xs font-semibold text-neutral-500 tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
