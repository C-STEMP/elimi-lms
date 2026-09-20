"use client";

import { useState } from "react";
import { message } from "antd";
import { INITIAL_PLATFORM_CONFIG } from "../constants/configuration-data";
import type { PlatformConfigFormData } from "../types/configuration";

export function useAdminConfiguration() {
  const [config, setConfig] = useState<PlatformConfigFormData>(INITIAL_PLATFORM_CONFIG);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof PlatformConfigFormData>(
    field: K,
    val: PlatformConfigFormData[K]
  ) => {
    setConfig((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    message.success("Platform configuration saved successfully!");
  };

  return {
    config,
    updateField,
    handleSave,
    isSaving,
  };
}
