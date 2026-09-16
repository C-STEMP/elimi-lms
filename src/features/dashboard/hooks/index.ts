"use client";

import { useMyEnrollments } from "@/features/enrollments/hooks";
import { useMyCertificates } from "@/features/certificates/hooks";
import type { Money } from "@/shared/types";
import type { DashboardStat } from "@/features/dashboard/types";

export function useDashboardStats(): { stats: DashboardStat[]; isLoading: boolean } {
  const enrollmentsQuery = useMyEnrollments();
  const certificatesQuery = useMyCertificates();

  const enrollments = enrollmentsQuery.data?.data ?? [];
  const certificates = certificatesQuery.data?.data ?? [];

  const stats: DashboardStat[] = [
    { label: "Enrolled", value: enrollments.length, suffix: "courses" },
    {
      label: "Ongoing",
      value: enrollments.filter((e) => e.status === "active").length,
      suffix: "courses",
    },
    {
      label: "Completed",
      value: enrollments.filter((e) => e.status === "completed").length,
      suffix: "courses",
    },
    {
      label: "Certificates",
      value: certificates.filter((c) => c.status === "issued").length,
      suffix: "earned",
    },
  ];

  return {
    stats,
    isLoading: enrollmentsQuery.isLoading || certificatesQuery.isLoading,
  };
}

export function formatMoney(money: Money): string {
  const amount = Number(money.amountMinorUnits) / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: money.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${money.currency} ${amount.toLocaleString()}`;
  }
}
