"use client";

import React from "react";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { COURSE_FILTER_TABS } from "../../constants/courses-data";
import type { AdminCourseFilter } from "../../types/courses";

export interface CoursesFilterBarProps {
  activeTab: AdminCourseFilter;
  onTabChange: (tab: AdminCourseFilter) => void;
  onCreateClick: () => void;
}

export const CoursesFilterBar: React.FC<CoursesFilterBarProps> = ({
  activeTab,
  onTabChange,
  onCreateClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
      {/* Tab pills container */}
      <div className="flex items-center bg-white border border-gray-100 shadow-2xs rounded-2xl p-1 overflow-x-auto">
        {COURSE_FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-primary-solid text-white shadow-2xs"
                  : "text-neutral-secondary hover:text-neutral-primary hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Create Course button */}
      <Button
        variant="secondary"
        size="sm"
        rightIcon={<LuPlus className="w-4 h-4" />}
        onClick={onCreateClick}
      >
        Create Course
      </Button>
    </div>
  );
};
