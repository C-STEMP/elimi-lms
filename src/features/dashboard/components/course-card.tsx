"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
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

  return (
    <div className="bg-white border border-border-gray/60 hover:border-primary-solid/30 rounded-2xl overflow-hidden flex flex-col shadow-2xs hover:shadow-md transition-all group">
      <div className="relative h-36 bg-linear-to-br from-primary/15 via-primary/10 to-secondary/20 flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <FiBookOpen className="w-9 h-9 text-primary-solid/35" aria-hidden="true" />
        )}
        <span
          className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
            free
              ? "bg-emerald-50/95 text-emerald-700 border border-emerald-200"
              : "bg-white/95 text-primary-solid border border-border-gray/60"
          }`}
        >
          {free ? "Free" : formatMoney(course.price)}
        </span>
        {isCompleted && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white inline-flex items-center gap-1 shadow-xs">
            <FiCheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <h3 className="font-bold text-text-dark text-sm leading-snug line-clamp-2 group-hover:text-primary-solid transition-colors">
          {course.title}
        </h3>
        <p className="text-neutral-secondary text-xs leading-relaxed line-clamp-2 flex-1">
          {course.description || "Explore this course to build practical skills and earn your certificate."}
        </p>

        {enrollmentId && typeof percentComplete === "number" && (
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-secondary">
              <span>{isCompleted ? "Completed" : "Progress"}</span>
              <span className="text-text-dark">{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-input-bg overflow-hidden">
              <div
                className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-secondary"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {enrollmentId ? (
          <Link href={`/learn/${enrollmentId}`} className="mt-1">
            <Button
              type="button"
              variant={isCompleted ? "outline" : "secondary"}
              size="sm"
              fullWidth
            >
              {isCompleted ? "Review Course" : "Continue Learning"}
            </Button>
          </Link>
        ) : free ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth
            loading={isEnrolling}
            onClick={() => onEnrollFree(course.id)}
            className="mt-1"
          >
            Enroll Free
          </Button>
        ) : (
          <Link href={`/courses/${course.id}`} className="mt-1">
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
  );
};
