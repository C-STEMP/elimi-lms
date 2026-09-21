"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/features/auth/api";
import { tokenStorage } from "@/shared/lib/token-storage";
import { meKeys } from "@/features/me/hooks";
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  ForgotPasswordInput,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  ResendOtpInput,
  ResetPasswordInput,
  VerifyAccountInput,
} from "@/features/auth/types";

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (input: ResendOtpInput) => authApi.resendOtp(input),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (result) => {
      tokenStorage.setUser(result.user);
      queryClient.invalidateQueries({ queryKey: meKeys.me() });
    },
  });
}

export function useLoginWithGoogle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GoogleLoginInput) => authApi.loginWithGoogle(input),
    onSuccess: (result) => {
      tokenStorage.setUser(result.user);
      queryClient.invalidateQueries({ queryKey: meKeys.me() });
    },
  });
}

export function useVerifyAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerifyAccountInput) => authApi.verifyAccount(input),
    onSuccess: (result) => {
      tokenStorage.setUser(result.user);
      queryClient.invalidateQueries({ queryKey: meKeys.me() });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authApi.forgotPassword(input),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authApi.changePassword(input),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      tokenStorage.clearUser();
      queryClient.clear();
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DeleteAccountInput) => authApi.deleteAccount(input),
    onSuccess: () => {
      tokenStorage.clearUser();
      queryClient.clear();
    },
  });
}
