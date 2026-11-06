"use client";

import React, { useMemo } from "react";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { useCertificate } from "@/features/certificates/hooks";
import { useCourse } from "@/features/courses/hooks";
import { useMeProfile } from "@/features/me/hooks";
import { useOnboarding } from "@/features/onboarding/hooks";
import { CertificateTemplate } from "@/features/certificates/components/certificate-template";
import type { CertificateRenderData } from "@/features/certificates/types";

export const CertificateDetailView: React.FC<{ certificateId: string }> = ({ certificateId }) => {
  const { data: certificate, isLoading } = useCertificate(certificateId);
  const { data: course } = useCourse(certificate?.courseId ?? "");
  const { data: profile, isLoading: isLoadingProfile } = useMeProfile();
  const { data: onboarding } = useOnboarding("learner");

  const data = useMemo<CertificateRenderData | undefined>(() => {
    if (!certificate || certificate.status === "revoked") return undefined;

    const details = profile?.personalDetails ?? onboarding?.data?.personalDetails;
    const fullName =
      (details && [details.firstName, details.middleName, details.lastName].filter(Boolean).join(" ")) ||
      profile?.displayName ||
      "Learner";

    return {
      certificateId: certificate.id,
      dateOfCompletion: certificate.issuedAt,
      user: { fullName },
      course: {
        name: course?.title ?? certificate.courseTitle ?? "Course",
        instructors: [],
      },
      organization: null,
    };
  }, [certificate, course, profile, onboarding]);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <DashboardNav backHref="/certificates" backTitle="Certificates" rightAction={null} />
      {isLoading || isLoadingProfile ? (
        <InlineSpinner className="flex-1" />
      ) : (
        <CertificateTemplate data={data} />
      )}
    </div>
  );
};
