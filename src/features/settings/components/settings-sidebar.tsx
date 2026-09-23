"use client";

import React, { useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { Avatar } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/toast";
import { useUploadFile } from "@/features/storage/hooks";
import type { SettingsTab } from "@/features/settings/types";

interface SettingsSidebarProps {
  avatarSrc: string | null;
  onAvatarChange: (url: string) => void;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onOpenDeleteModal: () => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  avatarSrc,
  onAvatarChange,
  activeTab,
  onTabChange,
  onOpenDeleteModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    onAvatarChange(localPreview);

    uploadFile(
      { file, purpose: "profile_photo" },
      {
        onSuccess: (asset) => {
          onAvatarChange(asset.url);
          // Note: passportAssetId/passportUrl aren't part of the onboarding
          // API contract (backend rejects them as unrecognized keys), so the
          // photo isn't persisted server-side yet — only shown for this
          // session.
          toast({
            type: "info",
            title: "Photo Uploaded",
            description: "Profile photo uploaded.",
          });
        },
        onError: () => {
          toast({
            type: "error",
            title: "Upload Failed",
            description: "Couldn't upload that photo. Please try again.",
          });
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-lg border border-gray-100/80 flex flex-col gap-6 w-full lg:w-72 shrink-0">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-3.5">
        <Avatar
          src={avatarSrc}
          shape="rounded"
          className="w-20 h-20 border border-gray-100 shadow-xs shrink-0"
          alt="User Avatar"
        />

        <div className="flex flex-col items-start justify-center gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-primary font-sans hover:bg-[#721328] text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-60"
            title="Upload image"
          >
            <FiUpload className="w-3 h-3" />
            <span>{isUploading ? "Uploading..." : "Upload"}</span>
          </button>
          <span className="text-[10px] font-sans text-[#191913] font-medium">
            JPG or PNG
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 lg:gap-6 pt-2">
        <button
          type="button"
          onClick={() => onTabChange("profile")}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-primary/10 text-black font-semibold shadow-2xs"
              : "text-black font-medium hover:bg-gray-50"
          }`}
        >
          Profile Information
        </button>

        <button
          type="button"
          onClick={() => onTabChange("security")}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-primary/10 text-black font-semibold shadow-2xs"
              : "text-black font-medium hover:bg-gray-50"
          }`}
        >
          Security
        </button>

        <button
          type="button"
          onClick={onOpenDeleteModal}
          className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-border-secondary hover:bg-red-50 transition-all cursor-pointer"
        >
          Delete Account
        </button>
      </nav>
    </div>
  );
};
