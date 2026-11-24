"use client";

import { useMyEnrollments } from "@/features/enrollments/hooks";
import { useMyCertificates, useMyLevelCertificates } from "@/features/certificates/hooks";
import type { DashboardStat } from "@/features/dashboard/types";

export { formatMoney } from "@/shared/lib/money";

export function useDashboardStats(): { stats: DashboardStat[]; isLoading: boolean } {
  const enrollmentsQuery = useMyEnrollments();
  const certificatesQuery = useMyCertificates();
  const levelCertificatesQuery = useMyLevelCertificates();

  const enrollments = enrollmentsQuery.data?.data ?? [];
  const certificates = certificatesQuery.data?.data ?? [];
  const levelCertificates = levelCertificatesQuery.data?.data ?? [];

  const totalIssuedCerts =
    certificates.filter((c) => c.status === "issued").length +
    levelCertificates.filter((c) => c.status === "issued").length;

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
      value: totalIssuedCerts,
      suffix: "earned",
    },
  ];

  return {
    stats,
    isLoading:
      enrollmentsQuery.isLoading ||
      certificatesQuery.isLoading ||
      levelCertificatesQuery.isLoading,
  };
}

