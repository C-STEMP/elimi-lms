"use client";

import React from "react";
import Link from "next/link";

const LearningIllustration: React.FC = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="70" cy="118" rx="46" ry="8" fill="#75152b" fillOpacity="0.08" />
    <rect x="28" y="86" width="84" height="16" rx="4" fill="#aa1d3f" />
    <rect x="34" y="70" width="72" height="16" rx="4" fill="#f9a825" />
    <rect x="30" y="54" width="80" height="16" rx="4" fill="#75152b" />
    <g>
      <path d="M70 20L118 40L70 60L22 40L70 20Z" fill="#241014" />
      <path d="M70 20L118 40L70 60L22 40L70 20Z" fill="#aa1d3f" fillOpacity="0.15" />
      <path d="M40 46V64C40 64 52 74 70 74C88 74 100 64 100 64V46L70 58L40 46Z" fill="#f9a825" />
      <circle cx="118" cy="40" r="3.5" fill="#241014" />
      <path d="M118 40V58" stroke="#241014" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

export const LearningPromoCard: React.FC = () => {
  return (
    <div className="bg-[#FEEED3] rounded-[22px] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-[#fae7c9] h-full">
      <div className="flex-1 flex flex-col justify-between h-full items-start text-center sm:text-left">
        <div>
          <h2 className="text-xl lg:text-[26px] font-bold text-black mb-2 tracking-tight leading-snug">
            Missing a skill or need a refresher?
          </h2>
          <p className="text-[#191918] text-xs lg:text-sm leading-relaxed max-w-xs mb-5">
            Browse courses that help you build real, verified skills — free and paid, all in one
            place.
          </p>
        </div>
        <Link
          href="/courses"
          className="bg-secondary hover:bg-secondary-hover text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer active:scale-95 self-center sm:self-start"
        >
          Start Learning
        </Link>
      </div>

      <div className="relative w-28 h-28 lg:w-36 lg:h-36 shrink-0 flex items-center justify-center self-center">
        <LearningIllustration />
      </div>
    </div>
  );
};
