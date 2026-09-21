"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { SettingsSidebar } from "./settings-sidebar";
import { PersonalInfoTab } from "./personal-info-tab";
import { SecurityTab } from "./security-tab";
import { DeleteAccountModal } from "./delete-account-modal";
import { useOnboarding } from "@/features/onboarding/hooks";
import { useMe } from "@/features/me/hooks";
import type { SettingsTab } from "@/features/settings/types";
import type { LearnerOnboardingPayload } from "@/features/onboarding/types";
import type { LmsPersonaType } from "@/shared/types";

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: me } = useMe();
  const persona: LmsPersonaType = me?.personas?.[0]?.persona || "learner";
  const { data: onboarding } = useOnboarding(persona);
  const payload = onboarding?.data as LearnerOnboardingPayload | undefined;
  const savedAvatar =
    payload?.passportUrl || payload?.personalDetails?.passportUrl || null;

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    if (savedAvatar && !avatarSrc) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarSrc(savedAvatar);
    }
  }, [savedAvatar, avatarSrc]);

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
