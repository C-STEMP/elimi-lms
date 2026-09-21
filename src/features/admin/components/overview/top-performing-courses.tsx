import React from "react";
import { LuBookOpen } from "react-icons/lu";
import type { TopCourseItem } from "../../types/overview";

export interface TopPerformingCoursesProps {
  readonly courses?: readonly TopCourseItem[];
}

export const TopPerformingCourses: React.FC<TopPerformingCoursesProps> = ({
  courses = [],
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col justify-between select-none h-full min-h-75">
      <h2 className="text-base sm:text-lg font-bold text-neutral-primary tracking-tight mb-4">
        Top Performing Courses
      </h2>

      {courses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
            <LuBookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-neutral-primary">
            No Courses Yet
          </h4>
          <p className="text-xs text-neutral-secondary mt-1 max-w-xs">
            Course activity will appear here once learners enroll.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
};
