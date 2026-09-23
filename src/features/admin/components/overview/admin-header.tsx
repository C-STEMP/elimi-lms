"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LuSearch, LuBell, LuMenu } from "react-icons/lu";
import { Avatar } from "@/shared/components/ui/avatar";
import { useAdminSidebarContext } from "../../context/admin-sidebar-context";

export interface AdminHeaderProps {
  title?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = "Welcome back, Admin",
}) => {
  const { openMobile } = useAdminSidebarContext();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <nav className="bg-white shadow-xl rounded-xl pl-4 p-3 flex justify-between items-center gap-1.5 select-none">
      <div className="flex sm:hidden items-center gap-2">
        <Image
          src="/elimi-favicon.svg"
          alt="Elimi"
          className="object-contain"
          width={20}
          height={20}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>

      <h2 className="text-sm sm:text-sm md:text-base lg:text-lg text-neutral-primary font-bold truncate">
        {title}
      </h2>

      <div className="ml-auto flex gap-2 items-center justify-end pl-4">
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex bg-input-bg p-1 md:py-0.5 rounded-lg flex-1 w-full min-w-xs sm:min-w-sm items-center gap-1.5"
        >
          <button
            type="submit"
            aria-label="Search"
            className="p-1 text-neutral-primary text-xs cursor-pointer flex items-center justify-center"
          >
            <LuSearch size={14} />
          </button>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="search"
            name="search"
            id="admin-search"
            placeholder="Search courses, learners, staff..."
            className="p-0.5 text-sm text-text-dark flex-1 bg-transparent border-none focus:outline-none"
          />
        </form>

        <button
          type="button"
          aria-label="Notifications"
          className="grid place-items-center bg-input-bg p-1 rounded-lg text-neutral-primary text-xs h-6 w-6 sm:h-8 sm:w-8 shrink-0 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <LuBell size={14} />
        </button>

        <div className="relative grid place-items-center rounded-3xl overflow-hidden text-neutral-primary text-xs h-6 w-6 sm:h-8 sm:w-8 shrink-0">
          <Avatar
            name="Admin User"
            seed="admin-avatar"
            size={32}
            className="cursor-pointer"
          />
        </div>

        <button
          type="button"
          onClick={openMobile}
          aria-label="Open menu"
          className="grid place-items-center bg-input-bg p-1 rounded-lg text-neutral-primary text-xs h-6 w-6 sm:h-8 sm:w-8 shrink-0 cursor-pointer md:hidden hover:bg-gray-200 transition-colors"
        >
          <LuMenu size={16} />
        </button>
      </div>
    </nav>
  );
};
