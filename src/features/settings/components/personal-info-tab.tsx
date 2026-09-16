"use client";

import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { Input } from "@/shared/components/ui/input";
import { Loader } from "@/shared/components/ui/loader";
import { useOnboarding } from "@/features/onboarding/hooks";
import { tokenStorage } from "@/shared/lib/token-storage";
import type { LearnerOnboardingPayload } from "@/features/onboarding/types";

/**
 * Read-only: the LMS onboarding record (where personal details live) can't
 * be edited once submitted — `PATCH /onboarding/{persona}/save` returns 409
 * for a completed record, and there's no separate profile-update endpoint.
 * Editing here needs a backend addition before this can become a real form.
 */
export const PersonalInfoTab: React.FC = () => {
  const { data: onboarding, isLoading } = useOnboarding("learner");
  // Lazy init: reads localStorage once on mount (no-ops on the server).
  const [email] = useState(() => tokenStorage.getUser()?.email ?? "");

  const payload = onboarding?.data as LearnerOnboardingPayload | undefined;
  const personalDetails = payload?.personalDetails;
  const contactInformation = payload?.contactInformation;
  const residentialAddress = payload?.residentialAddress;

  if (isLoading) {
    return (
      <div className="bg-white rounded-[20px] p-6 lg:p-8 shadow-lg border border-gray-100/80 w-full">
        <Loader fullscreen={false} size="small" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-6 lg:p-8 shadow-lg border border-gray-100/80 flex flex-col gap-8 w-full">
      <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200/70 p-3.5 text-xs text-amber-800">
        <FiInfo className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          These details come from your onboarding submission and aren&apos;t
          editable yet. Reach out to support if something needs correcting.
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg lg:text-2xl font-extrabold text-neutral-primary">
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
          <Input label="First Name" value={personalDetails?.firstName ?? ""} disabled />
          <Input label="Last Name" value={personalDetails?.lastName ?? ""} disabled />
          <Input label="Middle Name" value={personalDetails?.middleName ?? ""} disabled />
          <Input label="Date of Birth" value={personalDetails?.dob ?? ""} disabled />
          <Input label="Gender" value={personalDetails?.gender ?? ""} disabled />
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg lg:text-2xl font-extrabold text-neutral-primary">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
          <Input label="Email Address" value={email} disabled />
          <Input
            label="Phone Number"
            value={
              contactInformation?.phoneNumber
                ? `${contactInformation.phoneNumber.countryCode} ${contactInformation.phoneNumber.number}`
                : ""
            }
            disabled
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg lg:text-2xl font-extrabold text-neutral-primary">
          Residential Address
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
          <Input label="Country" value={residentialAddress?.country ?? ""} disabled />
          <Input label="State" value={residentialAddress?.state ?? ""} disabled />
          <Input label="LGA" value={residentialAddress?.lga ?? ""} disabled />
          <Input label="Address" value={residentialAddress?.address ?? ""} disabled />
        </div>
      </div>
    </div>
  );
};
