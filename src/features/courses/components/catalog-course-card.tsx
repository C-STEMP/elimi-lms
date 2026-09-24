"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";
import { formatMoney, isFree } from "@/shared/lib/money";
import type { CourseSummary } from "@/features/courses/types";

export interface CatalogCourseCardProps {
  course: CourseSummary;
  thumbnailUrl?: string;
}

export const CatalogCourseCard: React.FC<CatalogCourseCardProps> = ({ course, thumbnailUrl }) => {
  const free = isFree(course.price);

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group bg-white border border-border-gray/60 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative h-36 bg-linear-to-br from-primary/15 to-secondary/20 flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- resolved external asset URL
          <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <FiBookOpen className="w-8 h-8 text-primary-solid/30" />
        )}
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${
            free ? "bg-green-100 text-green-800" : "bg-white/90 text-primary-solid"
          }`}
        >
          {free ? "Free" : "Paid"}
        </span>
        {course.capLinkage?.unitId && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-900/70 text-white backdrop-blur-xs font-mono uppercase">
            {course.capLinkage.unitId.replace("unit-", "UNIT ")}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-text-dark text-sm leading-snug line-clamp-2">{course.title}</h3>
        <p className="text-neutral-secondary text-xs leading-relaxed line-clamp-2 flex-1">
          {course.description || "No description available yet."}
        </p>

        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-100">
          <span className={`font-bold text-sm ${free ? "text-green-700" : "text-primary-solid"}`}>
            {free ? "Free" : formatMoney(course.price)}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-neutral-secondary group-hover:text-primary-solid transition-colors">
            View
            <FiArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
