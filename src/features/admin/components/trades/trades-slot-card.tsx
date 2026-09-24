"use client";

import React from "react";
import {
  FiLayers,
  FiBookOpen,
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiArrowRight,
  FiCheckCircle,
  FiBriefcase,
} from "react-icons/fi";
import type { TradeSlot } from "@/features/cap/types";

export interface TradesSlotCardProps {
  slot: TradeSlot;
  onSelectLevels: (slotNumber: number) => void;
  onEdit: (slot: TradeSlot) => void;
  onUnassign: (slot: TradeSlot) => void;
  onAssign: (slotNumber: number) => void;
}

export const TradesSlotCard: React.FC<TradesSlotCardProps> = ({
  slot,
  onSelectLevels,
  onEdit,
  onUnassign,
  onAssign,
}) => {
  const formattedSlotNum = String(slot.slotNumber).padStart(2, "0");

  if (slot.status === "empty" || !slot.tradeId) {
    return (
      <div className="border-2 border-dashed border-gray-200/90 hover:border-primary-solid/40 bg-white hover:bg-[#fafafc] rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between items-center text-center group min-h-[220px]">
        {/* Top Slot Pill */}
        <div className="w-full flex justify-between items-center">
          <span className="px-3 py-1 rounded-full bg-gray-100 text-neutral-secondary font-bold text-xs tracking-wider">
            Slot {formattedSlotNum}
          </span>
          <span className="text-[11px] font-semibold text-neutral-secondary/80 uppercase tracking-wider">
            Unassigned
          </span>
        </div>

        {/* Center Icon & Info */}
        <div className="flex flex-col items-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-[#75152b]/5 group-hover:bg-primary-solid text-primary-solid group-hover:text-white transition-all flex items-center justify-center mb-3 shadow-2xs">
            <FiPlus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
          </div>
          <h3 className="font-bold text-sm text-neutral-primary">
            Available Catalogue Slot
          </h3>
          <p className="text-xs text-neutral-secondary mt-1 max-w-[240px] leading-relaxed">
            Assign an accredited trade from CAP to configure its qualification levels and units.
          </p>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => onAssign(slot.slotNumber)}
          className="w-full max-w-[260px] py-2.5 px-4 rounded-xl bg-white border border-gray-200 hover:border-primary-solid group-hover:border-primary-solid hover:bg-primary-solid hover:text-white text-neutral-primary font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FiPlus className="w-3.5 h-3.5 text-primary-solid group-hover:text-white" />
          <span>Assign Trade to Slot {slot.slotNumber}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-gray-200/80 transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Accent Strip on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-solid to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Card Content Top */}
      <div>
        {/* Header: Slot Badge & Status */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#75152b]/10 text-primary-solid border border-[#75152b]/20 font-bold text-xs tracking-wider">
            <FiBriefcase className="w-3 h-3" />
            Slot {formattedSlotNum}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectLevels(slot.slotNumber)}
          className="font-bold text-base sm:text-lg text-neutral-primary group-hover:text-primary-solid transition-colors line-clamp-1 cursor-pointer"
          title={slot.name}
        >
          {slot.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-neutral-secondary line-clamp-2 mt-1.5 leading-relaxed">
          {slot.description || "National Occupational Standards trade track."}
        </p>

        {/* Stats Pill Row */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-neutral-primary">
            <FiLayers className="w-3.5 h-3.5 text-primary-solid" />
            <span>Manage Qualification Levels</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f9a825]/10 border border-[#f9a825]/30 text-xs font-semibold text-[#a86500]">
            <FiBookOpen className="w-3.5 h-3.5 text-secondary" />
            <span>Course Units</span>
          </span>
        </div>
      </div>

      {/* Card Footer: Action Buttons */}
      <div className="flex items-center justify-between gap-2.5 pt-4 mt-5 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onSelectLevels(slot.slotNumber)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-primary-solid hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Levels & Courses</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onEdit(slot)}
          title="Edit Slot Metadata"
          className="py-2.5 px-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-neutral-primary font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FiEdit3 className="w-3.5 h-3.5 text-neutral-secondary" />
          <span className="hidden sm:inline">Edit</span>
        </button>

        <button
          type="button"
          onClick={() => onUnassign(slot)}
          title="Unassign Trade from Slot"
          className="p-2.5 rounded-xl text-neutral-secondary hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors flex items-center justify-center cursor-pointer"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
