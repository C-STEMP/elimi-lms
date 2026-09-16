"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiX, FiEye } from "react-icons/fi";
import { ASSETS_URL } from "@/assets";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/toast";
import { useDeleteAccount } from "@/features/auth/hooks";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deleteAccount(
      password.trim() ? { password } : { confirm: true },
      {
        onSuccess: () => {
          toast({
            type: "success",
            title: "Account Deleted",
            description: "Your account has been deactivated.",
          });
          router.push("/login");
        },
        onError: (error) => {
          toast({
            type: "error",
            title: "Deletion Failed",
            description: error.message || "Unable to delete your account right now.",
          });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center flex flex-col items-center select-text"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            setPassword("");
            onClose();
          }}
          aria-label="Close modal"
          className="mb-4 w-11 h-11 rounded-xl bg-primary/10 text-primary hover:bg-[#FBE8ED] flex items-center justify-center transition-colors cursor-pointer"
        >
          <FiX className="w-6 h-6 stroke-[2.5]" />
        </button>

        <div className="flex justify-center mb-4">
          <Image
            src={ASSETS_URL.logoIcon2}
            alt="Elimi Logo"
            width={85}
            height={48}
            className="w-auto h-9 object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-primary mb-2 tracking-tight">
          Delete Account
        </h3>

        <p className="text-xs sm:text-sm lg:text-base text-neutral-secondary leading-relaxed max-w-xs mb-6 font-normal">
          Permanently deactivate your account and anonymize your login info.
          This cannot be undone.
        </p>

        <form onSubmit={handleSubmit} noValidate className="w-full text-left flex flex-col gap-2">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isPending}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-1"
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
          />
          <span className="text-[11px] text-neutral-secondary -mt-1">
            Signed up with Google? Leave this blank.
          </span>

          <button
            type="submit"
            disabled={isPending}
            className="bg-border-secondary hover:bg-[#A81C19] active:scale-98 text-white font-bold w-full py-3.5 rounded-xl shadow-lg transition-all cursor-pointer text-sm sm:text-base mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Deleting..." : "Delete Account"}
          </button>
        </form>
      </div>
    </div>
  );
};
