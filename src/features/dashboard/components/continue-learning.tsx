"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiPlayCircle } from "react-icons/fi";
import { useMyEnrollments } from "@/features/enrollments/hooks";
import { getCourseVisualTheme } from "@/shared/components/ui/course-artwork";

export const ContinueLearning: React.FC = () => {
  const { data: enrollmentsRes, isLoading } = useMyEnrollments();

  const enrollments = (enrollmentsRes?.data ?? []).filter(
    (e) => e.status === "active" || e.status === "completed",
  );

  // Active courses first (most progressed first), then completed courses
  const sorted = [...enrollments].sort((a, b) => {
    if (a.status === "active" && b.status !== "active") return -1;
    if (a.status !== "active" && b.status === "active") return 1;
    return (b.percentComplete ?? 0) - (a.percentComplete ?? 0);
  });

  if (isLoading) {
    return (
      <section className="flex flex-col gap-3">
        <div className="h-6 w-44 rounded-lg bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-border-gray/60 rounded-2xl p-4 flex flex-col gap-3 animate-pulse"
            >
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-2 w-full rounded-full bg-gray-100" />
              <div className="h-8 w-full rounded-xl bg-gray-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (sorted.length === 0) {
    return null;
  }

  const displayed = sorted.slice(0, 8);
  // Balance grid columns cleanly so 2 or 4 items never leave a lone orphan card
  const gridCols =
    displayed.length === 1
      ? "grid-cols-1 max-w-md"
      : displayed.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : displayed.length === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-neutral-primary tracking-tight">
            Continue Learning
          </h2>
          <p className="text-xs sm:text-sm text-neutral-secondary mt-0.5">
            Pick up right where you left off in your enrolled units.
          </p>
        </div>
        {sorted.length > 8 && (
          <Link
            href="/courses"
            className="text-xs font-bold text-primary-solid hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>View All ({sorted.length})</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className={`grid ${gridCols} gap-4`}>
        {displayed.map((enrollment) => {
          const isCompleted = enrollment.status === "completed";
          const percent = Math.min(100, Math.max(0, Math.round(enrollment.percentComplete ?? 0)));
          const theme = getCourseVisualTheme(enrollment.courseTitle);
          const Icon = theme.Icon;
          const ctaLabel = isCompleted
            ? "Review Course"
            : percent === 0
              ? "Start Course"
              : "Continue Learning";

          return (
            <Link
              key={enrollment.id}
              href={`/learn/${enrollment.id}`}
              className={`group bg-white border border-border-gray/55 border-t-[3px] ${
                isCompleted ? "border-t-emerald-500" : theme.borderAccent
              } hover:border-primary-solid/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-4 h-4 ${theme.iconColor}`} />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 inline-flex items-center gap-1 ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : percent === 0
                          ? "bg-input-bg text-neutral-secondary border border-border-gray/50"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {isCompleted && <FiCheckCircle className="w-3 h-3" />}
                    {isCompleted ? "Completed" : percent === 0 ? "Not Started" : "In Progress"}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-text-dark leading-snug line-clamp-2 group-hover:text-primary-solid transition-colors min-h-[2.5rem]">
                  {enrollment.courseTitle || "Enrolled Course"}
                </h3>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-secondary">
                    <span>Progress</span>
                    <span className="text-text-dark font-bold">{percent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-input-bg overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? "bg-emerald-500" : "bg-secondary"
                      }`}
                      style={{ width: `${Math.max(percent, percent > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border-gray/40 text-xs font-bold text-primary-solid">
                <span className="inline-flex items-center gap-1.5">
                  <FiPlayCircle className="w-4 h-4" />
                  <span>{ctaLabel}</span>
                </span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
