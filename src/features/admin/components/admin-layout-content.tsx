"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { useAdminSidebarContext } from "../context/admin-sidebar-context";

export const AdminLayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { closeMobile } = useAdminSidebarContext();
  const pathname = usePathname();

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  return (
    <div className="flex min-h-screen bg-input-bg text-text-dark antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-4 md:p-5 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
