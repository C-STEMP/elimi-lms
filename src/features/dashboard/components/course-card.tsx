"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import {
  CourseArtwork,
  getCourseVisualTheme,
  parseCourseDescriptionMeta,
} from "@/shared/components/ui/course-artwork";
import { formatMoney, isFree } from "@/shared/lib/money";
import type { CourseSummary } from "@/features/courses/types";
import type { EnrollmentStatus } from "@/shared/types";

interface CourseCardProps {
  course: CourseSummary;
  thumbnailUrl?: string;
  enrollmentId?: string;
  enrollmentStatus?: EnrollmentStatus;
  percentComplete?: number;
  onEnrollFree: (courseId: string) => void;
  isEnrolling: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  thumbnailUrl,
  enrollmentId,
  enrollmentStatus,
  percentComplete,
  onEnrollFree,
  isEnrolling,
}) => {
  const free = isFree(course.price);
  const isCompleted = enrollmentStatus === "completed";
  const progress = Math.min(100, Math.max(0, Math.round(percentComplete ?? 0)));
  const meta = parseCourseDescriptionMeta(course.description);
  const theme = getCourseVisualTheme(course.title, course.description);

  return (
    <div className="bg-white border border-border-gray/55 hover:border-primary-solid/35 rounded-2xl overflow-hidden flex flex-col shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group">
      <CourseArtwork
        title={course.title}
        description={course.description}
        thumbnailUrl={thumbnailUrl}
        className="h-32"
      >
        <span
          className={`absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
            free
              ? "bg-white/95 text-emerald-700 border border-emerald-200/80"
              : "bg-white/95 text-primary-solid border border-border-gray/60"
          }`}
        >
          {free ? "Free" : formatMoney(course.price)}
        </span>
        {isCompleted ? (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white inline-flex items-center gap-1 shadow-xs">
            <FiCheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </span>
        ) : meta.levelLabel ? (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-neutral-primary border border-border-gray/50 shadow-xs">
            {meta.levelLabel}
          </span>
        ) : null}
      </CourseArtwork>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {meta.tradeLabel && (
          <span
            className={`self-start px-2 py-0.5 rounded-md border text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText}`}
          >
            {meta.tradeLabel}
          </span>
        )}

        <Link href={enrollmentId ? `/learn/${enrollmentId}` : `/courses/${course.id}`}>
          <h3 className="font-bold text-text-dark text-sm leading-snug line-clamp-2 group-hover:text-primary-solid transition-colors">
            {course.title}
          </h3>
        </Link>

        <p className="text-neutral-secondary text-xs leading-relaxed line-clamp-2 flex-1">
          {course.description || "Build practical skills and earn a verified certificate."}
        </p>

        {enrollmentId && typeof percentComplete === "number" && (
          <div className="flex flex-col gap-1 pt-0.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-secondary">
              <span>{isCompleted ? "Completed" : "Progress"}</span>
              <span className="text-text-dark font-bold">{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-input-bg overflow-hidden">
              <div
                className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-secondary"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="pt-2 mt-auto border-t border-border-gray/35">
          {enrollmentId ? (
            <Link href={`/learn/${enrollmentId}`}>
              <Button
                type="button"
                variant={isCompleted ? "outline" : "primary"}
                size="sm"
                fullWidth
              >
                {isCompleted
                  ? "Review Course"
                  : progress === 0
                    ? "Start Course"
                    : "Continue Learning"}
              </Button>
            </Link>
          ) : free ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              loading={isEnrolling}
              onClick={() => onEnrollFree(course.id)}
              rightIcon={<FiArrowRight className="w-3.5 h-3.5" />}
              className="border-primary-solid/25 text-primary-solid hover:bg-primary-solid hover:text-white hover:border-primary-solid"
            >
              Enroll Free
            </Button>
          ) : (
            <Link href={`/courses/${course.id}`}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                fullWidth
                rightIcon={<FiArrowRight className="w-3.5 h-3.5" />}
              >
                View Course
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
