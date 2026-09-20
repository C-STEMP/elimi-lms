import React from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export interface CoursesPaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export const CoursesPagination: React.FC<CoursesPaginationProps> = ({
  currentPage,
  totalPages = 39,
  onPageChange,
}) => {
  const pages: (number | string)[] = [1, 2, 3, "...", 38, 39];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs py-3.5 px-4 flex items-center justify-center gap-1.5 select-none mt-2">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <LuChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, index) => {
        if (typeof page === "string") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
            >
              {page}
            </span>
          );
        }

        const isActive = currentPage === page;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center ${
              isActive
                ? "bg-secondary text-white shadow-2xs"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <LuChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
