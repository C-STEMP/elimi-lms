import React from "react";
import {
  AdminSidebar,
  AdminMobileDrawer,
  AdminSidebarProvider,
  AdminRoleGuard,
} from "@/features/admin";

export const metadata = {
  title: "Admin Dashboard | Elimi LMS",
  description: "Elimi LMS Administration Portal",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSidebarProvider>
      <AdminRoleGuard>
        <div className="min-h-screen bg-input-bg flex text-text-dark antialiased">
          <AdminSidebar className="hidden lg:flex" />
          <AdminMobileDrawer />
          <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-4 md:p-5 overflow-y-auto w-full">
            {children}
          </main>
        </div>
      </AdminRoleGuard>
    </AdminSidebarProvider>
  );
}
