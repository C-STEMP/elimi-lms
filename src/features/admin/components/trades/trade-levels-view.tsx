"use client";

import React from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLayers,
  FiBookOpen,
  FiArrowRight,
  FiCheckCircle,
  FiBriefcase,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import type { Trade, LevelItem } from "@/features/cap/types";

export interface TradeLevelsViewProps {
  trade: Trade;
  levels: LevelItem[];
  onBackToTrades: () => void;
  onManageUnits: (levelNumber: number) => void;
  onAddLevel: () => void;
  onEditLevel: (level: LevelItem) => void;
  onDeleteLevel: (level: LevelItem) => void;
}

const LEVEL_SUBTITLES: Record<number, string> = {
  1: "Foundation Craft Practice & Core Principles",
  2: "Intermediate Technical Skills & Applications",
  3: "Advanced Craft Practice & Supervisory Competencies",
  4: "Higher Technical Specialization",
};

export const TradeLevelsView: React.FC<TradeLevelsViewProps> = ({
  trade,
  levels,
  onBackToTrades,
  onManageUnits,
  onAddLevel,
  onEditLevel,
  onDeleteLevel,
}) => {
  const totalUnitsAllLevels = levels.reduce((acc, l) => acc + (l.totalUnits || 0), 0);
  const totalPublishedAllLevels = levels.reduce(
    (acc, l) => acc + (l.publishedUnits || 0),
    0
  );
  const totalReadinessPercent =
    totalUnitsAllLevels > 0
      ? Math.round((totalPublishedAllLevels / totalUnitsAllLevels) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={onBackToTrades}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-secondary hover:text-primary-solid transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Trades</span>
        </button>
      </div>

      {/* Trade Overview Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-2xs flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-solid/10 text-primary-solid flex items-center justify-center shrink-0">
              <FiBriefcase className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-solid/10 text-primary-solid">
                  {trade.sector?.name || "Vocational Trade"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-neutral-secondary font-medium">
                  <FiAward className="w-3.5 h-3.5 text-secondary" />
                  <span>National Occupational Standards (NOS)</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-primary tracking-tight">
                {trade.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-secondary mt-1 max-w-2xl leading-relaxed">
                {trade.description ||
                  "National Occupational Standards curriculum tracks. Manage qualification levels and competency course units."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={onAddLevel}
              className="w-full sm:w-auto bg-primary-solid hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Qualification Level</span>
            </button>
          </div>
        </div>

        {/* Quick Curriculum Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-gray-100">
          <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-100">
            <span className="text-[11px] font-semibold text-neutral-secondary uppercase tracking-wider block">
              Qualification Levels
            </span>
            <span className="text-xl font-extrabold text-neutral-primary mt-0.5 block">
              {levels.length}
            </span>
            <span className="text-[11px] text-neutral-secondary">
              NSQ progressive tiers
            </span>
          </div>

          <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-100">
            <span className="text-[11px] font-semibold text-neutral-secondary uppercase tracking-wider block">
              Competency Units
            </span>
            <span className="text-xl font-extrabold text-neutral-primary mt-0.5 block">
              {totalUnitsAllLevels}
            </span>
            <span className="text-[11px] text-neutral-secondary">
              Total trade standards
            </span>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Live in Catalogue
            </span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">
              {totalPublishedAllLevels}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">
              Active learner courses
            </span>
          </div>

          <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-neutral-secondary uppercase tracking-wider">
                  Readiness Rate
                </span>
                <span className="text-primary-solid font-extrabold">
                  {totalReadinessPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200/80 rounded-full h-2 mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalReadinessPercent}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-neutral-secondary mt-1">
              {totalPublishedAllLevels} of {totalUnitsAllLevels} units published
            </span>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-primary tracking-tight">
            Qualification Levels ({levels.length})
          </h2>
          <p className="text-xs text-neutral-secondary mt-0.5">
            Click on a level to view its competency course units and manage publishing.
          </p>
        </div>
      </div>

      {/* Levels Cards List */}
      <div className="flex flex-col gap-3.5">
        {levels.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-neutral-secondary mb-1">
              <FiLayers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-primary">
              No qualification levels configured yet
            </h3>
            <p className="text-xs text-neutral-secondary max-w-sm">
              Add NSQ Level 1 or higher to configure competency units and course tracks for this trade.
            </p>
            <button
              type="button"
              onClick={onAddLevel}
              className="mt-2 bg-primary-solid hover:bg-primary-hover text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Qualification Level</span>
            </button>
          </div>
        ) : (
          levels.map((lvl) => {
            const hasPublished = lvl.publishedUnits > 0;
            const isFullyPublished =
              lvl.totalUnits > 0 && lvl.publishedUnits === lvl.totalUnits;
            const levelPercent =
              lvl.totalUnits > 0
                ? Math.round((lvl.publishedUnits / lvl.totalUnits) * 100)
                : 0;

            const subtitle =
              LEVEL_SUBTITLES[lvl.level] || "National Qualification Standard";

            return (
              <div
                key={lvl.id || lvl.level}
                className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-gray-200 transition-all p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-13 h-13 rounded-2xl bg-secondary/15 text-secondary-hover flex items-center justify-center font-bold text-base shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    L{lvl.level}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-neutral-primary">
                        NSQ Level {lvl.level}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isFullyPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : hasPublished
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isFullyPublished
                              ? "bg-emerald-500"
                              : hasPublished
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {isFullyPublished
                          ? "Fully Published"
                          : hasPublished
                          ? `${lvl.publishedUnits} Live, ${lvl.totalUnits - lvl.publishedUnits} Drafts`
                          : "Draft Mode"}
                      </span>
                    </div>

                    <h3
                      onClick={() => onManageUnits(lvl.level)}
                      className="font-extrabold text-base sm:text-lg text-neutral-primary group-hover:text-primary-solid transition-colors cursor-pointer truncate"
                    >
                      {lvl.title}
                    </h3>
                    <p className="text-xs text-neutral-secondary mt-0.5 truncate">
                      {subtitle}
                    </p>

                    {/* Progress & Units stats */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-neutral-secondary">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <FiBookOpen className="w-3.5 h-3.5 text-secondary" />
                        <span>{lvl.totalUnits} Units Total</span>
                      </span>

                      <span>•</span>

                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {lvl.publishedUnits} Active in LMS ({levelPercent}%)
                        </span>
                      </span>

                      {/* Mini progress bar */}
                      <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${levelPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-neutral-secondary">
                          {levelPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => onManageUnits(lvl.level)}
                    className="flex-1 md:flex-initial bg-primary-solid hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-xs py-2.5 px-4.5 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Manage Units & Courses</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditLevel(lvl)}
                      title="Edit Level Details"
                      className="p-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-neutral-secondary hover:text-neutral-primary transition-colors cursor-pointer"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteLevel(lvl)}
                      title="Delete Level"
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
