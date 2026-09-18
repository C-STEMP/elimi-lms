"use client";

import React from "react";
import { FiArrowRight } from "react-icons/fi";

export interface RoleOptionCardProps {
  id: string;
  title: string;
  description: string;
  isSelected?: boolean;
  disabled?: boolean;
  badge?: string;
  onSelect: (id: string) => void;
}

export const RoleOptionCard: React.FC<RoleOptionCardProps> = ({
  id,
  title,
  description,
  isSelected = false,
  disabled = false,
  badge,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(id)}
      disabled={disabled}
      className={`group relative w-full overflow-hidden rounded-2xl border-2 p-6 sm:p-7 flex items-center justify-between gap-4 text-left select-none transition-all duration-300 ease-out ${
        disabled
          ? "border-transparent bg-input-bg/60 cursor-not-allowed opacity-60"
          : "cursor-pointer active:scale-[0.995]"
      } ${
        isSelected
          ? "border-primary-solid bg-primary-solid/5"
          : disabled
            ? ""
            : "border-transparent bg-input-bg hover:border-primary-solid/25"
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-6 w-24 h-24 rounded-full bg-white/70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 right-14 w-16 h-16 rounded-full bg-white/50"
      />

      {badge && (
        <span className="absolute top-3.5 right-4 z-20 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
          {badge}
        </span>
      )}

      <span className="relative z-10 flex flex-col gap-0.5">
        <span className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-primary">
          {title}
        </span>
        <span className="text-xs sm:text-sm font-normal text-neutral-secondary">
          {description}
        </span>
      </span>

      <span
        className={`relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
          isSelected
            ? "bg-primary-solid text-white"
            : disabled
              ? "bg-white/70 text-neutral-primary"
              : "bg-white text-neutral-primary group-hover:bg-primary-solid group-hover:text-white"
        }`}
      >
        <FiArrowRight className="w-5 h-5" />
      </span>
    </button>
  );
};
