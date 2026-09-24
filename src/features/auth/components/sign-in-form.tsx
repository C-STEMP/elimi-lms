"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/toast";
import { ASSETS_URL } from "@/assets";
import { validateEmail } from "@/shared/lib/validation";
import { useLogin, useLoginWithGoogle } from "@/features/auth/hooks";
import { meKeys, getPostAuthRedirect, isUserStaffOrAdmin } from "@/features/me/hooks";
import * as meApi from "@/features/me/api";
import type { LmsMe } from "@/features/me/types";

export const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: loginWithGoogle, isPending: isGooglePending } = useLoginWithGoogle();

  const redirectPostAuth = async (loginResult?: {
    user?: { email?: string; role?: string; roles?: string[]; intents?: string[] };
    isStaffOrAdmin?: boolean;
    me?: LmsMe;
  }) => {
    let me = loginResult?.me;
    let isStaffOrAdmin = loginResult?.isStaffOrAdmin;

    const emailToCheck = (email || loginResult?.user?.email || "").toLowerCase();
    const isEmailAdmin = emailToCheck.includes("admin");
    const rawRole = String(loginResult?.user?.role || "").toLowerCase();
    const rawRoles = Array.isArray(loginResult?.user?.roles)
      ? loginResult.user.roles.map((r) => String(r).toLowerCase())
      : [];
    const isRoleAdmin =
      rawRole === "admin" ||
      rawRole === "staff" ||
      rawRole === "super_admin" ||
      rawRoles.includes("admin") ||
      rawRoles.includes("staff");

    if (!me) {
      try {
        me = await queryClient.fetchQuery({ queryKey: meKeys.me(), queryFn: meApi.getMe });
      } catch (err) {
        console.warn("Could not fetch me post-auth:", err);
      }
    }

    if (isStaffOrAdmin === undefined) {
      isStaffOrAdmin = isUserStaffOrAdmin(me);
    }

    const redirectUrl = searchParams.get("redirect");

    if (isStaffOrAdmin || isUserStaffOrAdmin(me) || isEmailAdmin || isRoleAdmin) {
      if (redirectUrl && redirectUrl.startsWith("/")) {
        router.push(redirectUrl);
        return;
      }
      router.push("/admin");
      return;
    }

    router.push(getPostAuthRedirect(me, redirectUrl, isStaffOrAdmin));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = !password.trim() ? "Password is required" : null;

    if (emailErr || passErr) {
      setErrors({ email: emailErr || undefined, password: passErr || undefined });
      toast({
        type: "error",
        title: "Input Required",
        description: "Please check the highlighted fields.",
      });
      return;
    }

    setErrors({});
    login(
      { email, password },
      {
        onSuccess: (data) => {
          toast({
            type: "success",
            title: "Welcome Back!",
            description: `Signed in as ${email}`,
          });
          redirectPostAuth(data);
        },
        onError: (error) => {
          if (error.code === "auth.account_not_verified" || error.status === 403) {
            toast({
              type: "info",
              title: "Verify Your Account",
              description: "Please verify your email to continue.",
            });
            router.push(`/verify?email=${encodeURIComponent(email)}`);
            return;
          }
          toast({
            type: "error",
            title: "Sign In Failed",
            description:
              error.status === 401
                ? "Invalid email or password. Please try again."
                : error.message || "Unable to connect. Please try again.",
          });
        },
      }
    );
  };

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast({
        type: "error",
        title: "Google Sign-In Failed",
        description: "Unable to retrieve authentication token.",
      });
      return;
    }
    loginWithGoogle(
      { idToken: credentialResponse.credential, provider: "google" },
      {
        onSuccess: (data) => {
          toast({
            type: "success",
            title: data.isNewUser ? "Welcome!" : "Welcome Back!",
            description: `Signed in as ${data.user.email}`,
          });
          redirectPostAuth(data);
        },
        onError: (error) => {
          toast({
            type: "error",
            title: "Google Sign-In Failed",
            description: error.message || "Please try again.",
          });
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full max-w-110 mx-auto flex flex-col justify-center select-text"
    >
      <div className="mb-8 text-center lg:text-left w-full flex flex-col items-center lg:items-start">
        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-neutral-primary text-center lg:text-left">
          Sign in to Elimi
        </h1>
        <p className="text-neutral-secondary text-[14px] xl:text-[15px] leading-relaxed mt-2 max-w-sm font-normal text-center lg:text-left mx-auto lg:mx-0">
          Access your courses, track your progress, and pick up right where
          you left off.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="yourname@email.com"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          disabled={isLoggingIn}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••••••"
          value={password}
          error={errors.password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          disabled={isLoggingIn}
        />

        <div className="flex justify-between items-center w-full text-sm -mt-1 select-none">
          <Link
            href="/forgot-password"
            className="text-primary-solid font-bold text-xs xl:text-sm hover:text-primary-hover transition-colors ml-auto"
          >
            Forgot password?
          </Link>
        </div>

        <div className="w-full mt-2">
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            fullWidth
            className="h-12.5 text-white font-bold text-base bg-secondary hover:bg-secondary-hover focus:ring-secondary/30 transition-all shadow-lg cursor-pointer"
            loading={isLoggingIn}
          >
            Sign In
          </Button>
        </div>

        <div className="w-full flex items-center gap-4 my-3 select-none">
          <div className="flex-1 h-[1.5px] bg-border-gray" />
          <span className="text-neutral-secondary text-xs xl:text-sm font-medium whitespace-nowrap">
            or continue with
          </span>
          <div className="flex-1 h-[1.5px] bg-border-gray" />
        </div>

        <div className="relative w-full overflow-hidden rounded-lg">
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            disabled={isLoggingIn || isGooglePending}
            leftIcon={
              <Image
                src={ASSETS_URL.googleIcon}
                alt="Google"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            }
            className="h-12.5 text-text-dark font-medium text-sm xl:text-base cursor-pointer"
          >
            {isGooglePending ? "Connecting to Google..." : "Continue with Google"}
          </Button>
          <div className="absolute inset-0 opacity-0 overflow-hidden cursor-pointer [&>div]:w-full! [&>div>iframe]:w-full! [&>div>iframe]:h-full! [&>div>iframe]:scale-150!">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                toast({
                  type: "error",
                  title: "Google Sign-In Cancelled",
                  description: "Google sign-in was cancelled or encountered an issue.",
                })
              }
              width={400}
              shape="rectangular"
              size="large"
            />
          </div>
        </div>

        <div className="w-full text-center mt-3 text-sm select-none">
          <span className="text-neutral-secondary font-normal">
            Don&apos;t have an account?
          </span>
          <Link
            href="/register"
            className="text-primary-solid font-bold ml-1 hover:text-primary-hover transition-colors"
          >
            Register
          </Link>
        </div>
      </form>
    </motion.div>
  );
};
