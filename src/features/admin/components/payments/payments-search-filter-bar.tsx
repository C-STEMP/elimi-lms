"use client";

import React from "react";
import { LuSearch, LuList, LuLayoutGrid } from "react-icons/lu";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { PAYMENT_STATUS_OPTIONS } from "../../constants/payments-data";
import type { PaymentsViewMode } from "../../types/payments";

export interface PaymentsSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: PaymentsViewMode;
  onViewModeChange: (mode: PaymentsViewMode) => void;
}

export const PaymentsSearchFilterBar: React.FC<PaymentsSearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-b border-gray-100 select-none">
      <div className="w-full sm:max-w-xs">
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search candidates..."
          prefix={<LuSearch className="w-4 h-4 text-gray-400" />}
        />
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <div className="w-36">
          <Select
            placeholder="Status"
            options={PAYMENT_STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          />
        </div>

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
