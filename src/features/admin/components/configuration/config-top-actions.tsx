import React from "react";
import { LuSave } from "react-icons/lu";

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
      <button
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
      >
        <span>{isSaving ? "Saving..." : "Save"}</span>
        <LuSave className="w-4 h-4" />
      </button>
    </div>
  );
};
