import React from "react";
import { LuPencil, LuTrash2, LuEllipsis } from "react-icons/lu";

export interface CourseCardActionsProps {
  courseId: string;
  onEdit?: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CourseCardActions: React.FC<CourseCardActionsProps> = ({
  courseId,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <button
        type="button"
        onClick={() => onEdit?.(courseId)}
        aria-label="Edit course"
        className="p-1 hover:text-neutral-primary transition-colors cursor-pointer"
      >
        <LuPencil className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onDelete(courseId)}
        aria-label="Delete course"
        className="p-1 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
      >
        <LuTrash2 className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        aria-label="More options"
        className="p-1 hover:text-neutral-primary transition-colors cursor-pointer"
      >
        <LuEllipsis className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
