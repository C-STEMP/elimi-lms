"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiPlayCircle } from "react-icons/fi";
import { useMyEnrollments } from "@/features/enrollments/hooks";

export const ContinueLearning: React.FC = () => {
  const { data: enrollmentsRes, isLoading } = useMyEnrollments();

  const enrollments = (enrollmentsRes?.data ?? []).filter(
    (e) => e.status === "active" || e.status === "completed",
  );

  // Show active (in-progress) courses first, then recently completed ones
  const sorted = [...enrollments].sort((a, b) => {
    if (a.status === "active" && b.status !== "active") return -1;
    if (a.status !== "active" && b.status === "active") return 1;
    return (b.percentComplete ?? 0) - (a.percentComplete ?? 0);
  });

  if (isLoading) {
    return (
      <section className="flex flex-col gap-3">
        <div className="h-6 w-44 rounded-lg bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
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

  const displayed = sorted.slice(0, 6);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-primary">
            Continue Learning
          </h2>
          <p className="text-xs text-neutral-secondary mt-0.5">
            Pick up right where you left off in your enrolled courses.
          </p>
        </div>
        {sorted.length > 6 && (
          <Link
            href="/courses"
            className="text-xs font-bold text-primary-solid hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>View All ({sorted.length})</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((enrollment) => {
          const isCompleted = enrollment.status === "completed";
          const percent = Math.min(100, Math.max(0, Math.round(enrollment.percentComplete ?? 0)));

          return (
            <Link
              key={enrollment.id}
              href={`/learn/${enrollment.id}`}
              className="group bg-white border border-border-gray/60 hover:border-primary-solid/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md transition-all"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-text-dark leading-snug line-clamp-2 group-hover:text-primary-solid transition-colors">
                    {enrollment.courseTitle || "Enrolled Course"}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 inline-flex items-center gap-1 ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {isCompleted && <FiCheckCircle className="w-3 h-3" />}
                    {isCompleted ? "Completed" : "In Progress"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-secondary">
                    <span>Progress</span>
                    <span className="text-text-dark">{percent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-input-bg overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? "bg-emerald-500" : "bg-secondary"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-gray/40 text-xs font-bold text-primary-solid">
                <span className="inline-flex items-center gap-1.5">
                  <FiPlayCircle className="w-4 h-4" />
                  <span>{isCompleted ? "Review Course" : "Resume Course"}</span>
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
