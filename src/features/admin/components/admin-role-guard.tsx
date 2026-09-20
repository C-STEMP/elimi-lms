"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/features/me/hooks";
import { InlineSpinner } from "@/shared/components/ui/loader";

const ADMIN_PERSONAS = ["admin", "org_admin", "staff"];

export function AdminRoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: me, isLoading, isError } = useMe();

  const isStaffOrAdmin =
    Boolean(me?.staffRole) ||
    Boolean(me?.capabilities && me.capabilities.length > 0) ||
    Boolean(me?.personas?.some((p) => ADMIN_PERSONAS.includes(p.persona)));

  useEffect(() => {
    if (!isLoading && (isError || (me && !isStaffOrAdmin))) {
      router.replace("/dashboard");
    }
  }, [isLoading, isError, me, isStaffOrAdmin, router]);

  if (isLoading) {
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
