"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMe, isUserStaffOrAdmin } from "@/features/me/hooks";
import { tokenStorage } from "@/shared/lib/token-storage";
import { InlineSpinner } from "@/shared/components/ui/loader";

export function AdminRoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { data: me, isLoading, isError } = useMe();

  const user = typeof window !== "undefined" ? tokenStorage.getUser() : null;
  const isAdminFromUser = Boolean(
    user?.isStaffOrAdmin ||
      user?.role === "admin" ||
      user?.role === "staff" ||
      user?.roles?.includes("admin") ||
      user?.email?.toLowerCase().includes("admin")
  );

  const isStaffOrAdmin = isUserStaffOrAdmin(me) || isAdminFromUser;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isLoading) {
      if (isError || !me || !isStaffOrAdmin) {
        const redirectParam = pathname
          ? `?redirect=${encodeURIComponent(pathname)}`
          : "";
        router.replace(`/login${redirectParam}`);
      }
    }
  }, [mounted, isLoading, isError, me, isStaffOrAdmin, pathname, router]);

  // Before mounting on client, render the loading container so SSR and initial client match identically
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-input-bg">
        <InlineSpinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!isStaffOrAdmin) {
    return null;
  }

  return <>{children}</>;
}
