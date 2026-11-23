"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import {
  CourseArtwork,
  getCourseVisualTheme,
  parseCourseDescriptionMeta,
} from "@/shared/components/ui/course-artwork";
import { formatMoney, isFree } from "@/shared/lib/money";
import type { CourseSummary } from "@/features/courses/types";

export interface CatalogCourseCardProps {
  course: CourseSummary;
  thumbnailUrl?: string;
}

export const CatalogCourseCard: React.FC<CatalogCourseCardProps> = ({
  course,
  thumbnailUrl,
}) => {
  const free = isFree(course.price);
  const meta = parseCourseDescriptionMeta(course.description);
  const theme = getCourseVisualTheme(course.title, course.description);

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group bg-white border border-border-gray/55 hover:border-primary-solid/35 rounded-2xl overflow-hidden flex flex-col shadow-2xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <CourseArtwork
        title={course.title}
        description={course.description}
        thumbnailUrl={thumbnailUrl}
        className="h-36"
      >
        <span
          className={`absolute top-3 left-3 z-10 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs ${
            free
              ? "bg-white/95 text-emerald-700 border border-emerald-200/80"
              : "bg-white/95 text-primary-solid border border-border-gray/50"
          }`}
        >
          {free ? "Free" : formatMoney(course.price)}
        </span>
        {meta.levelLabel && (
          <span className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-900/75 text-white backdrop-blur-xs">
            {meta.levelLabel}
          </span>
        )}
      </CourseArtwork>

      <div className="p-4 flex flex-col gap-2 flex-1">
        {meta.tradeLabel && (
          <span
            className={`self-start px-2 py-0.5 rounded-md border text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText}`}
          >
            {meta.tradeLabel}
          </span>
        )}
        <h3 className="font-bold text-text-dark text-sm leading-snug line-clamp-2 group-hover:text-primary-solid transition-colors">
          {course.title}
        </h3>
        <p className="text-neutral-secondary text-xs leading-relaxed line-clamp-2 flex-1">
          {course.description || "Build practical skills and earn a verified certificate."}
        </p>

        <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-border-gray/35">
          <span
            className={`font-bold text-xs ${free ? "text-emerald-700" : "text-primary-solid"}`}
          >
            {free ? "Free Access" : formatMoney(course.price)}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-primary-solid">
            <span>View Unit</span>
            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};
