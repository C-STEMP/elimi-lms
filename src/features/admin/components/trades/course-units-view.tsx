"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiPlus,
  FiUploadCloud,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiBookOpen,
  FiSearch,
} from "react-icons/fi";
import type { Trade, LevelItem, UnitCourseItem } from "@/features/cap/types";

export interface CourseUnitsViewProps {
  trade: Trade;
  level: LevelItem;
  units: UnitCourseItem[];
  onBackToLevels: () => void;
  onAddUnitManually: () => void;
  onUploadZip: () => void;
  onEditUnit: (unit: UnitCourseItem) => void;
  onDeleteUnit: (unit: UnitCourseItem) => void;
}

type StatusFilter = "all" | "published" | "draft";

export const CourseUnitsView: React.FC<CourseUnitsViewProps> = ({
  trade,
  level,
  units,
  onBackToLevels,
  onAddUnitManually,
  onUploadZip,
  onEditUnit,
  onDeleteUnit,
}) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const publishedCount = units.filter((u) => u.status === "published").length;
  const filters: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: units.length },
    { id: "published", label: "Published", count: publishedCount },
    { id: "draft", label: "Drafts", count: units.length - publishedCount },
  ];

  const visibleUnits = useMemo(() => {
    const q = query.trim().toLowerCase();
    return units.filter(
      (u) =>
        (status === "all" || u.status === status) &&
        (!q ||
          u.title.toLowerCase().includes(q) ||
          u.referenceNumber.toLowerCase().includes(q))
    );
  }, [units, query, status]);

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={onBackToLevels}
        className="self-start inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-secondary hover:text-primary-solid transition-colors cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back to Levels</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-neutral-secondary truncate">
            {[trade.sector?.name, trade.name].filter(Boolean).join(" / ")}
          </p>
          <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-neutral-primary tracking-tight">
            Level {level.level} Units
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onUploadZip}
            className="flex-1 sm:flex-initial border border-gray-200 bg-white hover:bg-gray-50 text-neutral-primary font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FiUploadCloud className="w-4 h-4 text-secondary" />
            <span>Upload SCORM</span>
          </button>
          <button
            type="button"
            onClick={onAddUnitManually}
            className="flex-1 sm:flex-initial bg-primary-solid hover:bg-primary-hover text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Unit</span>
          </button>
        </div>
      </div>

      {units.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 px-6 py-14 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-solid/10 text-primary-solid flex items-center justify-center">
            <FiBookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-primary">No units yet</h3>
          <p className="text-xs text-neutral-secondary max-w-xs">
            Add a unit, or upload a SCORM package to create one automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border-b border-gray-100">
            <div className="flex items-center gap-1 bg-input-bg rounded-xl p-1 self-start">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatus(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    status === f.id
                      ? "bg-white text-primary-solid shadow-2xs"
                      : "text-neutral-secondary hover:text-neutral-primary"
                  }`}
                >
                  {f.label} <span className="opacity-60">{f.count}</span>
                </button>
              ))}
            </div>

            <label className="relative sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search units"
                className="w-full bg-input-bg rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-primary placeholder:text-neutral-secondary focus:outline-none focus:ring-2 focus:ring-primary-solid/20"
              />
            </label>
          </div>

          {/* Rows */}
          {visibleUnits.length === 0 ? (
            <p className="px-4 py-10 text-center text-xs sm:text-sm text-neutral-secondary">
              No units match your search.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visibleUnits.map((unit) => {
                const isPublished = unit.status === "published";
                return (
                  <li
                    key={unit.id}
                    className="flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-input-bg/60 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => onEditUnit(unit)}
                      className="min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <p className="text-[11px] font-semibold tracking-wide text-primary-solid">
                        {unit.referenceNumber}
                      </p>
                      <p className="text-sm font-semibold text-neutral-primary truncate">
                        {unit.title}
                      </p>
                    </button>

                    <span
                      className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium shrink-0 ${
                        isPublished ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPublished ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {isPublished ? "Published" : "Draft"}
                    </span>

                    <div className="flex items-center shrink-0 text-neutral-secondary">
                      {unit.courseId && (
                        <Link
                          href={`/courses/${unit.courseId}`}
                          target="_blank"
                          title="Preview course"
                          aria-label={`Preview ${unit.title}`}
                          className="p-2 rounded-lg hover:bg-white hover:text-primary-solid transition-colors"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => onEditUnit(unit)}
                        title="Edit unit"
                        aria-label={`Edit ${unit.title}`}
                        className="p-2 rounded-lg hover:bg-white hover:text-primary-solid transition-colors cursor-pointer"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteUnit(unit)}
                        title="Delete unit"
                        aria-label={`Delete ${unit.title}`}
                        className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
