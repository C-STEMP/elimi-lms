"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RoleOptionCard } from "./role-option-card";
import { roleStorage } from "@/shared/lib/role-storage";
import type { LmsPersonaType } from "@/shared/types";

type RoleOption = {
  id: LmsPersonaType;
  title: string;
  description: string;
  disabled?: boolean;
  badge?: string;
};

const ROLES: RoleOption[] = [
  {
    id: "learner",
    title: "Learner",
    description: "Build skills, get certified, and grow your career.",
  },
  {
    id: "instructor",
    title: "Instructor",
    description: "Create courses and share your expertise with learners.",
    disabled: true,
    badge: "Coming soon",
  },
];

export const SelectRoleForm: React.FC = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<LmsPersonaType | null>(null);

  const handleSelectRole = (roleId: string) => {
    const role = roleId as LmsPersonaType;
    setSelectedRole(role);
    roleStorage.setRole(role);
    setTimeout(() => router.push("/register"), 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-110 mx-auto flex flex-col justify-center select-text"
    >
      <div className="mb-6 text-left">
        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-neutral-primary">
          Select Your Role
        </h1>
        <p className="text-neutral-secondary text-xs xl:text-sm font-normal mt-1">
          Choose one.
        </p>
      </div>

      <div className="w-full flex flex-col gap-3 xl:gap-4">
        {ROLES.map((role, idx) => (
          <RoleOptionCard
            key={role.id}
            id={role.id}
            index={idx}
            title={role.title}
            description={role.description}
            isSelected={selectedRole === role.id}
            disabled={role.disabled}
            badge={role.badge}
            onSelect={handleSelectRole}
          />
        ))}
      </div>
    </motion.div>
  );
};
