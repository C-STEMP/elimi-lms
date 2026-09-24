"use client";

import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiGrid,
  FiAlertCircle,
  FiBriefcase,
} from "react-icons/fi";
import { TradesSlotCard } from "./trades-slot-card";
import type { TradeSlot, Trade } from "@/features/cap/types";

export interface ManageTradesViewProps {
  slots: TradeSlot[];
  capTrades: Trade[];
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  onSelectLevels: (slotNumber: number) => void;
  onEdit: (slot: TradeSlot) => void;
  onUnassign: (slot: TradeSlot) => void;
  onAssign: (slotNumber: number) => void;
}

type FilterTab = "all" | "assigned" | "empty";

export const ManageTradesView: React.FC<ManageTradesViewProps> = ({
  slots,
  capTrades,
  isLoading,
  isError,
  onRefresh,
  onSelectLevels,
  onEdit,
  onUnassign,
  onAssign,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const assignedCount = useMemo(
    () => slots.filter((s) => s.status === "available" && Boolean(s.tradeId)).length,
    [slots]
  );
  const emptyCount = slots.length - assignedCount;

  // Filter slots
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      // Tab filter
      if (activeTab === "assigned" && (slot.status !== "available" || !slot.tradeId)) {
        return false;
      }
      if (activeTab === "empty" && slot.status === "available" && Boolean(slot.tradeId)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (slot.name || "").toLowerCase().includes(q);
        const matchesDesc = (slot.description || "").toLowerCase().includes(q);
        const matchesSlot = `slot ${slot.slotNumber}`.includes(q);
        return matchesName || matchesDesc || matchesSlot;
      }

      return true;
    });
  }, [slots, activeTab, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-primary tracking-tight">
            Trades & Catalogues
          </h1>
          <p className="text-xs sm:text-sm text-neutral-secondary mt-1">
            Configure the 12 fixed catalogue slots linked directly to CAP trades, NOS levels, and course units.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="border border-gray-200 bg-white hover:bg-gray-50 text-neutral-primary font-medium text-xs py-2 px-3.5 rounded-xl flex items-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
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
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-solid shrink-0">
            <FiBriefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-secondary font-medium">CAP Trades Synced</p>
            <p className="text-xl font-bold text-neutral-primary">{capTrades.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-secondary font-medium">Assigned Slots</p>
            <p className="text-xl font-bold text-neutral-primary">
              {assignedCount} <span className="text-xs font-normal text-neutral-secondary">/ 12</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-hover shrink-0">
            <FiGrid className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-secondary font-medium">Available Empty Slots</p>
            <p className="text-xl font-bold text-neutral-primary">{emptyCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-input-bg rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-primary-solid shadow-2xs"
                : "text-neutral-secondary hover:text-neutral-primary"
            }`}
          >
            All Slots (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("assigned")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "assigned"
                ? "bg-white text-primary-solid shadow-2xs"
                : "text-neutral-secondary hover:text-neutral-primary"
            }`}
          >
            Assigned ({assignedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("empty")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "empty"
                ? "bg-white text-primary-solid shadow-2xs"
                : "text-neutral-secondary hover:text-neutral-primary"
            }`}
          >
            Empty ({emptyCount})
          </button>
        </div>

        {/* Direct Search Input */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search slots or trades..."
            className="w-full bg-input-bg border border-transparent focus:border-secondary focus:bg-white rounded-xl pl-9.5 pr-4 py-2 text-xs text-neutral-primary outline-none transition-colors"
          />
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-red-700 text-xs sm:text-sm">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <span>Unable to connect to CAP API. Please check backend connection.</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[200px] flex flex-col justify-between animate-pulse"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2" />
                <div className="h-4 w-full bg-gray-100 rounded-md mb-1.5" />
                <div className="h-4 w-2/3 bg-gray-100 rounded-md" />
              </div>
              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <div className="h-9 flex-1 bg-gray-200 rounded-xl" />
                <div className="h-9 w-16 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2-Column Responsive Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {filteredSlots.map((slot) => (
            <TradesSlotCard
              key={slot.slotNumber}
              slot={slot}
              onSelectLevels={onSelectLevels}
              onEdit={onEdit}
              onUnassign={onUnassign}
              onAssign={onAssign}
            />
          ))}
        </div>
      )}
    </div>
  );
};
