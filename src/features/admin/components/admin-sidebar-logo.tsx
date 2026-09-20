"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LuPanelLeft } from "react-icons/lu";
import { ASSETS_URL } from "@/assets";
import { AdminLogoMark } from "./admin-logo-mark";
import type { AdminSidebarLogoProps } from "../types";

export const AdminSidebarLogo: React.FC<AdminSidebarLogoProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center pt-2 pb-4">
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Expand sidebar"
          className="p-1.5 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
        >
          <AdminLogoMark size={32} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 pt-2 pb-4">
      <Link href="/admin" className="flex items-center select-none">
        <Image
          src={ASSETS_URL.logoIcon}
          alt="Elimi Admin"
          width={80}
          height={32}
          priority
          className="object-cover"
        />
      </Link>

      <button
        type="button"
        onClick={onToggleCollapse}
        title="Collapse sidebar"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <LuPanelLeft className="w-6 h-6" />
      </button>
    </div>
  );
};
