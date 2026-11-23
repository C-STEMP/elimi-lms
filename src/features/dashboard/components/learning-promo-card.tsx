"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiAward } from "react-icons/fi";

const LearningIllustration: React.FC = () => (
  <svg width="148" height="148" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="70" cy="118" rx="46" ry="8" fill="#75152b" fillOpacity="0.1" />
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
    <div className="relative overflow-hidden bg-linear-to-br from-[#FFF5E2] via-[#FEEED3] to-[#FCE0B0] rounded-[22px] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border border-[#f3d9ad] h-full">
      {/* Subtle decorative rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 w-52 h-52 rounded-full bg-white/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-24 -bottom-16 w-40 h-40 rounded-full bg-[#f9a825]/15"
      />

      <div className="relative z-10 flex-1 flex flex-col justify-between h-full items-center sm:items-start text-center sm:text-left gap-4">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-[#e9cb94] text-[10px] font-extrabold uppercase tracking-wider text-primary-solid">
            <FiAward className="w-3 h-3" />
            <span>Certified Trade Pathways</span>
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-neutral-primary tracking-tight leading-snug">
            Missing a skill or need a refresher?
          </h2>
          <p className="text-neutral-primary/75 text-xs sm:text-sm leading-relaxed max-w-md">
            Explore structured trade courses organized by level and unit — learn step by step and earn verified certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <Link
            href="/courses"
            className="bg-primary-solid hover:bg-primary-hover text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <span>Browse by Trade</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/certificates"
            className="bg-white/80 hover:bg-white text-neutral-primary border border-[#e7c994] font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            My Certificates
          </Link>
        </div>
      </div>

      <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 shrink-0 flex items-center justify-center">
        <LearningIllustration />
      </div>
    </div>
  );
};
