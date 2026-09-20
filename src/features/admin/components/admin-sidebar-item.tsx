import React from "react";
import Link from "next/link";
import type { AdminSidebarItemProps } from "../types";

export const AdminSidebarItem: React.FC<AdminSidebarItemProps> = ({
  item,
  isActive,
  isCollapsed,
}) => {
  const Icon = item.icon;

  if (isCollapsed) {
    return (
      <Link
        href={item.href}
        title={item.label}
        className={`w-full mx-auto h-11 rounded-xl flex items-center justify-center transition-all relative ${
          isActive
            ? "bg-white/10 text-secondary shadow-2xs font-semibold"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-2 bottom-2 w-1 bg-secondary rounded-r" />
        )}
        <Icon className="w-5 h-5 shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm transition-all relative ${
        isActive
          ? "bg-white/10 text-secondary font-semibold shadow-2xs"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1 bg-secondary rounded-r" />
      )}
      <Icon className="w-5 h-5 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
};
