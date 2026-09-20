import React from "react";
import { LuSearch, LuSlidersHorizontal, LuList, LuLayoutGrid } from "react-icons/lu";
import type { LearnersViewMode } from "../../types/learners";

export interface LearnersSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: LearnersViewMode;
  onViewModeChange: (mode: LearnersViewMode) => void;
  onFilterClick?: () => void;
}

export const LearnersSearchFilterBar: React.FC<LearnersSearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onFilterClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-b border-gray-100 select-none">
      <div className="relative w-full sm:max-w-xs">
        <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search candidates..."
          className="w-full pl-9 pr-3.5 py-2 bg-input-bg rounded-xl border border-gray-200 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={onFilterClick}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span>Filter</span>
          <LuSlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              viewMode === "list"
                ? "border-rose-200 bg-rose-50/60 text-primary"
                : "border-gray-200 text-gray-400 hover:text-gray-600"
            }`}
          >
            <LuList className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "border-rose-200 bg-rose-50/60 text-primary"
                : "border-gray-200 text-gray-400 hover:text-gray-600"
            }`}
          >
            <LuLayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
