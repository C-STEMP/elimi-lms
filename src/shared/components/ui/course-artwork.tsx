"use client";

import React from "react";
import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiBox,
  FiCpu,
  FiDroplet,
  FiLayers,
  FiMessageSquare,
  FiShield,
  FiTool,
  FiZap,
} from "react-icons/fi";

export interface CourseVisualTheme {
  Icon: IconType;
  gradient: string;
  accentBg: string;
  iconBg: string;
  iconColor: string;
  borderAccent: string;
  badgeBg: string;
  badgeText: string;
}

const THEMES: Record<string, CourseVisualTheme> = {
  plumbing: {
    Icon: FiDroplet,
    gradient: "from-[#E0F2FE] via-[#ECFEFF] to-[#F0F9FF]",
    accentBg: "bg-sky-500",
    iconBg: "bg-white/90 shadow-sm ring-1 ring-sky-200/80",
    iconColor: "text-sky-700",
    borderAccent: "border-t-sky-500",
    badgeBg: "bg-sky-50 border-sky-200/80",
    badgeText: "text-sky-800",
  },
  electrical: {
    Icon: FiZap,
    gradient: "from-[#FEF3C7] via-[#FFFBEB] to-[#FFEDD5]",
    accentBg: "bg-amber-500",
    iconBg: "bg-white/90 shadow-sm ring-1 ring-amber-200/80",
    iconColor: "text-amber-700",
    borderAccent: "border-t-amber-500",
    badgeBg: "bg-amber-50 border-amber-200/80",
    badgeText: "text-amber-800",
  },
  safety: {
    Icon: FiShield,
    gradient: "from-[#DCFCE7] via-[#ECFDF5] to-[#F0FDF4]",
    accentBg: "bg-emerald-600",
    iconBg: "bg-white/90 shadow-sm ring-1 ring-emerald-200/80",
    iconColor: "text-emerald-700",
    borderAccent: "border-t-emerald-500",
    badgeBg: "bg-emerald-50 border-emerald-200/80",
    badgeText: "text-emerald-800",
  },
  masonry: {
    Icon: FiLayers,
    gradient: "from-[#FFEDD5] via-[#FEF2F2] to-[#FFF7ED]",
    accentBg: "bg-orange-600",
    iconBg: "bg-white/90 shadow-sm ring-1 ring-orange-200/80",
    iconColor: "text-orange-700",
    borderAccent: "border-t-orange-500",
    badgeBg: "bg-orange-50 border-orange-200/80",
    badgeText: "text-orange-800",
  },
  tools: {
    Icon: FiTool,
    gradient: "from-[#E0E7FF] via-[#EEF2FF] to-[#F5F3FF]",
    accentBg: "bg-indigo-600",
    iconBg: "bg-white/90 shadow-sm ring-1 ring-indigo-200/80",
    iconColor: "text-indigo-700",
    borderAccent: "border-t-indigo-500",
    badgeBg: "bg-indigo-50 border-indigo-200/80",
    badgeText: "text-indigo-800",
  },
  communication: {
    Icon: FiMessageSquare,
    gradient: "from-[#FCE7F3] via-[#FDF2F8] to-[#FFF1F2]",
    accentBg: "bg-rose-600",
    iconBg: "bg-white/90 shadow-sm ring-1 ring-rose-200/80",
    iconColor: "text-rose-700",
    borderAccent: "border-t-rose-500",
    badgeBg: "bg-rose-50 border-rose-200/80",
    badgeText: "text-rose-800",
  },
  materials: {
    Icon: FiBox,
    gradient: "from-[#F3E8FF] via-[#FAF5FF] to-[#EEF2FF]",
    accentBg: "bg-purple-600",
    iconBg: "bg-white/90 shadow-sm ring-1 ring-purple-200/80",
    iconColor: "text-purple-700",
    borderAccent: "border-t-purple-500",
    badgeBg: "bg-purple-50 border-purple-200/80",
    badgeText: "text-purple-800",
  },
  tech: {
    Icon: FiCpu,
    gradient: "from-[#E0F2FE] via-[#EEF2FF] to-[#F1F5F9]",
    accentBg: "bg-slate-700",
    iconBg: "bg-white/90 shadow-sm ring-1 ring-slate-200/80",
    iconColor: "text-slate-700",
    borderAccent: "border-t-slate-600",
    badgeBg: "bg-slate-100 border-slate-200/80",
    badgeText: "text-slate-800",
  },
  default: {
    Icon: FiBookOpen,
    gradient: "from-[#FDECEF] via-[#FFF6EC] to-[#FEF3DC]",
    accentBg: "bg-primary-solid",
    iconBg: "bg-white/90 shadow-sm ring-1 ring-primary/15",
    iconColor: "text-primary-solid",
    borderAccent: "border-t-primary-solid",
    badgeBg: "bg-primary-solid/8 border-primary-solid/15",
    badgeText: "text-primary-solid",
  },
};

export function getCourseVisualTheme(
  title?: string | null,
  description?: string | null,
): CourseVisualTheme {
  const hay = `${title ?? ""} ${description ?? ""}`.toLowerCase();

  if (/(plumb|pipe|water|sanit|drain)/.test(hay)) return THEMES.plumbing;
  if (/(safety|health|osh|hazard|protect)/.test(hay)) return THEMES.safety;
  if (/(electr|wiring|circuit|voltage|solar|power)/.test(hay)) return THEMES.electrical;
  if (/(mason|brick|block|concrete|tiling|plaster|carpentr|welding|paint)/.test(hay))
    return THEMES.masonry;
  if (/(tool|instrument|equip|measure|drawing|symbol|work\s*place)/.test(hay))
    return THEMES.tools;
  if (/(communicat|relation|customer|team|ethic)/.test(hay))
    return THEMES.communication;
  if (/(material|handling|storage|inventory|supply)/.test(hay))
    return THEMES.materials;
  if (/(computer|ict|network|software|data|digital)/.test(hay))
    return THEMES.tech;

  return THEMES.default;
}

export interface ParsedCourseMeta {
  unitCode?: string;
  tradeLabel?: string;
  levelLabel?: string;
}

/**
 * Extracts trade/level/unit badges from standardized CAP descriptions like
 * "Competency unit CON/PL008/L1 for Plumbing, Level 1".
 */
export function parseCourseDescriptionMeta(description?: string | null): ParsedCourseMeta {
  if (!description) return {};
  const match = description.match(
    /Competency\s+unit\s+([A-Z0-9/_-]+)\s+for\s+([^,]+?)(?:,\s*(Level\s*\d+))?\.?$/i,
  );
  if (!match) return {};
  return {
    unitCode: match[1]?.trim(),
    tradeLabel: match[2]?.trim(),
    levelLabel: match[3]?.trim(),
  };
}

interface CourseArtworkProps {
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  className?: string;
  children?: React.ReactNode;
}

export const CourseArtwork: React.FC<CourseArtworkProps> = ({
  title,
  description,
  thumbnailUrl,
  className = "h-36",
  children,
}) => {
  const theme = getCourseVisualTheme(title, description);
  const Icon = theme.Icon;

  return (
    <div
      className={`relative bg-linear-to-br ${theme.gradient} flex items-center justify-center overflow-hidden ${className}`}
    >
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- resolved external asset URL
        <img
          src={thumbnailUrl}
          alt={title || ""}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
        />
      ) : (
        <>
          {/* Subtle decorative dot pattern + soft radial rings */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(36,16,20,0.14) 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/45 blur-md"
          />
          <div
            className={`relative z-10 w-13 h-13 rounded-2xl ${theme.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
          >
            <Icon className={`w-6 h-6 ${theme.iconColor}`} />
          </div>
        </>
      )}
      {children}
    </div>
  );
};
