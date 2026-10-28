"use client";

import React from "react";
import CountUp from "react-countup";
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
      end: lmsStats ? lmsStats.learners.byStatus.active : null,
      label: "Active Learners",
    },
    {
      end: publishedCoursesCount,
      label: "Published Courses",
    },
    {
      end: lmsStats ? lmsStats.enrollments.total : null,
      label: "Course Enrollments",
    },
    {
      end: capStats ? capStats.catalogue.trades.active : null,
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
                {stat.end !== null ? (
                  <CountUp
                    end={stat.end}
                    duration={2}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                  />
                ) : (
                  <span
                    className="mx-auto block h-7 sm:h-9 lg:h-10 w-16 sm:w-24 rounded-md bg-neutral-200 animate-pulse"
                    aria-hidden="true"
                  />
                )}
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
