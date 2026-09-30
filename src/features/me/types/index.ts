import type { LmsPersonaType, OnboardingStatus, StaffRole } from "@/shared/types";
import type {
  PersonalDetails,
  ContactInformation,
  ResidentialAddress,
} from "@/features/onboarding/types";

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

export type ResolvedAsset = {
  assetId: string;
  url: string | null;
};

export type LmsMeProfile = {
  lmsUserId: string;
  email: string | null;
  displayName: string | null;
  photoAssetId: string | null;
  photo: ResolvedAsset | null;
  personalDetails?: PersonalDetails;
  contactInformation?: ContactInformation;
  residentialAddress?: ResidentialAddress;
};

export type LmsMeProfilePatch = {
  displayName?: string | null;
  photoAssetId?: string | null;
  personalDetails?: PersonalDetails;
  contactInformation?: ContactInformation;
  residentialAddress?: ResidentialAddress;
};
