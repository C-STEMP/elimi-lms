"use client";

import React from "react";

const MARQUEE_ITEM = "New learners get full access for free • Start learning today";

export const TopMarquee: React.FC = () => {
  return (
    <div className="w-full h-9 bg-primary-solid text-white overflow-hidden select-none border-b border-white/10 z-40 relative flex items-center shrink-0">
      <div className="flex w-max animate-marquee items-center gap-8 text-[11px] sm:text-xs font-semibold tracking-wide">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 shrink-0">
            <span>{MARQUEE_ITEM}</span>
            <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">
              ✦
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
