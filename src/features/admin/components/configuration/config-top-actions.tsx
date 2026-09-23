"use client";

import React from "react";
import { LuSave } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";

export interface ConfigTopActionsProps {
  onSave: () => void;
  isSaving?: boolean;
}

export const ConfigTopActions: React.FC<ConfigTopActionsProps> = ({
  onSave,
  isSaving = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-3.5 flex items-center justify-end select-none">
      <Button
        variant="secondary"
        size="md"
        loading={isSaving}
        onClick={onSave}
        rightIcon={<LuSave className="w-4 h-4" />}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};
