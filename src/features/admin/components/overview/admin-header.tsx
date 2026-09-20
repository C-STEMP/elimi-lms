"use client";

import React from "react";
import { LuSearch, LuBell, LuLogOut, LuMenu } from "react-icons/lu";
import { Avatar } from "@/shared/components/ui/avatar";
import { useLogout } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import { useAdminSidebarContext } from "../../context/admin-sidebar-context";

export interface AdminHeaderProps {
  title?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = "Welcome Back, Admin",
}) => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();
  const { openMobile } = useAdminSidebarContext();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.push("/login"),
    });
  };

  return (
    <header className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xs border border-gray-100 flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={openMobile}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-xl bg-input-bg hover:bg-gray-200 text-neutral-primary transition-colors cursor-pointer shrink-0"
          >
            <LuMenu className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-xl md:text-2xl font-bold text-neutral-primary tracking-tight truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:block relative w-64">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Users, Transactions..."
              className="w-full pl-9 pr-3 py-2 bg-input-bg border-none rounded-xl text-xs sm:text-sm text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-input-bg hover:bg-gray-200 flex items-center justify-center text-neutral-primary transition-colors cursor-pointer"
          >
            <LuBell className="w-4 h-4" />
          </button>

          <Avatar
            name="Admin User"
            seed="admin-avatar"
            size={34}
            className="ring-2 ring-white shadow-xs cursor-pointer"
          />

          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            aria-label="Log Out"
            title="Log Out"
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-input-bg hover:bg-gray-200 flex items-center justify-center text-neutral-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            <LuLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Responsive mobile search bar */}
      <div className="lg:hidden relative w-full">
        <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Users, Transactions..."
          className="w-full pl-9 pr-3 py-2 bg-input-bg border-none rounded-xl text-xs sm:text-sm text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </header>
  );
};
