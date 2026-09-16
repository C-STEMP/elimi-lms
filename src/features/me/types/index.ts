import type { LmsPersonaType, OnboardingStatus, StaffRole } from "@/shared/types";

export type PersonaStatus = {
  persona: LmsPersonaType;
  onboardingStatus: OnboardingStatus;
  profileId: string | null;
};

export type InstructorAccountStatus = "invited" | "active" | "suspended" | null;

export type LmsMe = {
  lmsUserId: string;
  userId: string;
  personas: PersonaStatus[];
  staffRole?: StaffRole;
  instructorStatus?: InstructorAccountStatus;
  /** e.g. "course.content.edit", "course.publish", "entitlement.grant" */
  capabilities: string[];
};
