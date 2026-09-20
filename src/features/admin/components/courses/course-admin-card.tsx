import React from "react";
import Image from "next/image";
import { CourseCardBadge } from "./course-card-badge";
import { CourseCardActions } from "./course-card-actions";
import type { AdminCourseItem } from "../../types/courses";

export interface CourseAdminCardProps {
  course: AdminCourseItem;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  onPreview?: (id: string) => void;
  onPublish?: (id: string) => void;
  onUnpublish?: (id: string) => void;
}

export const CourseAdminCard: React.FC<CourseAdminCardProps> = ({
  course,
  onDelete,
  onEdit,
  onPreview,
  onPublish,
  onUnpublish,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-3.5 flex flex-col justify-between hover:shadow-sm transition-shadow">
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <CourseCardBadge status={course.status} />
          <CourseCardActions
            courseId={course.id}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>

        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-100 mb-3">
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-neutral-primary truncate flex-1" title={course.title}>
            {course.title}
          </h3>
          <span className="font-bold text-sm text-primary shrink-0">
            {course.price}
          </span>
        </div>

        <p className="text-xs text-neutral-secondary line-clamp-2 mt-1 leading-relaxed">
          {course.description}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-3.5">
        <button
          type="button"
          onClick={() => onPreview?.(course.id)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-xs transition-colors cursor-pointer text-center shadow-2xs"
        >
          Preview
        </button>
        {course.status === "draft" ? (
          <button
            type="button"
            onClick={() => onPublish?.(course.id)}
            className="py-2.5 px-3 rounded-xl bg-primary-solid hover:bg-primary-hover text-white font-semibold text-xs transition-colors cursor-pointer text-center shadow-2xs"
          >
            Publish
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onUnpublish?.(course.id)}
            className="py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-neutral-secondary font-semibold text-xs transition-colors cursor-pointer text-center shadow-2xs"
          >
            Unpublish
          </button>
        )}
      </div>
    </div>
  );
};
