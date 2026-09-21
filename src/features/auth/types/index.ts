export type OtpPurpose = "account_verify" | "password_reset";

export type UserStatus = "pending_verification" | "active" | "suspended" | "deactivated";

export type AuthProvider = "email" | "google";

export type User = {
  id: string;
  email: string;
  phone?: string | null;
  authProvider?: AuthProvider;
  status: UserStatus;
  intents: string[];
  /** True for centre-staff invites provisioned with a generated password. */
  mustChangePassword: boolean;
  createdAt: string;
};

export type GenericMessage = {
  message?: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  /** Drives which services get provisioned via the user.created event, e.g. ["cap"]. */
  intents: string[];
};

export type RegisterResult = {
  userId: string;
  email: string;
  status: "pending_verification";
};

export type ResendOtpInput = {
  email: string;
  purpose: OtpPurpose;
};

export type GoogleLoginInput = {
  idToken: string;
  provider: "google";
  intents?: string[];
};

export type GoogleLoginResult = {
  user: User;
  isNewUser: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResult = {
  user: User;
};

export type VerifyAccountInput = {
  email: string;
  otp: string;
  purpose: "account_verify";
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  email: string;
  otp: string;
  purpose: "password_reset";
  newPassword: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type DeleteAccountInput = {
  /** Omit for Google-only accounts; send `confirm: true` instead. */
  password?: string;
  confirm?: boolean;
};
