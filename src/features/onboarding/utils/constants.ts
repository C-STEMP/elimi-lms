import { FormState } from "../types";

export const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  middleName: "",
  gender: "",
  dob: "",
  countryCode: "+234",
  phoneNumber: "",
  country: "",
  state: "",
  lga: "",
  address: "",
};

export function toIsoDate(display: string): string | undefined {
  const parts = display.split("/");
  if (parts.length !== 3) return undefined;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy || yyyy.length !== 4) return undefined;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export function fromIsoDate(iso?: string): string {
  if (!iso) return "";
  const [yyyy, mm, dd] = iso.split("-");
  if (!yyyy || !mm || !dd) return "";
  return `${dd}/${mm}/${yyyy}`;
}

export const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say"];
