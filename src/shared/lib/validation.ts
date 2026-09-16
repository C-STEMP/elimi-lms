import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email address is required")
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[0-9]/, "Include at least one number")
  .regex(/[^A-Za-z0-9]/, "Include at least one special character");

export const confirmPasswordSchema = (password: string) =>
  z
    .string()
    .min(1, "Confirm password is required")
    .refine((val) => val === password, {
      message: "Passwords do not match",
    });

export function requiredSchema(fieldName: string = "This field") {
  return z
    .string()
    .min(1, `${fieldName} is required`)
    .refine((val) => val.trim().length > 0, {
      message: `${fieldName} is required`,
    });
}

export function validateEmail(email: string): string | null {
  const res = emailSchema.safeParse(email);
  return res.success ? null : (res.error.issues[0]?.message ?? "Invalid email");
}

export function validatePassword(password: string): string | null {
  const res = passwordSchema.safeParse(password);
  return res.success ? null : (res.error.issues[0]?.message ?? "Invalid password");
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | null {
  const res = confirmPasswordSchema(password).safeParse(confirmPassword);
  return res.success
    ? null
    : (res.error.issues[0]?.message ?? "Passwords do not match");
}

export function validateRequired(
  value: string,
  fieldName: string = "This field"
): string | null {
  const res = requiredSchema(fieldName).safeParse(value);
  return res.success ? null : (res.error.issues[0]?.message ?? `${fieldName} is required`);
}

export interface PasswordCriterion {
  id: string;
  label: string;
  isValid: boolean;
}

export function getPasswordCriteria(password: string): PasswordCriterion[] {
  return [
    {
      id: "length",
      label: "At least 8 characters long",
      isValid: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "One uppercase letter (A-Z)",
      isValid: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "One lowercase letter (a-z)",
      isValid: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "One number (0-9)",
      isValid: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "One special character (e.g. !, @, #, -, etc.)",
      isValid: /[^A-Za-z0-9]/.test(password),
    },
  ];
}
