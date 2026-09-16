"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/toast";
import { PasswordRequirements } from "@/shared/components/ui/password-requirements";
import { StatusModal } from "@/shared/components/ui/status-modal";
import { validatePassword, validateConfirmPassword } from "@/shared/lib/validation";
import { useResetPassword } from "@/features/auth/hooks";

export const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const otp = searchParams.get("otp") ?? "";

  const { mutate: performReset, isPending } = useResetPassword();

  useEffect(() => {
    if (!email || !otp) {
      toast({
        type: "error",
        title: "Verification Required",
        description: "Please enter your verification code first.",
      });
      router.push(`/verify?email=${encodeURIComponent(email)}&purpose=password_reset`);
    }
    // Only re-check when the query params actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, otp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    if (passErr || confirmErr) {
      setErrors({ password: passErr || undefined, confirmPassword: confirmErr || undefined });
      toast({
        type: "error",
        title: "Validation Error",
        description: "Please check the highlighted fields.",
      });
      return;
    }

    setErrors({});
    performReset(
      { email, otp, purpose: "password_reset", newPassword: password },
      {
        onSuccess: () => setShowSuccessModal(true),
        onError: (error) => {
          toast({
            type: "error",
            title: error.status === 422 ? "Invalid Code" : "Reset Failed",
            description:
              error.status === 422
                ? "The code is incorrect or has expired."
                : error.message || "Unable to connect. Please try again.",
          });
          if (error.status === 422) {
            setTimeout(() => {
              router.push(`/verify?email=${encodeURIComponent(email)}&purpose=password_reset`);
            }, 1200);
          }
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
      <div className="mb-8 text-center lg:text-left w-full flex flex-col items-center lg:items-start">
        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-neutral-primary text-center lg:text-left">
          Reset Password
        </h1>
        <p className="text-neutral-secondary text-[14px] xl:text-[15px] leading-relaxed mt-2 max-w-sm font-normal text-center lg:text-left mx-auto lg:mx-0">
          Enter your new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col">
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••••••"
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
            disabled={isPending}
          />
          <PasswordRequirements password={password} />
        </div>

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••••••"
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
          disabled={isPending}
        />

        <div className="w-full mt-2">
          <Button
            type="submit"
            variant="secondary"
            size="md"
            fullWidth
            className="h-12.5 text-white! font-bold text-base bg-secondary hover:bg-secondary-hover focus:ring-secondary/30 transition-all shadow-lg cursor-pointer"
            loading={isPending}
          >
            Reset Password
          </Button>
        </div>

        <div className="w-full text-center mt-3 text-sm select-none">
          <span className="text-neutral-secondary font-normal">Go to</span>
          <Link
            href="/login"
            className="text-primary-solid font-bold ml-1 hover:text-primary-hover transition-colors"
          >
            Login
          </Link>
        </div>
      </form>

      <StatusModal
        isOpen={showSuccessModal}
        type="success"
        title="Congratulations"
        description="Your password has been changed successfully."
        actionLabel="Login"
        onAction={() => router.push("/login")}
      />
    </motion.div>
  );
};
