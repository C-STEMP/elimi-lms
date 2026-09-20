import React from "react";
import { CourseAdminCard } from "./course-admin-card";
import type { AdminCourseItem } from "../../types/courses";

export interface CoursesGridProps {
  courses: AdminCourseItem[];
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  onPreview?: (id: string) => void;
  onPublish?: (id: string) => void;
  onUnpublish?: (id: string) => void;
}

export const CoursesGrid: React.FC<CoursesGridProps> = ({
  courses,
  onDelete,
  onEdit,
  onPreview,
  onPublish,
  onUnpublish,
}) => {
  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
        <p className="text-base font-semibold text-neutral-primary">
          No courses found
        </p>
        <p className="text-xs text-neutral-secondary mt-1 max-w-sm">
          Try changing your filter tabs or search query, or create a new course.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {courses.map((course) => (
        <CourseAdminCard
          key={course.id}
          course={course}
          onDelete={onDelete}
          onEdit={onEdit}
          onPreview={onPreview}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
        />
      ))}
    </div>
  );
};
