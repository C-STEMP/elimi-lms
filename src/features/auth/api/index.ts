import { orchestratorClient } from "@/shared/api/clients";
import { createHttpClient } from "@/shared/api/create-http-client";
import { unwrapItem } from "@/shared/api/response";
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  ForgotPasswordInput,
  GenericMessage,
  GoogleLoginInput,
  GoogleLoginResult,
  LoginInput,
  LoginResult,
  RegisterInput,
  RegisterResult,
  ResendOtpInput,
  ResetPasswordInput,
  VerifyAccountInput,
} from "@/features/auth/types";

const authRouteClient = createHttpClient("/api/auth");

export function register(input: RegisterInput) {
  const payload: RegisterInput = {
    ...input,
    intents: input.intents?.length ? input.intents : ["cap", "lms"],
  };
  return unwrapItem<RegisterResult>(
    orchestratorClient.post("/auth/register", payload),
  );
}

export function resendOtp(input: ResendOtpInput) {
  return unwrapItem<GenericMessage>(
    orchestratorClient.post("/auth/otp/resend", input),
  );
}

export function loginWithGoogle(input: GoogleLoginInput) {
  const payload: GoogleLoginInput = {
    ...input,
    intents: input.intents?.length ? input.intents : ["cap", "lms"],
  };
  return unwrapItem<GoogleLoginResult>(
    authRouteClient.post("/google", payload),
  );
}

export function login(input: LoginInput) {
  return unwrapItem<LoginResult>(authRouteClient.post("/login", input));
}

export function verifyAccount(input: VerifyAccountInput) {
  return unwrapItem<LoginResult>(
    authRouteClient.post("/verify-account", input),
  );
}

export function forgotPassword(input: ForgotPasswordInput) {
  return unwrapItem<unknown>(
    orchestratorClient.post("/auth/forgot-password", input),
  );
}

export function resetPassword(input: ResetPasswordInput) {
  return unwrapItem<GenericMessage>(
    orchestratorClient.post("/auth/reset-password", input),
  );
}

export function logout() {
  return unwrapItem<GenericMessage>(authRouteClient.post("/logout"));
}

export function changePassword(input: ChangePasswordInput) {
  return unwrapItem<GenericMessage>(
    orchestratorClient.patch("/auth/change-password", input),
  );
}

export function deleteAccount(input: DeleteAccountInput) {
  return unwrapItem<GenericMessage>(
    authRouteClient.post("/delete-account", input),
  );
}
