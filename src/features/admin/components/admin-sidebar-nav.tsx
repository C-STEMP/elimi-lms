"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebarItem } from "./admin-sidebar-item";
import type { AdminSidebarNavProps } from "../types";

export const AdminSidebarNav: React.FC<AdminSidebarNavProps> = ({
  items,
  isCollapsed,
}) => {
  const pathname = usePathname();

  const isItemActive = (href: string, exact?: boolean) => {
    if (exact || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden">
      {items.map((item) => (
        <AdminSidebarItem
          key={item.href}
          item={item}
          isActive={isItemActive(item.href, item.exact)}
          isCollapsed={isCollapsed}
        />
      ))}
    </nav>
  );
};
