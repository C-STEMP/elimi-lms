"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiSave } from "react-icons/fi";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { PhoneInput } from "@/shared/components/ui/phone-input";
import { Loader } from "@/shared/components/ui/loader";
import { useToast } from "@/shared/components/ui/toast";
import { useOnboarding, useSaveOnboarding } from "@/features/onboarding/hooks";
import { useCountries, useStates, useLgas } from "@/features/address/hooks";
import { useMe } from "@/features/me/hooks";
import { tokenStorage } from "@/shared/lib/token-storage";
import {
  fromIsoDate,
  toIsoDate,
  GENDER_OPTIONS,
} from "@/features/onboarding/utils/constants";
import type { LearnerOnboardingPayload } from "@/features/onboarding/types";
import type { LmsPersonaType } from "@/shared/types";

interface ProfileFormState {
  firstName: string;
  lastName: string;
  middleName: string;
  dob: string;
  gender: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  country: string;
  state: string;
  lga: string;
  address: string;
}

const INITIAL_FORM: ProfileFormState = {
  firstName: "",
  lastName: "",
  middleName: "",
  dob: "",
  gender: "",
  email: "",
  countryCode: "+234",
  phoneNumber: "",
  country: "",
  state: "",
  lga: "",
  address: "",
};

export const PersonalInfoTab: React.FC = () => {
  const { toast } = useToast();
  const { data: me } = useMe();
  const persona: LmsPersonaType = me?.personas?.[0]?.persona || "learner";

  const { data: onboarding, isLoading: isLoadingOnboarding } =
    useOnboarding(persona);
  const { mutate: saveOnboarding, isPending: isSaving } =
    useSaveOnboarding(persona);

  const [form, setForm] = useState<ProfileFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormState, string>>
  >({});
  const [hydrated, setHydrated] = useState(false);

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
    const payload = onboarding?.data as LearnerOnboardingPayload | undefined;
    if (!payload) return;

    const dobRaw = payload.personalDetails?.dob;
    const formattedDob = dobRaw
      ? dobRaw.includes("-")
        ? fromIsoDate(dobRaw)
        : dobRaw
      : "";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      firstName: payload.personalDetails?.firstName ?? "",
      lastName: payload.personalDetails?.lastName ?? "",
      middleName: payload.personalDetails?.middleName ?? "",
      gender: payload.personalDetails?.gender ?? "",
      dob: formattedDob,
      email: tokenStorage.getUser()?.email ?? "",
      countryCode:
        payload.contactInformation?.phoneNumber?.countryCode ?? "+234",
      phoneNumber: payload.contactInformation?.phoneNumber?.number ?? "",
      country: payload.residentialAddress?.country ?? "",
      state: payload.residentialAddress?.state ?? "",
      lga: payload.residentialAddress?.lga ?? "",
      address: payload.residentialAddress?.address ?? "",
    });
    setHydrated(true);
  }, [hydrated, onboarding]);

  const countryOptions = useMemo(() => {
    const list = (countries?.data ?? []).map((c) => ({
      label: c.name,
      value: c.code,
    }));
    if (form.country && !list.some((item) => item.value === form.country)) {
      list.unshift({ label: form.country, value: form.country });
    }
    return list;
  }, [countries?.data, form.country]);

  const stateOptions = useMemo(() => {
    const list = (states?.data ?? []).map((s) => ({
      label: s.name,
      value: s.code,
    }));
    if (form.state && !list.some((item) => item.value === form.state)) {
      list.unshift({ label: form.state, value: form.state });
    }
    return list;
  }, [states?.data, form.state]);

  const lgaOptions = useMemo(() => {
    const list = (lgas?.data ?? []).map((l) => ({
      label: l.name,
      value: l.name,
    }));
    if (form.lga && !list.some((item) => item.value === form.lga)) {
      list.unshift({ label: form.lga, value: form.lga });
    }
    return list;
  }, [lgas?.data, form.lga]);

  const updateField = <K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ProfileFormState, string>> = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!form.gender) nextErrors.gender = "Gender is required";
    if (!form.country) nextErrors.country = "Country is required";
    if (!form.state) nextErrors.state = "State is required";
    if (!form.lga) nextErrors.lga = "LGA is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        type: "error",
        title: "Validation Error",
        description: "Please fill in all required fields marked with *",
      });
      return;
    }

    const payloadRaw = onboarding?.data as LearnerOnboardingPayload | undefined;
    const isoDob = form.dob
      ? form.dob.includes("/")
        ? toIsoDate(form.dob)
        : form.dob
      : undefined;

    const payload: LearnerOnboardingPayload = {
      schemaVersion: payloadRaw?.schemaVersion ?? 1,
      personalDetails: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        middleName: form.middleName.trim() || undefined,
        gender: form.gender,
        dob: isoDob,
        passportAssetId:
          payloadRaw?.personalDetails?.passportAssetId ||
          payloadRaw?.passportAssetId,
        passportUrl:
          payloadRaw?.personalDetails?.passportUrl || payloadRaw?.passportUrl,
      },
      passportAssetId:
        payloadRaw?.passportAssetId ||
        payloadRaw?.personalDetails?.passportAssetId,
      passportUrl:
        payloadRaw?.passportUrl || payloadRaw?.personalDetails?.passportUrl,
      contactInformation: {
        phoneNumber: {
          countryCode: form.countryCode || "+234",
          number: form.phoneNumber.trim(),
        },
      },
      residentialAddress: {
        country: form.country,
        state: form.state,
        lga: form.lga,
        address: form.address.trim(),
      },
    };

    saveOnboarding(payload, {
      onSuccess: () => {
        toast({
          type: "success",
          title: "Profile Updated",
          description: "Your personal profile has been updated successfully.",
        });
      },
      onError: (err) => {
        toast({
          type: "error",
          title: "Update Failed",
          description:
            err.message || "Failed to update profile. Please try again.",
        });
      },
    });
  };

  if (isLoadingOnboarding) {
    return (
      <div className="bg-white rounded-[20px] p-6 lg:p-8 shadow-lg border border-gray-100/80 w-full">
        <Loader fullscreen={false} size="small" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[20px] p-6 lg:p-8 shadow-lg border border-gray-100/80 flex flex-col gap-8 w-full"
    >
      {/* Personal Details */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg lg:text-2xl font-extrabold text-neutral-primary">
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
          <Input
            label={
              <span>
                First Name<span className="text-primary-solid ml-0.5">*</span>
              </span>
            }
            value={form.firstName}
            error={errors.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="First name"
          />
          <Input
            label={
              <span>
                Last Name<span className="text-primary-solid ml-0.5">*</span>
              </span>
            }
            value={form.lastName}
            error={errors.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="Surname"
          />
          <Input
            label="Middle Name"
            value={form.middleName}
            onChange={(e) => updateField("middleName", e.target.value)}
            placeholder="Other names"
          />
          <DatePicker
            label={
              <span>
                Date of Birth<span className="text-primary-solid ml-0.5">*</span>
              </span>
            }
            name="dob"
            placeholder="dd/mm/yyyy"
            maxYear={new Date().getFullYear() - 13}
            value={form.dob}
            onChange={(val) => updateField("dob", val)}
            error={errors.dob}
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
              updateField("gender", (e.target.value as string) ?? "")
            }
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Contact Information */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg lg:text-2xl font-extrabold text-neutral-primary">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="yourname@email.com"
          />
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
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Residential Address */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg lg:text-2xl font-extrabold text-neutral-primary">
          Residential Address
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
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
            onChange={(e) => {
              const nextCountry = (e.target.value as string) ?? "";
              setForm((prev) => ({
                ...prev,
                country: nextCountry,
                state: "",
                lga: "",
              }));
              if (errors.country) {
                setErrors((prev) => ({ ...prev, country: undefined }));
              }
            }}
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
            onChange={(e) => {
              const nextState = (e.target.value as string) ?? "";
              setForm((prev) => ({
                ...prev,
                state: nextState,
                lga: "",
              }));
              if (errors.state) {
                setErrors((prev) => ({ ...prev, state: undefined }));
              }
            }}
            disabled={!form.country}
          />
          <Select
            label={
              <span>
                City / LGA<span className="text-primary-solid ml-0.5">*</span>
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
            onChange={(e) =>
              updateField("lga", (e.target.value as string) ?? "")
            }
            disabled={!form.state}
          />
          <Input
            label="Residential Address"
            placeholder="Street address"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#fbab2a] hover:bg-[#e89b1f] active:scale-95 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2.5 shadow-lg transition-all cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{isSaving ? "Saving..." : "Save"}</span>
          <FiSave className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
