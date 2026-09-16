"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/toast";
import { PasswordRequirements } from "@/shared/components/ui/password-requirements";
import { ASSETS_URL } from "@/assets";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/shared/lib/validation";
import { useRegister, useLoginWithGoogle } from "@/features/auth/hooks";

export const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { toast } = useToast();
  const router = useRouter();
  const { mutate: registerUser, isPending } = useRegister();
  const { mutate: loginWithGoogle, isPending: isGooglePending } = useLoginWithGoogle();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    if (emailErr || passErr || confirmErr) {
      setErrors({
        email: emailErr || undefined,
        password: passErr || undefined,
        confirmPassword: confirmErr || undefined,
      });
      toast({
        type: "error",
        title: "Validation Error",
        description: "Please check the highlighted fields below.",
      });
      return;
    }

    setErrors({});
    registerUser(
      { email, password, intents: ["lms"] },
      {
        onSuccess: () => {
          toast({
            type: "info",
            title: "Check Your Email",
            description: "We've sent a 4-digit verification code to your email address.",
          });
          router.push(`/verify?email=${encodeURIComponent(email)}`);
        },
        onError: (error) => {
          if (error.status === 409) {
            toast({
              type: "error",
              title: "Email Already Registered",
              description: "This email is already in use. Try signing in instead.",
            });
            return;
          }
          toast({
            type: "error",
            title: error.status === 422 ? "Validation Error" : "Registration Failed",
            description: error.message || "Unable to connect. Please try again.",
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
      { idToken: credentialResponse.credential, provider: "google", intents: ["lms"] },
      {
        onSuccess: (data) => {
          toast({
            type: "success",
            title: data.isNewUser ? "Welcome!" : "Welcome Back!",
            description: `Signed in as ${data.user.email}`,
          });
          router.push("/");
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-110 mx-auto flex flex-col justify-center select-text"
    >
      <div className="mb-6 text-center lg:text-left w-full flex flex-col items-center lg:items-start">
        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-neutral-primary text-center lg:text-left">
          Create your account
        </h1>
        <p className="text-neutral-secondary text-[14px] xl:text-[15px] leading-relaxed mt-1 max-w-sm font-normal text-center lg:text-left mx-auto lg:mx-0">
          Join learners building verified, certified skills.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <Input
          label={
            <span>
              Email Address<span className="text-primary-solid ml-0.5">*</span>
            </span>
          }
          type="email"
          name="email"
          placeholder="yourname@email.com"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          disabled={isPending}
        />

        <div className="w-full flex flex-col">
          <Input
            label={
              <span>
                Password<span className="text-primary-solid ml-0.5">*</span>
              </span>
            }
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••••"
            value={password}
            error={errors.password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              if (confirmPassword) {
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword:
                    val !== confirmPassword ? "Passwords do not match" : undefined,
                }));
              }
            }}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none flex items-center justify-center p-1 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEye className="w-5 h-5 text-text-dark/70" />
                ) : (
                  <Image
                    src={ASSETS_URL.eyeClosedIcon}
                    alt="Hide password"
                    width={20}
                    height={20}
                    className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
                  />
                )}
              </button>
            }
            disabled={isPending}
          />
          <PasswordRequirements password={password} />
        </div>

        <Input
          label={
            <span>
              Confirm Password<span className="text-primary-solid ml-0.5">*</span>
            </span>
          }
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="••••••••••"
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => {
            const val = e.target.value;
            setConfirmPassword(val);
            setErrors((prev) => ({
              ...prev,
              confirmPassword:
                val && password && val !== password ? "Passwords do not match" : undefined,
            }));
          }}
          suffix={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="focus:outline-none flex items-center justify-center p-1 cursor-pointer"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <FiEye className="w-5 h-5 text-text-dark/70" />
              ) : (
                <Image
                  src={ASSETS_URL.eyeClosedIcon}
                  alt="Hide password"
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
                />
              )}
            </button>
          }
          disabled={isPending}
        />

        <div className="w-full">
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            fullWidth
            className="h-12.5 text-white font-bold text-base bg-secondary hover:bg-secondary-hover focus:ring-secondary/30 transition-all shadow-lg cursor-pointer"
            loading={isPending}
          >
            Create Account
          </Button>
        </div>

        <div className="w-full flex items-center gap-4 my-1 select-none">
          <div className="flex-1 h-px bg-border-gray/70" />
          <span className="text-neutral-secondary text-xs font-normal">or</span>
          <div className="flex-1 h-px bg-border-gray/70" />
        </div>

        <div className="relative w-full overflow-hidden rounded-lg">
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            disabled={isPending || isGooglePending}
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

        <div className="w-full text-center mt-2 text-sm select-none">
          <span className="text-neutral-secondary font-normal">Already have an account?</span>
          <Link
            href="/login"
            className="text-primary-solid font-bold ml-1 hover:text-primary-hover transition-colors"
          >
            Login
          </Link>
        </div>
      </form>
    </motion.div>
  );
};
