import React from "react";
import { DEFAULT_TOP_COURSES } from "../../constants/overview-data";
import type { TopCourseItem } from "../../types/overview";

export interface TopPerformingCoursesProps {
  readonly courses?: readonly TopCourseItem[];
}

export const TopPerformingCourses: React.FC<TopPerformingCoursesProps> = ({
  courses = DEFAULT_TOP_COURSES,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col justify-between select-none h-full">
      <h2 className="text-base sm:text-lg font-bold text-neutral-primary tracking-tight mb-4">
        Top Performing Courses
      </h2>

      <div className="flex flex-col gap-2.5 flex-1 justify-between">
        {courses.map((course, idx) => (
          <div
            key={`${course.id}-${idx}`}
            className="bg-[#F8F9FA] rounded-xl px-4 py-3 flex items-center justify-between gap-3"
          >
            <span className="text-xs sm:text-sm font-bold text-neutral-primary truncate">
              {course.title}
            </span>
            <span className="bg-[#DCFCE7] text-[#166534] px-2.5 py-1 rounded-md text-xs font-bold shrink-0">
              {course.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
