"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiEye } from "react-icons/fi";
import { Input } from "@/shared/components/ui/input";
import { PasswordRequirements } from "@/shared/components/ui/password-requirements";
import { useToast } from "@/shared/components/ui/toast";
import { ASSETS_URL } from "@/assets";
import { validatePassword } from "@/shared/lib/validation";
import { useChangePassword } from "@/features/auth/hooks";

export const ChangePasswordSection: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState<string | undefined>(undefined);

  const { toast } = useToast();
  const { mutate: changePassword, isPending } = useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast({
        type: "error",
        title: "Required Field",
        description: "Please enter your current password.",
      });
      return;
    }

    const passErr = validatePassword(newPassword);
    if (passErr) {
      toast({ type: "error", title: "Weak Password", description: passErr });
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError(undefined);

    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast({
            type: "success",
            title: "Password Updated",
            description: "Your password has been changed successfully.",
          });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error) => {
          toast({
            type: "error",
            title: error.status === 401 ? "Incorrect Password" : "Update Failed",
            description:
              error.status === 401
                ? "Your current password is incorrect."
                : error.message || "Unable to connect. Please try again.",
          });
        },
      }
    );
  };

  const eyeToggle = (shown: boolean, toggle: () => void, label: string) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-1"
    >
      {shown ? (
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
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-lg lg:text-2xl font-extrabold text-neutral-primary">
        Change Password
      </h2>

      <div className="flex flex-col gap-4">
        <Input
          label="Current Password"
          type={showCurrent ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="•••••••••"
          disabled={isPending}
          suffix={eyeToggle(showCurrent, () => setShowCurrent((v) => !v), "Toggle current password visibility")}
        />

        <div className="w-full flex flex-col">
          <Input
            label="New Password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (confirmError) setConfirmError(undefined);
            }}
            placeholder="•••••••••"
            disabled={isPending}
            suffix={eyeToggle(showNew, () => setShowNew((v) => !v), "Toggle new password visibility")}
          />
          <PasswordRequirements password={newPassword} />
        </div>

        <Input
          label="Confirm New Password"
          type={showConfirm ? "text" : "password"}
          value={confirmPassword}
          error={confirmError}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmError) setConfirmError(undefined);
          }}
          placeholder="•••••••••"
          disabled={isPending}
          suffix={eyeToggle(showConfirm, () => setShowConfirm((v) => !v), "Toggle confirm password visibility")}
        />
      </div>

      <div className="flex justify-end pt-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#fbab2a] hover:bg-[#e89b1f] active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Change Password"}
        </button>
      </div>
    </form>
  );
};
