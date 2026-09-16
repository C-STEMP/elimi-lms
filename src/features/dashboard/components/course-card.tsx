"use client";

import React from "react";
import { Button } from "@/shared/components/ui/button";
import { formatMoney } from "@/features/dashboard/hooks";
import type { CourseSummary } from "@/features/courses/types";

interface CourseCardProps {
  course: CourseSummary;
  onEnroll: (courseId: string) => void;
  isEnrolling: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, isEnrolling }) => {
  return (
    <div className="bg-white border border-border-gray/60 rounded-2xl overflow-hidden flex flex-col">
      <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20" aria-hidden="true" />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-text-dark text-sm leading-tight">{course.title}</h3>
          <span className="text-primary-solid font-bold text-sm whitespace-nowrap">
            {formatMoney(course.price)}
          </span>
        </div>
        <p className="text-neutral-secondary text-xs leading-relaxed line-clamp-2 flex-1">
          {course.description || "No description available yet."}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          fullWidth
          loading={isEnrolling}
          onClick={() => onEnroll(course.id)}
          className="mt-2"
        >
          Enroll Now
        </Button>
      </div>
    </div>
  );
};
