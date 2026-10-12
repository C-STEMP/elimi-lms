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
  FiGlobe,
  FiEyeOff,
  FiCheckCircle,
  FiRefreshCw,
  FiLayers,
  FiTag,
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
  onTogglePublishUnit?: (unit: UnitCourseItem) => Promise<void> | void;
  publishingUnitId?: string | null;
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
  onTogglePublishUnit,
  publishingUnitId,
}) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const publishedCount = units.filter((u) => u.status === "published").length;
  const draftCount = units.length - publishedCount;
  const publicationPercentage =
    units.length > 0 ? Math.round((publishedCount / units.length) * 100) : 0;

  const filters: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All Units", count: units.length },
    { id: "published", label: "Published", count: publishedCount },
    { id: "draft", label: "Drafts", count: draftCount },
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
    <div className="flex flex-col gap-6">
      {/* Navigation Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={onBackToLevels}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-secondary hover:text-primary-solid transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Qualification Levels</span>
        </button>
      </div>

      {/* Hero Header & Level Overview Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-7 shadow-2xs flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-solid/10 text-primary-solid flex items-center justify-center font-bold text-lg shrink-0">
              L{level.level}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-solid/10 text-primary-solid">
                  {trade.sector?.name || "Vocational Trade"}
                </span>
                <span className="text-xs text-neutral-secondary font-medium">
                  {trade.name} • NSQ Level {level.level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-primary tracking-tight">
                Level {level.level} Competency Units
              </h1>
              <p className="text-xs sm:text-sm text-neutral-secondary mt-1 max-w-2xl">
                National Occupational Standards curriculum units. Publish units to make them immediately accessible to learners in the LMS catalogue.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:self-end lg:self-center shrink-0">
            <button
              type="button"
              onClick={onUploadZip}
              className="border border-gray-200 bg-white hover:bg-gray-50 text-neutral-primary font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <FiUploadCloud className="w-4 h-4 text-secondary" />
              <span>Upload SCORM (.zip)</span>
            </button>
            <button
              type="button"
              onClick={onAddUnitManually}
              className="bg-primary-solid hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Course Unit</span>
            </button>
          </div>
        </div>

        {/* Level Readiness Stats Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
          <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
            <span className="text-[11px] font-semibold text-neutral-secondary uppercase tracking-wider block">
              Total Units
            </span>
            <span className="text-lg font-extrabold text-neutral-primary mt-0.5 block">
              {units.length}
            </span>
            <span className="text-[11px] text-neutral-secondary">
              Curriculum standards
            </span>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Live in Catalogue
            </span>
            <span className="text-lg font-extrabold text-emerald-700 mt-0.5 block">
              {publishedCount}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">
              Learner accessible
            </span>
          </div>

          <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
              Draft Units
            </span>
            <span className="text-lg font-extrabold text-amber-700 mt-0.5 block">
              {draftCount}
            </span>
            <span className="text-[11px] text-amber-600 font-medium">
              Authoring / Pending
            </span>
          </div>

          <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-neutral-secondary uppercase tracking-wider">
                  Catalogue Readiness
                </span>
                <span className="text-primary-solid font-extrabold">
                  {publicationPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200/80 rounded-full h-2 mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${publicationPercentage}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-neutral-secondary mt-1">
              {publishedCount} of {units.length} published
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {units.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center flex flex-col items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-primary-solid/10 text-primary-solid flex items-center justify-center">
            <FiBookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-neutral-primary">
            No course units configured yet
          </h3>
          <p className="text-xs text-neutral-secondary max-w-sm leading-relaxed">
            Create a course unit manually or upload a SCORM package (.zip) to automatically author a module for NSQ Level {level.level}.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={onUploadZip}
              className="border border-gray-200 bg-white hover:bg-gray-50 text-neutral-primary font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FiUploadCloud className="w-4 h-4 text-secondary" />
              <span>Upload SCORM</span>
            </button>
            <button
              type="button"
              onClick={onAddUnitManually}
              className="bg-primary-solid hover:bg-primary-hover text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Unit</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-2xs overflow-hidden">
          {/* Filter & Search Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-1 bg-input-bg rounded-xl p-1 self-start">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatus(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    status === f.id
                      ? "bg-white text-primary-solid shadow-2xs"
                      : "text-neutral-secondary hover:text-neutral-primary"
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      status === f.id
                        ? "bg-primary-solid/10 text-primary-solid"
                        : "bg-gray-200/60 text-neutral-secondary"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            <label className="relative sm:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or unit code..."
                className="w-full bg-input-bg border border-gray-200/80 rounded-xl pl-9.5 pr-3.5 py-2 text-xs sm:text-sm text-neutral-primary placeholder:text-neutral-secondary focus:outline-none focus:bg-white focus:border-secondary transition-colors"
              />
            </label>
          </div>

          {/* Units List */}
          {visibleUnits.length === 0 ? (
            <div className="px-4 py-16 text-center flex flex-col items-center justify-center gap-2">
              <FiBookOpen className="w-8 h-8 text-neutral-secondary/40" />
              <p className="text-sm font-semibold text-neutral-primary">
                No units match your filter
              </p>
              <p className="text-xs text-neutral-secondary">
                Try searching with a different keyword or resetting your filter.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visibleUnits.map((unit) => {
                const isPublished = unit.status === "published";
                const isPublishingThis = publishingUnitId === unit.id;
                const isFree =
                  !unit.price ||
                  unit.price.amountMinorUnits === "0" ||
                  Number(unit.price.amountMinorUnits) === 0;

                return (
                  <li
                    key={unit.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-input-bg/50 transition-colors group"
                  >
                    {/* Unit Info */}
                    <div
                      onClick={() => onEditUnit(unit)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-primary-solid bg-primary-solid/8 border border-primary-solid/15 px-2 py-0.5 rounded-md">
                          {unit.referenceNumber}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {isPublished ? "Live in Catalogue" : "Draft"}
                        </span>

                        <span className="text-[11px] font-semibold text-neutral-secondary bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <FiLayers className="w-3 h-3 text-secondary" />
                          <span>Course Module</span>
                        </span>

                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            isFree
                              ? "bg-emerald-50 text-emerald-700 font-bold"
                              : "bg-gray-100 text-neutral-primary"
                          }`}
                        >
                          {isFree
                            ? "Free"
                            : `${unit.price?.currency || "NGN"} ${(
                                Number(unit.price?.amountMinorUnits || 0) / 100
                              ).toLocaleString()}`}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-neutral-primary group-hover:text-primary-solid transition-colors truncate">
                        {unit.title}
                      </h3>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-2 sm:shrink-0 justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      {/* Full Publish / Unpublish Button */}
                      {onTogglePublishUnit && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePublishUnit(unit);
                          }}
                          disabled={isPublishingThis}
                          title={
                            isPublished
                              ? "Unpublish course unit (revert to draft)"
                              : "Publish course unit live to catalogue"
                          }
                          className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-[0.98] disabled:opacity-50 ${
                            isPublished
                              ? "border border-gray-200 hover:border-amber-300 bg-white hover:bg-amber-50 text-neutral-secondary hover:text-amber-800"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}
                        >
                          {isPublishingThis ? (
                            <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : isPublished ? (
                            <FiEyeOff className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <FiGlobe className="w-3.5 h-3.5" />
                          )}
                          <span>{isPublished ? "Unpublish" : "Publish"}</span>
                        </button>
                      )}

                      <div className="flex items-center gap-1 text-neutral-secondary">
                        {unit.courseId && (
                          <Link
                            href={`/courses/${unit.courseId}`}
                            target="_blank"
                            title="Preview in course player"
                            aria-label={`Preview ${unit.title}`}
                            className="p-2 rounded-xl hover:bg-white hover:text-primary-solid transition-colors border border-transparent hover:border-gray-200"
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => onEditUnit(unit)}
                          title="Edit unit details"
                          aria-label={`Edit ${unit.title}`}
                          className="p-2 rounded-xl hover:bg-white hover:text-primary-solid transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteUnit(unit)}
                          title="Delete unit"
                          aria-label={`Delete ${unit.title}`}
                          className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border border-transparent hover:border-red-100"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
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
