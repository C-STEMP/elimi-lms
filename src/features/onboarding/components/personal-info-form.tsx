"use client";

import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Button } from "@/shared/components/ui/button";
import { PassportUpload } from "@/shared/components/ui/passport-upload";
import { useToast } from "@/shared/components/ui/toast";
import { validateRequired } from "@/shared/lib/validation";
import { useOnboarding, useSaveOnboarding } from "@/features/onboarding/hooks";
import { useCountries, useStates, useLgas } from "@/features/address/hooks";
import type {
  FormState,
  LearnerOnboardingPayload,
  PersonalInfoFormProps,
} from "@/features/onboarding/types";
import {
  EMPTY_FORM,
  fromIsoDate,
  toIsoDate,
} from "../utils/constants";
import { PhoneInput } from "@/shared/components/ui/phone-input";

const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say"];

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  persona,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { data: onboarding, isLoading: isLoadingDraft } =
    useOnboarding(persona);
  const { mutate: saveOnboarding, isPending: isSaving } =
    useSaveOnboarding(persona);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [hydrated, setHydrated] = useState(false);
  const [, setPassportFile] = useState<File | null>(null);
  const [passportUrl, setPassportUrl] = useState<string>("");
  const [passportError, setPassportError] = useState<string>("");

  const { data: countries } = useCountries();
  const { data: states, isLoading: isLoadingStates } = useStates({
    country: form.country,
  });
  const { data: lgas, isLoading: isLoadingLgas } = useLgas({
    country: form.country,
    state: form.state,
  });

  useEffect(() => {
    if (hydrated || !onboarding) return;
    const payload = onboarding.data as LearnerOnboardingPayload;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      firstName: payload.personalDetails?.firstName ?? "",
      lastName: payload.personalDetails?.lastName ?? "",
      middleName: payload.personalDetails?.middleName ?? "",
      gender: payload.personalDetails?.gender ?? "",
      dob: fromIsoDate(payload.personalDetails?.dob),
      countryCode:
        payload.contactInformation?.phoneNumber?.countryCode ?? "+234",
      phoneNumber: payload.contactInformation?.phoneNumber?.number ?? "",
      country: payload.residentialAddress?.country ?? "",
      state: payload.residentialAddress?.state ?? "",
      lga: payload.residentialAddress?.lga ?? "",
      address: payload.residentialAddress?.address ?? "",
    });

    const initialPassportUrl =
      payload.personalDetails?.passportUrl || payload.passportUrl || "";
    if (initialPassportUrl) setPassportUrl(initialPassportUrl);

    setHydrated(true);
  }, [onboarding, hydrated]);

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "country") {
        next.state = "";
        next.lga = "";
      }
      if (field === "state") {
        next.lga = "";
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const buildPayload = (): LearnerOnboardingPayload => ({
    personalDetails: {
      firstName: form.firstName,
      lastName: form.lastName,
      middleName: form.middleName.trim() || undefined,
      gender: form.gender,
      dob: toIsoDate(form.dob),
    },
    contactInformation: form.phoneNumber
      ? {
          phoneNumber: {
            countryCode: form.countryCode,
            number: form.phoneNumber,
          },
        }
      : undefined,
    residentialAddress: {
      country: form.country,
      state: form.state,
      lga: form.lga,
      address: form.address.trim() || undefined,
    },
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {
      firstName: validateRequired(form.firstName, "First name") ?? undefined,
      lastName: validateRequired(form.lastName, "Last name") ?? undefined,
      gender: validateRequired(form.gender, "Gender") ?? undefined,
      country: validateRequired(form.country, "Country") ?? undefined,
      state: validateRequired(form.state, "State") ?? undefined,
      lga: validateRequired(form.lga, "LGA") ?? undefined,
    };
    const cleaned = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => Boolean(v)),
    ) as typeof newErrors;
    setErrors(cleaned);
    return Object.keys(cleaned).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        type: "error",
        title: "Input Required",
        description: "Please fill in all required fields.",
      });
      return;
    }

    saveOnboarding(buildPayload(), {
      onSuccess: () => onSuccess(),
      onError: (error) => {
        toast({
          type: "error",
          title: "Couldn't Save",
          description: error.message || "Unable to connect. Please try again.",
        });
      },
    });
  };

  const countryOptions = (countries?.data ?? []).map((c) => ({
    label: c.name,
    value: c.code,
  }));
  const stateOptions = (states?.data ?? []).map((s) => ({
    label: s.name,
    value: s.code,
  }));
  const lgaOptions = (lgas?.data ?? []).map((l) => ({
    label: l.name,
    value: l.name,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto flex flex-col gap-6 select-text"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
          <div className="flex flex-col gap-1 pt-1">
            <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-neutral-primary">
              Personal Information
            </h1>
            <p className="text-neutral-secondary text-xs sm:text-sm font-normal mt-1">
              Tell us a bit about yourself to unlock your learner dashboard.
            </p>
          </div>

          <PassportUpload
            defaultImage={passportUrl}
            error={passportError}
            onImageChange={(file, asset) => {
              setPassportFile(file);
              const previewUrl =
                asset?.url || (file ? URL.createObjectURL(file) : "");
              if (file || previewUrl) {
                setPassportError("");
                setPassportUrl(previewUrl);
              } else {
                setPassportUrl("");
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <h2 className="text-base sm:text-lg font-bold text-text-dark">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={
                <span>
                  First Name<span className="text-primary-solid ml-0.5">*</span>
                </span>
              }
              value={form.firstName}
              error={errors.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="First name"
              disabled={isLoadingDraft}
            />
            <Input
              label={
                <span>
                  Last Name<span className="text-primary-solid ml-0.5">*</span>
                </span>
              }
              value={form.lastName}
              error={errors.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Surname"
              disabled={isLoadingDraft}
            />
            <Input
              label="Middle Name"
              value={form.middleName}
              onChange={(e) => update("middleName", e.target.value)}
              placeholder="Other names"
              disabled={isLoadingDraft}
            />
            <Select
              label={
                <span>
                  Gender<span className="text-primary-solid ml-0.5">*</span>
                </span>
              }
              placeholder="Select"
              options={GENDER_OPTIONS}
              value={form.gender}
              error={errors.gender}
              onChange={(e) =>
                update("gender", (e.target.value as string) ?? "")
              }
              disabled={isLoadingDraft}
            />
            <DatePicker
              label="Date of Birth"
              name="dob"
              placeholder="dd/mm/yyyy"
              maxYear={new Date().getFullYear() - 13}
              value={form.dob}
              onChange={(val) => update("dob", val)}
              disabled={isLoadingDraft}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <h2 className="text-base sm:text-lg font-bold text-text-dark">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PhoneInput
              label={
                <span>
                  Phone Number
                  <span className="text-primary-solid ml-0.5">*</span>
                </span>
              }
              value={
                form.phoneNumber
                  ? form.phoneNumber.startsWith("+")
                    ? form.phoneNumber
                    : `${form.countryCode || "+234"}${form.phoneNumber}`
                  : ""
              }
              onChange={(fullPhone, countryData) => {
                const dial = countryData?.dialCode
                  ? `+${countryData.dialCode}`
                  : form.countryCode || "+234";
                const num = fullPhone.startsWith(dial)
                  ? fullPhone.slice(dial.length).trim()
                  : fullPhone.replace(/^\+/, "");
                setForm((prev) => ({
                  ...prev,
                  countryCode: dial,
                  phoneNumber: num,
                }));
                if (errors.phoneNumber) {
                  setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                }
              }}
              error={errors.phoneNumber}
              disabled={isLoadingDraft}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <h2 className="text-base sm:text-lg font-bold text-text-dark">
            Residential Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={
                <span>
                  Country<span className="text-primary-solid ml-0.5">*</span>
                </span>
              }
              placeholder="Select country"
              options={countryOptions}
              value={form.country}
              error={errors.country}
              onChange={(e) =>
                update("country", (e.target.value as string) ?? "")
              }
              disabled={isLoadingDraft}
            />
            <Select
              label={
                <span>
                  State<span className="text-primary-solid ml-0.5">*</span>
                </span>
              }
              placeholder={
                isLoadingStates
                  ? "Loading states..."
                  : form.country
                    ? "Select state"
                    : "Select country first"
              }
              options={stateOptions}
              value={form.state}
              error={errors.state}
              disabled={isLoadingDraft || isLoadingStates || !form.country}
              onChange={(e) =>
                update("state", (e.target.value as string) ?? "")
              }
            />
            <Select
              label={
                <span>
                  LGA<span className="text-primary-solid ml-0.5">*</span>
                </span>
              }
              placeholder={
                isLoadingLgas
                  ? "Loading LGAs..."
                  : form.state
                    ? "Select LGA"
                    : "Select state first"
              }
              options={lgaOptions}
              value={form.lga}
              error={errors.lga}
              disabled={isLoadingDraft || isLoadingLgas || !form.state}
              onChange={(e) => update("lga", (e.target.value as string) ?? "")}
            />
            <Input
              label="Address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Street address"
              disabled={isLoadingDraft}
            />
          </div>
        </div>

        <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-100">
          <Button
            type="submit"
            variant="secondary"
            size="md"
            loading={isSaving}
            className="px-6 h-11 text-white font-bold text-sm bg-secondary hover:bg-secondary-hover rounded-xl flex items-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <span>Continue</span>
            <FiArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
