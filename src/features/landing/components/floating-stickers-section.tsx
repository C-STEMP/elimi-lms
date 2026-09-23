"use client";

import React from "react";
import Link from "next/link";
import { FiEdit3, FiSliders, FiCompass, FiShield } from "react-icons/fi";

const FEATURES_GRID = [
  {
    icon: FiEdit3,
    title: "Feedback loops that matter",
    description:
      "Interactive knowledge checks after every module give immediate answers and reinforce safety standards.",
    isActive: false,
  },
  {
    icon: FiSliders,
    title: "Learn at your own pace",
    description:
      "Mobile-friendly, bite-sized lessons allow artisans to learn between jobs and study on their own schedule.",
    isActive: true,
  },
  {
    icon: FiCompass,
    title: "Clear learning paths",
    description:
      "Structured NSQ Level 1, 2, and 3 curriculums provide a roadmap from apprentice to master tradesperson.",
    isActive: false,
  },
  {
    icon: FiShield,
    title: "Direct Bridge to CAP",
    description:
      "Seamlessly connects your theoretical coursework directly to physical competency testing at CAP labs.",
    isActive: false,
  },
];

export const FloatingStickersSection: React.FC = () => {
  return (
    <section id="features" className="w-full pt-16 sm:pt-24 pb-12 sm:pb-20 bg-white select-none overflow-hidden">
      {/* GRAND ARCHITECTURAL DOME ARCH CONTAINER */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-t-[340px] sm:rounded-t-[540px] md:rounded-t-[680px] border-t border-x border-neutral-200/90 bg-[#fafafa]/70 overflow-hidden pt-20 sm:pt-28 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-8">
          {/* Subtle Dot Matrix Background at the bottom fading upwards */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d1d5db_1.7px,transparent_1.7px)] [background-size:24px_24px] opacity-75"
            style={{
              maskImage: "linear-gradient(to top, black 35%, transparent 85%)",
              WebkitMaskImage: "linear-gradient(to top, black 35%, transparent 85%)",
            }}
          />

          {/* PLAYGROUND WITH 7 FLOATING STICKERS & CENTERED HEADLINE */}
          <div className="relative max-w-3xl mx-auto py-12 sm:py-16 text-center">
            {/* 1. TOP LEFT PILL: Calm (Vivid Blue) */}
            <div className="absolute -top-3 sm:-top-5 left-2 sm:left-10 rounded-full bg-[#1d61f2] text-white px-5 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-base font-bold shadow-md transform -rotate-6 select-none z-10">
              Calm
            </div>

            {/* 2. TOP CENTER PILL: Real progress (White) */}
            <div className="absolute -top-5 sm:-top-7 left-[36%] sm:left-[39%] rounded-full bg-white border border-neutral-200/90 text-neutral-800 px-3.5 sm:px-4 py-1 text-[11px] sm:text-xs font-semibold shadow-xs select-none z-10">
              Real progress
            </div>

            {/* 3. TOP RIGHT PILL: Motivated (Bright Yellow) */}
            <div className="absolute -top-3 sm:-top-4 right-2 sm:right-10 rounded-full bg-[#f59e0b] text-white px-5 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-base font-bold shadow-md transform rotate-6 select-none z-10">
              Motivated
            </div>

            {/* 4. MID LEFT STICKER: Circular Checkmark Badge (Emerald Green) */}
            <div className="absolute top-[46%] left-0 sm:left-6 -translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-[#0ea569] text-white flex items-center justify-center shadow-lg transform -rotate-12 select-none z-10">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-none stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* 5. MID RIGHT STICKER: Circular Lightbulb Badge (Vivid Blue with Radiating Beams) */}
            <div className="absolute top-[56%] right-0 sm:right-6 -translate-y-1/2 h-13 w-13 sm:h-16 sm:w-16 rounded-full bg-[#1d61f2] text-white flex items-center justify-center shadow-lg transform rotate-6 select-none z-10">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-none stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round"
              >
                <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
                <line x1="12" y1="2" x2="12" y2="4" strokeWidth="2.5" />
                <line x1="12" y1="20" x2="12" y2="22" strokeWidth="2.5" />
                <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" strokeWidth="2.5" />
                <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" strokeWidth="2.5" />
                <line x1="2" y1="12" x2="4" y2="12" strokeWidth="2.5" />
                <line x1="20" y1="12" x2="22" y2="12" strokeWidth="2.5" />
                <line x1="6.34" y1="17.66" x2="4.93" y2="19.07" strokeWidth="2.5" />
                <line x1="19.07" y1="4.93" x2="17.66" y2="6.34" strokeWidth="2.5" />
              </svg>
            </div>

            {/* 6. BOTTOM LEFT PILL: Growth oriented (White) */}
            <div className="absolute -bottom-4 sm:-bottom-6 left-4 sm:left-14 rounded-full bg-white border border-neutral-200/90 text-neutral-800 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold shadow-sm transform -rotate-3 select-none z-10">
              Growth oriented
            </div>

            {/* 7. BOTTOM RIGHT PILL: Focused sessions (Green) */}
            <div className="absolute -bottom-5 sm:-bottom-7 right-6 sm:right-20 rounded-full bg-[#0ea569] text-white px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-bold shadow-md select-none z-10">
              Focused sessions
            </div>

            {/* CENTER HEADLINE EXACTLY MATCHING THE REFERENCE */}
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black text-[#111827] tracking-tight leading-[1.08] text-center px-4">
              From focused sessions <br />
              to practical skills, we <br />
              helps you learn with <br />
              clarity and confidence.
            </h2>
          </div>

          {/* 4 FEATURE COLUMNS GRID */}
          <div className="mt-16 sm:mt-24 text-center max-w-5xl mx-auto relative z-10">
            <p className="text-xs sm:text-sm font-medium text-neutral-500 mb-8">
              Features built to support and keep you on track with daily trade learning
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {FEATURES_GRID.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-6 border transition-all ${
                      feat.isActive
                        ? "bg-white border-primary-solid shadow-lg ring-1 ring-primary-solid/30"
                        : "bg-white/95 backdrop-blur-xs border-neutral-200/80 shadow-xs hover:border-neutral-300"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl mb-4 ${
                        feat.isActive
                          ? "bg-primary-solid text-white"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#111827]">{feat.title}</h3>
                    <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/register"
                className="rounded-full bg-primary-solid hover:bg-primary-hover text-white px-8 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
