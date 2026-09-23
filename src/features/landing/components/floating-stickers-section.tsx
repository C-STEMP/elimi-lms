"use client";

import React from "react";
import Link from "next/link";

type FeatureCard = {
  id: string;
  title: string;
  description: string;
  isHighlighted?: boolean;
  icon: () => React.JSX.Element;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "practical-skills",
    title: "Practical skills that matter",
    description:
      "Learn skills you can actually use, taught by master craftspeople and certified industry practitioners.",
    isHighlighted: false,
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-neutral-400 fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
      >
        <path d="M18.375 2.625a3.875 3.875 0 0 0-5.48 0L3.5 12v4.5h4.5l9.395-9.395a3.875 3.875 0 0 0 0-5.48z" />
        <path d="M14 6l4 4" />
        <path d="M3.5 16.5c1.5 0 3 1.5 3 3s-1.5 3-3 3-3-1.5-3-3 1.5-3 3-3z" />
      </svg>
    ),
  },
  {
    id: "without-pressure",
    title: "Learn without pressure",
    description:
      "Move at your own pace with modular lessons designed to fit around real jobs and flexible schedules.",
    isHighlighted: true,
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-primary-solid fill-current"
      >
        <path
          d="M12 3c-1.5 3-2 6-2 9 1-1.5 2.5-2.5 4-2.5 1.5 0 3 1 4 2.5 0-3-.5-6-2-9-1 2-2.5 3-4 3s-3-1-4-3z"
          opacity="0.9"
        />
        <path
          d="M7 10c-2 1-3.5 3-4 6 2.5 0 4.5-1 6-3-.5-1-1.2-2-2-3z"
          opacity="0.6"
        />
        <path
          d="M17 10c-.8 1-1.5 2-2 3 1.5 2 3.5 3 6 3-.5-3-2-5-4-6z"
          opacity="0.6"
        />
        <circle cx="12" cy="18" r="1.5" />
      </svg>
    ),
  },
  {
    id: "clear-paths",
    title: "Clear learning paths",
    description:
      "Follow structured NSQ paths that guide you step by step, so you always know your next milestone.",
    isHighlighted: false,
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-neutral-400 fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
      >
        <path d="M12 2v20" />
        <path d="M18 5H6l-3 3 3 3h12l3-3-3-3z" />
        <path d="M6 13h12l3 3-3 3H6l-3-3 3-3z" />
      </svg>
    ),
  },
  {
    id: "real-progress",
    title: "Real progress that lasts",
    description:
      "Track your hands-on competencies, portfolio evidence, and benchmark your readiness for certification.",
    isHighlighted: false,
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-neutral-400 fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
      >
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M7 12l3-3 2 2 4-4" />
        <path d="M12 16v5M8 21l8-5" />
      </svg>
    ),
  },
  {
    id: "cap-bridge",
    title: "Direct Bridge to CAP",
    description:
      "Seamlessly connect your theoretical coursework directly to physical competency testing at accredited CAP labs.",
    isHighlighted: false,
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-neutral-400 fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    id: "feedback-loops",
    title: "Feedback loops that matter",
    description:
      "Interactive knowledge checks after every module give immediate answers and reinforce safety standards.",
    isHighlighted: false,
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-neutral-400 fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
      >
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
];

export const FloatingStickersSection: React.FC = () => {
  const marqueeCards = [...FEATURE_CARDS, ...FEATURE_CARDS];

  return (
    <section
      id="features"
      className="w-full pt-16 sm:pt-24 pb-16 sm:pb-24 bg-white select-none overflow-hidden"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="relative rounded-t-[340px] sm:rounded-t-[540px] md:rounded-t-[680px] border-t border-x border-neutral-200/90 bg-[#fafafa]/70 overflow-hidden pt-20 sm:pt-28 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d1d5db_1.7px,transparent_1.7px)] [background-size:24px_24px] opacity-75"
            style={{
              maskImage: "linear-gradient(to top, black 35%, transparent 85%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 35%, transparent 85%)",
            }}
          />

          <div className="relative max-w-3xl mx-auto py-12 sm:py-16 text-center">
            {/* Top Left Pill: Calm (Vivid Blue) */}
            <div className="absolute -top-3 sm:-top-5 left-2 sm:left-10 rounded-full bg-[#1d61f2] text-white px-5 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-base font-bold shadow-md transform -rotate-6 select-none z-10">
              Calm
            </div>

            {/* Top Center Pill: Real progress (White) */}
            <div className="absolute -top-5 sm:-top-7 left-[36%] sm:left-[39%] rounded-full bg-white border border-neutral-200/90 text-neutral-800 px-3.5 sm:px-4 py-1 text-[11px] sm:text-xs font-semibold shadow-xs select-none z-10">
              Real progress
            </div>

            {/* Top Right Pill: Motivated (Bright Yellow) */}
            <div className="absolute -top-3 sm:-top-4 right-2 sm:right-10 rounded-full bg-[#f59e0b] text-white px-5 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-base font-bold shadow-md transform rotate-6 select-none z-10">
              Motivated
            </div>

            {/* Mid Left Sticker: Circular Checkmark Badge (Emerald Green) */}
            <div className="absolute top-[46%] left-0 sm:left-6 -translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-[#0ea569] text-white flex items-center justify-center shadow-lg transform -rotate-12 select-none z-10">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-none stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Mid Right Sticker: Circular Lightbulb Badge (Vivid Blue) */}
            <div className="absolute top-[56%] right-0 sm:right-6 -translate-y-1/2 h-13 w-13 sm:h-16 sm:w-16 rounded-full bg-[#1d61f2] text-white flex items-center justify-center shadow-lg transform rotate-6 select-none z-10">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-none stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round"
              >
                <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
                <line x1="12" y1="2" x2="12" y2="4" strokeWidth="2.5" />
                <line x1="12" y1="20" x2="12" y2="22" strokeWidth="2.5" />
                <line
                  x1="4.93"
                  y1="4.93"
                  x2="6.34"
                  y2="6.34"
                  strokeWidth="2.5"
                />
                <line
                  x1="17.66"
                  y1="17.66"
                  x2="19.07"
                  y2="19.07"
                  strokeWidth="2.5"
                />
                <line x1="2" y1="12" x2="4" y2="12" strokeWidth="2.5" />
                <line x1="20" y1="12" x2="22" y2="12" strokeWidth="2.5" />
                <line
                  x1="6.34"
                  y1="17.66"
                  x2="4.93"
                  y2="19.07"
                  strokeWidth="2.5"
                />
                <line
                  x1="19.07"
                  y1="4.93"
                  x2="17.66"
                  y2="6.34"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Bottom Left Pill: Growth oriented (White) */}
            <div className="absolute -bottom-4 sm:-bottom-6 left-4 sm:left-14 rounded-full bg-white border border-neutral-200/90 text-neutral-800 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold shadow-sm transform -rotate-3 select-none z-10">
              Growth oriented
            </div>

            {/* Bottom Right Pill: Focused sessions (Green) */}
            <div className="absolute -bottom-5 sm:-bottom-7 right-6 sm:right-20 rounded-full bg-[#0ea569] text-white px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-bold shadow-md select-none z-10">
              Focused sessions
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black text-[#111827] tracking-tight leading-[1.08] text-center px-4">
              From focused sessions <br />
              to practical skills, we <br />
              helps you learn with <br />
              clarity and confidence.
            </h2>
          </div>
        </div>
      </div>

      {/* 2. FEATURE CARDS: INCREASED WIDTH & CONTINUOUS HORIZONTAL MARQUEE */}
      <div className="mt-16 sm:mt-24 w-full">
        {/* Subtitle matching reference */}
        <p className="text-sm sm:text-base font-normal text-neutral-500 mb-8 sm:mb-12 text-center max-w-xl mx-auto px-4">
          Elimi is built to support real learning with clarity and focus
        </p>

        {/* Marquee Row Container */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Subtle Side Fade Overlays */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Scrolling Cards Marquee */}
          <div className="flex w-max animate-marquee gap-5 sm:gap-6 hover:[animation-play-state:paused] transition-all">
            {marqueeCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={`${feat.id}-${idx}`}
                  className={`w-[320px] sm:w-[380px] md:w-[410px] h-[230px] sm:h-[250px] shrink-0 text-left rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 border bg-white flex flex-col justify-between transition-all select-none shadow-sm hover:shadow-md ${
                    feat.isHighlighted
                      ? "border-primary-solid/40 shadow-md ring-1 ring-primary-solid/20"
                      : "border-neutral-200/80 hover:border-neutral-300"
                  }`}
                >
                  {/* Icon */}
                  <div className="mb-4 sm:mb-5">
                    <Icon />
                  </div>

                  <div className="flex flex-col gap-1 sm:gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#111827] leading-snug">
                      {feat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed line-clamp-2">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Centered Learn More Action Button */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            href="/register"
            className="rounded-full bg-primary-solid hover:bg-primary-hover text-white px-9 py-3 text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};
