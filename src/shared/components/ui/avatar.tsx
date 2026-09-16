"use client";

import React, { useState } from "react";
import type { StaticImageData } from "next/image";
import { FiUser } from "react-icons/fi";

export interface AvatarProps {
  src?: string | StaticImageData | null;
  name?: string;
  alt?: string;
  seed?: string;
  size?: number | string;
  className?: string;
  shape?: "circle" | "rounded" | "square";
  style?: React.CSSProperties;
  avatarStyle?: "avataaars" | "lorelei" | "bottts" | "notionists" | "thumbs";
}

/** Deterministic placeholder avatar URL based on a seed or name. */
export const getRandomAvatarUrl = (
  seed?: string,
  style: AvatarProps["avatarStyle"] = "avataaars"
): string => {
  const safeSeed = seed?.trim() || `elimi-user-${Math.floor(Math.random() * 1000)}`;
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(safeSeed)}`;
};

/** e.g. "Ruqoyat Babalola" -> "RB" */
export const getInitials = (name?: string): string => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const BACKGROUND_GRADIENTS = [
  "from-[#A31D38] to-[#E11D48]",
  "from-[#4F46E5] to-[#7C3AED]",
  "from-[#0284C7] to-[#06B6D4]",
  "from-[#059669] to-[#10B981]",
  "from-[#D97706] to-[#F59E0B]",
  "from-[#DC2626] to-[#EA580C]",
  "from-[#7C3AED] to-[#DB2777]",
];

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = "",
  alt,
  seed,
  size,
  className = "",
  shape = "circle",
  style,
  avatarStyle = "avataaars",
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  const [hasRandomAvatarError, setHasRandomAvatarError] = useState(false);

  const resolvedSrc =
    typeof src === "object" && src !== null && "src" in src
      ? (src as StaticImageData).src
      : typeof src === "string" && src.trim() !== ""
        ? src
        : null;

  const displayAlt = alt || name || "User Avatar";
  const avatarSeed = seed || name || "Elimi-Default-Seed";
  const randomAvatarUrl = getRandomAvatarUrl(avatarSeed, avatarStyle);
  const initials = getInitials(name);

  const charCodeSum = avatarSeed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradientClass = BACKGROUND_GRADIENTS[charCodeSum % BACKGROUND_GRADIENTS.length];

  const shapeClasses = {
    circle: "rounded-full",
    rounded: "rounded-2xl",
    square: "rounded-none",
  }[shape];

  const sizeStyles: React.CSSProperties = size
    ? typeof size === "number"
      ? { width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }
      : { width: size, height: size, minWidth: size, minHeight: size }
    : {};

  if (resolvedSrc && !hasImageError) {
    return (
      <div
        className={`relative overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 ${shapeClasses} ${className}`}
        style={{ ...sizeStyles, ...style }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- avatar src can be an arbitrary uploaded/external URL */}
        <img
          src={resolvedSrc}
          alt={displayAlt}
          className="w-full h-full object-cover block"
          onError={() => setHasImageError(true)}
        />
      </div>
    );
  }

  if (!hasRandomAvatarError) {
    return (
      <div
        className={`relative overflow-hidden bg-rose-50/60 flex items-center justify-center shrink-0 border border-black/5 ${shapeClasses} ${className}`}
        style={{ ...sizeStyles, ...style }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- external placeholder service, not an optimizable local asset */}
        <img
          src={randomAvatarUrl}
          alt={displayAlt}
          className="w-full h-full object-cover block"
          onError={() => setHasRandomAvatarError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-linear-to-tr ${gradientClass} text-white font-bold flex items-center justify-center shrink-0 shadow-2xs ${shapeClasses} ${className}`}
      style={{ ...sizeStyles, ...style }}
    >
      {initials ? (
        <span className="text-xs sm:text-sm select-none tracking-wider">{initials}</span>
      ) : (
        <FiUser className="w-1/2 h-1/2 text-white/90" />
      )}
    </div>
  );
};
