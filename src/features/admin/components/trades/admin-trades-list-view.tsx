"use client";

import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiBriefcase,
  FiLayers,
  FiBookOpen,
  FiAlertCircle,
} from "react-icons/fi";
import { TradeCard } from "./trade-card";
import type { Trade } from "@/features/cap/types";

export interface AdminTradesListViewProps {
  trades: Trade[];
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  onSelectTrade: (tradeId: string) => void;
}

export const AdminTradesListView: React.FC<AdminTradesListViewProps> = ({
  trades,
  isLoading,
  isError,
  onRefresh,
  onSelectTrade,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Unique sectors from trades
  const sectors = useMemo(() => {
    const map = new Map<string, string>();
    trades.forEach((t) => {
      if (t.sector?.name) {
        map.set(t.sector.name, t.sector.name);
      }
    });
    return Array.from(map.values());
  }, [trades]);

  // Aggregate stats
  const totalLevels = useMemo(
    () => trades.reduce((acc, t) => acc + (t.levelCount || 3), 0),
    [trades]
  );
  const totalUnits = useMemo(
    () => trades.reduce((acc, t) => acc + (t.unitCount || 0), 0),
    [trades]
  );

  // Filtered trades
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      // Sector filter
      if (selectedSector !== "all" && trade.sector?.name !== selectedSector) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (trade.name || "").toLowerCase().includes(q);
        const matchesDesc = (trade.description || "").toLowerCase().includes(q);
        const matchesSector = (trade.sector?.name || "").toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesSector;
      }

      return true;
    });
  }, [trades, selectedSector, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-primary tracking-tight">
            Trades & Qualifications
          </h1>
          <p className="text-xs sm:text-sm text-neutral-secondary mt-1">
            Browse accredited National Occupational Standards (NOS) trades. Select a trade to manage its qualification levels and course units.
          </p>
        </div>

        {/* Refresh Action */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="border border-gray-200 bg-white hover:bg-gray-50 text-neutral-primary font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 text-neutral-secondary ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span>Refresh Backend</span>
          </button>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary-solid shrink-0">
            <FiBriefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-secondary font-medium">Accredited Trades</p>
            <p className="text-xl font-bold text-neutral-primary">{trades.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-hover shrink-0">
            <FiLayers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-secondary font-medium">Qualification Levels</p>
            <p className="text-xl font-bold text-neutral-primary">{totalLevels}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
            <FiBookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-secondary font-medium">Total Competency Units</p>
            <p className="text-xl font-bold text-neutral-primary">{totalUnits}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Sector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto [scrollbar-width:none]">
          <button
            type="button"
            onClick={() => setSelectedSector("all")}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedSector === "all"
                ? "bg-primary-solid text-white shadow-2xs"
                : "bg-input-bg text-neutral-secondary hover:text-neutral-primary"
            }`}
          >
            All Trades ({trades.length})
          </button>

          {sectors.map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => setSelectedSector(sector)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedSector === sector
                  ? "bg-primary-solid text-white shadow-2xs"
                  : "bg-input-bg text-neutral-secondary hover:text-neutral-primary"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trades by name or sector..."
            className="w-full bg-input-bg border border-transparent focus:border-secondary focus:bg-white rounded-xl pl-9.5 pr-4 py-2 text-xs text-neutral-primary outline-none transition-colors"
          />
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-red-700 text-xs sm:text-sm">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <span>Unable to load trades from CAP backend. Please check connection.</span>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs font-semibold text-red-800 underline hover:text-red-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[220px] flex flex-col justify-between animate-pulse"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="h-5 w-24 bg-gray-200 rounded-full" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2" />
                <div className="h-4 w-full bg-gray-100 rounded-md mb-1.5" />
                <div className="h-4 w-2/3 bg-gray-100 rounded-md" />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="h-9 w-full bg-gray-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trades Grid */}
      {!isLoading && (
        <>
          {filteredTrades.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-neutral-secondary mb-1">
                <FiBriefcase className="w-6 h-6" />
              </div>
              <p className="text-base font-bold text-neutral-primary">
                No trades match your search
              </p>
              <p className="text-xs text-neutral-secondary max-w-sm">
                Try searching for another keyword or select &ldquo;All Trades&rdquo; to see all accredited programs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrades.map((trade) => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  onSelectTrade={onSelectTrade}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
