"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { formatMoney, isFree } from "@/shared/lib/money";
import type { CourseSummary } from "@/features/courses/types";

interface CourseCardProps {
  course: CourseSummary;
  enrollmentId?: string;
  onEnrollFree: (courseId: string) => void;
  isEnrolling: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  enrollmentId,
  onEnrollFree,
  isEnrolling,
}) => {
  const free = isFree(course.price);

  return (
    <div className="bg-white border border-border-gray/60 rounded-2xl overflow-hidden flex flex-col">
      <div className="h-32 bg-linear-to-br from-primary/20 to-secondary/20" aria-hidden="true" />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-text-dark text-sm leading-tight">{course.title}</h3>
          <span
            className={`font-bold text-sm whitespace-nowrap ${free ? "text-green-700" : "text-primary-solid"}`}
          >
            {free ? "Free" : formatMoney(course.price)}
          </span>
        </div>
        <p className="text-neutral-secondary text-xs leading-relaxed line-clamp-2 flex-1">
          {course.description || "No description available yet."}
        </p>

        {enrollmentId ? (
          <Link href={`/learn/${enrollmentId}`} className="mt-2">
            <Button type="button" variant="secondary" size="sm" fullWidth>
              Continue Learning
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
            className="mt-2"
          >
            Enroll Free
          </Button>
        ) : (
          <Link href={`/courses/${course.id}`} className="mt-2">
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
