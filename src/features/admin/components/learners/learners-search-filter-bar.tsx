"use client";

import React from "react";
import { LuSearch, LuSlidersHorizontal, LuList, LuLayoutGrid } from "react-icons/lu";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
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
      <div className="w-full sm:max-w-xs">
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search learners..."
          prefix={<LuSearch className="w-4 h-4 text-gray-400" />}
        />
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          rightIcon={<LuSlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />}
        >
          Filter
        </Button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              viewMode === "list"
                ? "border-rose-200 bg-rose-50/60 text-primary"
                : "border-gray-200 text-gray-400 hover:text-gray-600 bg-white"
            }`}
          >
            <LuList className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "border-rose-200 bg-rose-50/60 text-primary"
                : "border-gray-200 text-gray-400 hover:text-gray-600 bg-white"
            }`}
          >
            <LuLayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
