"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SettingsSidebar } from "./settings-sidebar";
import { PersonalInfoTab } from "./personal-info-tab";
import { SecurityTab } from "./security-tab";
import { DeleteAccountModal } from "./delete-account-modal";
import type { SettingsTab } from "@/features/settings/types";

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full flex flex-col min-h-screen"
    >
      <div className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <h1 className="text-2xl font-extrabold text-neutral-primary tracking-tight mb-6">
          Settings
        </h1>

        <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
          <SettingsSidebar
            avatarSrc={avatarSrc}
            onAvatarChange={setAvatarSrc}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
          />

          <main className="flex-1 w-full min-w-0">
            {activeTab === "profile" ? <PersonalInfoTab /> : <SecurityTab />}
          </main>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </motion.div>
  );
};
