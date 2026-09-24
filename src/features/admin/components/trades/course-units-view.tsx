"use client";

import React from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiPlus,
  FiUploadCloud,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiExternalLink,
  FiBookOpen,
  FiCode,
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
  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBackToLevels}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-secondary hover:text-primary-solid transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Levels</span>
        </button>
      </div>

      {/* Level Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary-hover flex items-center justify-center font-bold text-lg shrink-0">
            L{level.level}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {trade.sector?.name && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#75152b]/10 text-primary-solid">
                  {trade.sector.name}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-neutral-primary">
                {trade.name}
              </span>
              <span className="text-xs text-neutral-secondary font-medium">
                NSQ Level {level.level}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-primary tracking-tight">
              Course Units ({units.length})
            </h1>
            <p className="text-xs sm:text-sm text-neutral-secondary mt-1">
              In the LMS, each competency unit is an interactive course module with lessons, SCORM player, and assessments.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={onUploadZip}
            className="flex-1 sm:flex-initial border border-gray-200 bg-white hover:bg-gray-50 text-neutral-primary font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <FiUploadCloud className="w-4 h-4 text-secondary" />
            <span>Upload SCORM Package</span>
          </button>

          <button
            type="button"
            onClick={onAddUnitManually}
            className="flex-1 sm:flex-initial bg-primary-solid hover:bg-primary-hover text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Unit Manually</span>
          </button>
        </div>
      </div>

      {/* Units List */}
      <div className="flex flex-col gap-3">
        {units.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-neutral-secondary mb-1">
              <FiBookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-primary">
              No course units in this qualification level yet
            </h3>
            <p className="text-xs text-neutral-secondary max-w-sm">
              Each unit corresponds to an LMS course. Add units manually or upload a SCORM package ZIP to create interactive course content.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
              <button
                type="button"
                onClick={onUploadZip}
                className="border border-gray-200 bg-white hover:bg-gray-50 text-neutral-primary font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                <FiUploadCloud className="w-4 h-4 text-secondary" />
                <span>Upload SCORM (ZIP)</span>
              </button>
              <button
                type="button"
                onClick={onAddUnitManually}
                className="bg-primary-solid hover:bg-primary-hover text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Unit Manually</span>
              </button>
            </div>
          </div>
        ) : (
          units.map((unit) => {
            const isPublished = unit.status === "published";
            const hasLmsCourse = Boolean(unit.courseId);

            return (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-gray-200 transition-all p-4.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Code badge & title */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="px-2.5 py-1.5 rounded-xl bg-[#75152b]/10 text-primary-solid border border-[#75152b]/20 font-bold text-xs tracking-wider shrink-0 flex items-center gap-1.5">
                    <FiCode className="w-3.5 h-3.5" />
                    <span>{unit.referenceNumber}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {isPublished ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Published in LMS
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Draft in LMS
                          </>
                        )}
                      </span>

                      {hasLmsCourse && (
                        <span className="text-[11px] text-neutral-secondary font-medium">
                          ID: {unit.courseId?.slice(0, 8)}...
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-neutral-primary group-hover:text-primary-solid transition-colors line-clamp-1">
                      {unit.title}
                    </h3>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
                  {hasLmsCourse && (
                    <Link
                      href={`/courses/${unit.courseId}`}
                      target="_blank"
                      className="flex-1 sm:flex-initial border border-gray-200 hover:border-primary-solid hover:bg-primary-solid/5 text-neutral-primary text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Preview Course</span>
                      <FiExternalLink className="w-3.5 h-3.5 text-neutral-secondary" />
                    </Link>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditUnit(unit)}
                      title="Edit Unit"
                      className="p-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-neutral-secondary hover:text-neutral-primary transition-colors cursor-pointer"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteUnit(unit)}
                      title="Delete Unit"
                      className="p-2.5 rounded-xl border border-transparent hover:border-red-100 hover:bg-red-50 text-neutral-secondary hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
