import type { LmsPersonaType, OnboardingStatus } from "@/shared/types";

export type StartOnboardingInput = {
  persona: LmsPersonaType;
};

export type PersonalDetails = {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: string;
  dob?: string;
  passportAssetId?: string;
  passportUrl?: string;
};

export type ContactInformation = {
  phoneNumber?: {
    countryCode: string;
    number: string;
  };
};

export type ResidentialAddress = {
  country: string;
  state: string;
  lga: string;
  address?: string;
};

export type LearnerOnboardingPayload = {
  schemaVersion?: number;
  personalDetails?: PersonalDetails;
  contactInformation?: ContactInformation;
  residentialAddress?: ResidentialAddress;
  passportAssetId?: string;
  passportUrl?: string;
};

export type InstructorOnboardingPayload = LearnerOnboardingPayload & {
  bio?: string;
  tradeIds?: string[];
};

export type StaffOnboardingPayload = {
  schemaVersion?: number;
  personalDetails?: PersonalDetails;
  contactInformation?: ContactInformation;
};

export type OnboardingPayload =
  | LearnerOnboardingPayload
  | InstructorOnboardingPayload
  | StaffOnboardingPayload;

export type OnboardingSummary = {
  onboardingId: string;
  persona: LmsPersonaType;
  status: OnboardingStatus;
  createdAt: string;
  lastUpdatedAt?: string;
  completedAt?: string | null;
};

export type OnboardingRecord = OnboardingSummary & {
  data: OnboardingPayload;
};

export interface FormState {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  dob: string;
  countryCode: string;
  phoneNumber: string;
  country: string;
  state: string;
  lga: string;
  address: string;
};

export interface PersonalInfoFormProps {
  persona: LmsPersonaType;
  onSuccess: () => void;
}