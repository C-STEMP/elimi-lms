"use client";

import React from "react";
import { AdminSidebarLogo } from "./admin-sidebar-logo";
import { AdminSidebarNav } from "./admin-sidebar-nav";
import { AdminSidebarFooter } from "./admin-sidebar-footer";
import { ADMIN_NAV_ITEMS } from "../constants/nav-items";
import { useAdminSidebarContext } from "../context/admin-sidebar-context";
import type { AdminSidebarProps } from "../types";

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed: externalCollapsed,
  onToggleCollapse: externalToggle,
  className = "",
}) => {
  const ctx = useAdminSidebarContext();

  const isCollapsed =
    externalCollapsed !== undefined ? externalCollapsed : ctx.isCollapsed;
  const handleToggle = externalToggle ?? ctx.toggleCollapse;

  return (
    <aside
      className={`bg-primary text-white rounded-2xl flex flex-col justify-between shrink-0 my-3 ml-3 p-3 shadow-md transition-all duration-300 ease-in-out h-[calc(100vh-1.5rem)] sticky top-3 select-none ${
        isCollapsed ? "w-18" : "w-56"
      } ${className}`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        <AdminSidebarLogo
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggle}
        />
        <AdminSidebarNav items={ADMIN_NAV_ITEMS} isCollapsed={isCollapsed} />
      </div>

      <AdminSidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
};
