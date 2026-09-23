import React from "react";
import {
  AdminSidebarProvider,
  AdminRoleGuard,
  AdminLayoutContent,
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
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminRoleGuard>
    </AdminSidebarProvider>
  );
}
