"use client";

import React from "react";
import {
  FiLayers,
  FiBookOpen,
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
} from "react-icons/fi";
import type { Trade } from "@/features/cap/types";

export interface TradeCardProps {
  trade: Trade;
  onSelectTrade: (tradeId: string) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({ trade, onSelectTrade }) => {
  const levelCount = trade.levelCount ?? 3;
  const unitCount = trade.unitCount ?? 0;
  const sectorName = trade.sector?.name || "General Vocational";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-gray-200/80 transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Accent Strip on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-solid to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Section */}
      <div>
        {/* Header: Sector Badge & Status */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#75152b]/10 text-primary-solid border border-[#75152b]/20 font-bold text-xs tracking-wide">
            <FiBriefcase className="w-3.5 h-3.5" />
            <span>{sectorName}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {trade.status === "active" ? "Active Trade" : trade.status || "Active"}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectTrade(trade.id)}
          className="font-bold text-lg text-neutral-primary group-hover:text-primary-solid transition-colors line-clamp-1 cursor-pointer"
          title={trade.name}
        >
          {trade.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-neutral-secondary line-clamp-2 mt-2 leading-relaxed">
          {trade.description || "National Occupational Standards (NOS) accredited trade."}
        </p>

        {/* Stat Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-neutral-primary">
            <FiLayers className="w-3.5 h-3.5 text-primary-solid" />
            <span>{levelCount} {levelCount === 1 ? "Level" : "Levels"}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f9a825]/10 border border-[#f9a825]/30 text-xs font-semibold text-[#a86500]">
            <FiBookOpen className="w-3.5 h-3.5 text-secondary" />
            <span>{unitCount} {unitCount === 1 ? "Course Unit" : "Course Units"}</span>
          </span>

          {unitCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-xs font-semibold text-emerald-700">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>NOS Synced</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Action Button */}
      <div className="pt-4 mt-5 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onSelectTrade(trade.id)}
          className="w-full py-2.5 px-4 rounded-xl bg-primary-solid hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Levels & Course Units</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
