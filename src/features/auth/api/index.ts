import { orchestratorClient } from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type {
  AuthTokens,
  ChangePasswordInput,
  DeleteAccountInput,
  ForgotPasswordInput,
  GenericMessage,
  GoogleLoginInput,
  GoogleLoginResult,
  LoginInput,
  LoginResult,
  LogoutInput,
  RefreshInput,
  RegisterInput,
  RegisterResult,
  ResendOtpInput,
  ResetPasswordInput,
  VerifyAccountInput,
} from "@/features/auth/types";

export function register(input: RegisterInput) {
  return unwrapItem<RegisterResult>(orchestratorClient.post("/auth/register", input));
}

export function resendOtp(input: ResendOtpInput) {
  return unwrapItem<GenericMessage>(orchestratorClient.post("/auth/otp/resend", input));
}

export function loginWithGoogle(input: GoogleLoginInput) {
  return unwrapItem<GoogleLoginResult>(orchestratorClient.post("/auth/google", input));
}

export function login(input: LoginInput) {
  return unwrapItem<LoginResult>(orchestratorClient.post("/auth/login", input));
}

export function verifyAccount(input: VerifyAccountInput) {
  return unwrapItem<LoginResult>(orchestratorClient.post("/auth/verify-account", input));
}

/** Response body is intentionally content-free (anti-enumeration) — do not branch on it. */
export function forgotPassword(input: ForgotPasswordInput) {
  return unwrapItem<unknown>(orchestratorClient.post("/auth/forgot-password", input));
}

export function resetPassword(input: ResetPasswordInput) {
  return unwrapItem<GenericMessage>(orchestratorClient.post("/auth/reset-password", input));
}

export function refreshTokens(input: RefreshInput) {
  return unwrapItem<AuthTokens>(orchestratorClient.post("/auth/refresh", input));
}

export function logout(input: LogoutInput) {
  return unwrapItem<GenericMessage>(orchestratorClient.post("/auth/logout", input));
}

export function changePassword(input: ChangePasswordInput) {
  return unwrapItem<GenericMessage>(orchestratorClient.patch("/auth/change-password", input));
}

export function deleteAccount(input: DeleteAccountInput) {
  return unwrapItem<GenericMessage>(orchestratorClient.post("/auth/delete-account", input));
}
