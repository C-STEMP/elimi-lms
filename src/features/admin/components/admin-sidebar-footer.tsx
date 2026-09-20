"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import { useLogout } from "@/features/auth/hooks";
import type { AdminSidebarFooterProps } from "../types";

export const AdminSidebarFooter: React.FC<AdminSidebarFooterProps> = ({
  isCollapsed,
}) => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.push("/login"),
    });
  };

  if (isCollapsed) {
    return (
      <div className="pt-3 pb-1 border-t border-white/10 flex justify-center">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          title="Log Out"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
        >
          <LuLogOut className="w-5 h-5 shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div className="pt-3 pb-1 border-t border-white/10">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50 text-left"
      >
        <LuLogOut className="w-5 h-5 shrink-0" />
        <span className="truncate">{isPending ? "Logging out..." : "Log Out"}</span>
      </button>
    </div>
  );
};
