"use client";

import React from "react";

type StickerItem =
  | {
      type: "pill";
      text: string;
      bg: string;
    }
  | {
      type: "icon";
      bg: string;
      icon: "fork" | "matrix" | "nodes" | "check" | "bulb";
    };

const renderIcon = (icon: "fork" | "matrix" | "nodes" | "check" | "bulb") => {
  switch (icon) {
    case "fork":
      // 3-way split arrow / crossroads
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white fill-none stroke-current stroke-[2.7] stroke-linecap-round stroke-linejoin-round"
        >
          <line x1="12" y1="21" x2="12" y2="4" />
          <polyline points="8 7 12 3 16 7" />
          <path d="M12 14c0-3.5-4-4.5-6.5-6.5" />
          <polyline points="4 10 5.5 7.5 8.5 8.5" />
          <path d="M12 14c0-3.5 4-4.5 6.5-6.5" />
          <polyline points="15.5 8.5 18.5 7.5 20 10" />
        </svg>
      );
    case "matrix":
      // Dotted sphere / circle matrix
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white fill-current"
        >
          <circle cx="12" cy="12" r="2.2" />
          <circle cx="12" cy="7" r="1.8" />
          <circle cx="12" cy="17" r="1.8" />
          <circle cx="7" cy="12" r="1.8" />
          <circle cx="17" cy="12" r="1.8" />
          <circle cx="8" cy="8" r="1.4" />
          <circle cx="16" cy="8" r="1.4" />
          <circle cx="8" cy="16" r="1.4" />
          <circle cx="16" cy="16" r="1.4" />
          <circle cx="12" cy="3.5" r="1.1" />
          <circle cx="12" cy="20.5" r="1.1" />
          <circle cx="3.5" cy="12" r="1.1" />
          <circle cx="20.5" cy="12" r="1.1" />
        </svg>
      );
    case "nodes":
      // Network nodes cube
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round"
        >
          <circle cx="12" cy="12" r="2" fill="white" />
          <circle cx="6" cy="9" r="1.7" fill="white" />
          <circle cx="18" cy="9" r="1.7" fill="white" />
          <circle cx="6" cy="15" r="1.7" fill="white" />
          <circle cx="18" cy="15" r="1.7" fill="white" />
          <circle cx="12" cy="5" r="1.7" fill="white" />
          <circle cx="12" cy="19" r="1.7" fill="white" />
          <line x1="12" y1="5" x2="12" y2="10" strokeDasharray="1.5 1.5" />
          <line x1="12" y1="14" x2="12" y2="19" strokeDasharray="1.5 1.5" />
          <line x1="6" y1="9" x2="10" y2="11" strokeDasharray="1.5 1.5" />
          <line x1="14" y1="13" x2="18" y2="15" strokeDasharray="1.5 1.5" />
          <line x1="18" y1="9" x2="14" y2="11" strokeDasharray="1.5 1.5" />
          <line x1="10" y1="13" x2="6" y2="15" strokeDasharray="1.5 1.5" />
          <line x1="6" y1="9" x2="6" y2="15" />
          <line x1="18" y1="9" x2="18" y2="15" />
        </svg>
      );
    case "check":
      // Checkmark badge
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white fill-none stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "bulb":
    default:
      // Lightbulb icon
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
        >
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
        </svg>
      );
  }
};

const ROW_1: StickerItem[] = [
  { type: "pill", text: "Progress", bg: "bg-[#0ea569] text-white" },
  { type: "icon", bg: "bg-[#f59e0b]", icon: "fork" },
  { type: "pill", text: "Growth oriented", bg: "bg-white text-[#111827] border border-neutral-200/90 shadow-sm" },
  { type: "pill", text: "Curious", bg: "bg-[#1d61f2] text-white" },
  { type: "icon", bg: "bg-[#1d61f2]", icon: "matrix" },
  { type: "pill", text: "Practical skills", bg: "bg-[#f59e0b] text-white" },
  { type: "pill", text: "CAP Certified", bg: "bg-primary-solid text-white" },
  { type: "icon", bg: "bg-[#0ea569]", icon: "check" },
  { type: "pill", text: "Hands-on Mastery", bg: "bg-white text-[#111827] border border-neutral-200/90 shadow-sm" },
];

const ROW_2: StickerItem[] = [
  { type: "pill", text: "Clear focus", bg: "bg-white text-[#111827] border border-neutral-200/90 shadow-sm" },
  { type: "pill", text: "Calm", bg: "bg-[#1d61f2] text-white" },
  { type: "pill", text: "Motivated", bg: "bg-[#f59e0b] text-white" },
  { type: "icon", bg: "bg-[#1d61f2]", icon: "nodes" },
  { type: "pill", text: "Focused sessions", bg: "bg-[#0ea569] text-white" },
  { type: "pill", text: "Consistent", bg: "bg-[#1d61f2] text-white" },
  { type: "icon", bg: "bg-[#f59e0b]", icon: "fork" },
  { type: "pill", text: "Trade Excellence", bg: "bg-primary-solid text-white" },
  { type: "pill", text: "Self driven", bg: "bg-white text-[#111827] border border-neutral-200/90 shadow-sm" },
];

const ROW_3: StickerItem[] = [
  { type: "pill", text: "Expert led", bg: "bg-[#f59e0b] text-white" },
  { type: "icon", bg: "bg-[#0ea569]", icon: "check" },
  { type: "pill", text: "Self driven", bg: "bg-white text-[#111827] border border-neutral-200/90 shadow-sm" },
  { type: "pill", text: "Curious minds", bg: "bg-[#0ea569] text-white" },
  { type: "pill", text: "Real progress", bg: "bg-white text-[#111827] border border-neutral-200/90 shadow-sm" },
  { type: "icon", bg: "bg-[#1d61f2]", icon: "bulb" },
  { type: "pill", text: "Career ready", bg: "bg-white text-[#111827] border border-neutral-200/90 shadow-sm" },
  { type: "pill", text: "Inspiring", bg: "bg-[#1d61f2] text-white" },
  { type: "icon", bg: "bg-primary-solid", icon: "nodes" },
];

export const MarqueeTicker: React.FC = () => {
  // 2 sets of items for smooth continuous loop with translateX(-50%)
  const row1 = [...ROW_1, ...ROW_1];
  const row2 = [...ROW_2, ...ROW_2];
  const row3 = [...ROW_3, ...ROW_3];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-white overflow-hidden select-none relative">
      {/* Side Fade Gradient Masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

      <div className="flex flex-col gap-3.5 sm:gap-4 md:gap-5">
        {/* ROW 1: SCROLLING LEFT */}
        <div className="flex w-max animate-marquee gap-3 sm:gap-4 md:gap-5 hover:[animation-play-state:paused] transition-all">
          {row1.map((item, idx) => {
            if (item.type === "icon") {
              return (
                <div
                  key={`r1-${idx}`}
                  className={`h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.bg}`}
                >
                  {renderIcon(item.icon)}
                </div>
              );
            }
            return (
              <div
                key={`r1-${idx}`}
                className={`h-12 sm:h-16 md:h-20 px-6 sm:px-8 md:px-10 rounded-full flex items-center justify-center shrink-0 whitespace-nowrap text-base sm:text-xl md:text-[26px] font-extrabold tracking-tight ${item.bg}`}
              >
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* ROW 2: SCROLLING RIGHT */}
        <div className="flex w-max animate-marquee-reverse gap-3 sm:gap-4 md:gap-5 hover:[animation-play-state:paused] transition-all">
          {row2.map((item, idx) => {
            if (item.type === "icon") {
              return (
                <div
                  key={`r2-${idx}`}
                  className={`h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.bg}`}
                >
                  {renderIcon(item.icon)}
                </div>
              );
            }
            return (
              <div
                key={`r2-${idx}`}
                className={`h-12 sm:h-16 md:h-20 px-6 sm:px-8 md:px-10 rounded-full flex items-center justify-center shrink-0 whitespace-nowrap text-base sm:text-xl md:text-[26px] font-extrabold tracking-tight ${item.bg}`}
              >
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* ROW 3: SCROLLING LEFT */}
        <div className="flex w-max animate-marquee gap-3 sm:gap-4 md:gap-5 hover:[animation-play-state:paused] transition-all">
          {row3.map((item, idx) => {
            if (item.type === "icon") {
              return (
                <div
                  key={`r3-${idx}`}
                  className={`h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.bg}`}
                >
                  {renderIcon(item.icon)}
                </div>
              );
            }
            return (
              <div
                key={`r3-${idx}`}
                className={`h-12 sm:h-16 md:h-20 px-6 sm:px-8 md:px-10 rounded-full flex items-center justify-center shrink-0 whitespace-nowrap text-base sm:text-xl md:text-[26px] font-extrabold tracking-tight ${item.bg}`}
              >
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
