"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
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
    <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
      <DashboardNav title="Settings" rightAction={null} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1"
      >
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
      </motion.div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
