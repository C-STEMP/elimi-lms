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

export const TradeLevelsView: React.FC<TradeLevelsViewProps> = ({
  trade,
  levels,
  onBackToTrades,
  onManageUnits,
  onAddLevel,
  onEditLevel,
  onDeleteLevel,
}) => {
  return (
    <div className="flex flex-col gap-6">
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

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-solid/10 text-primary-solid flex items-center justify-center shrink-0">
            <FiBriefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-solid/10 text-primary-solid">
                {trade.sector?.name || "Vocational Trade"}
              </span>
              <span className="text-xs text-neutral-secondary font-medium">
                National Occupational Standards (NOS)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-primary tracking-tight">
              {trade.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-secondary mt-1 max-w-2xl leading-relaxed">
              {trade.description || "Configure qualification levels and competency course units."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={onAddLevel}
            className="w-full sm:w-auto bg-primary-solid hover:bg-primary-hover text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Qualification Level</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h2 className="text-base sm:text-lg font-bold text-neutral-primary tracking-tight">
          Qualification Levels ({levels.length})
        </h2>
        <span className="text-xs font-medium text-neutral-secondary">
          Click on a level to view its competency course units
        </span>
      </div>

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
            const isPublished = lvl.status === "published";

            return (
              <div
                key={lvl.id || lvl.level}
                className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-gray-200 transition-all p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary-hover flex items-center justify-center font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                    L{lvl.level}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-neutral-primary">
                        NSQ Level {lvl.level}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    <h3
                      onClick={() => onManageUnits(lvl.level)}
                      className="font-bold text-base text-neutral-primary group-hover:text-primary-solid transition-colors cursor-pointer"
                    >
                      {lvl.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-secondary">
                      <span className="inline-flex items-center gap-1">
                        <FiBookOpen className="w-3.5 h-3.5 text-secondary" />
                        <span>{lvl.totalUnits} Units</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        <span>{lvl.publishedUnits} Active in LMS</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => onManageUnits(lvl.level)}
                    className="flex-1 sm:flex-initial bg-primary-solid hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
