import React from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export interface CoursesPaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export const CoursesPagination: React.FC<CoursesPaginationProps> = ({
  currentPage,
  totalPages = 1,
  onPageChange,
}) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);

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
