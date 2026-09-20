import React from "react";
import { LuPlus, LuFileText } from "react-icons/lu";

export interface EnrollmentTopActionsProps {
  onExport: () => void;
  onEnrol: () => void;
}

export const EnrollmentTopActions: React.FC<EnrollmentTopActionsProps> = ({
  onExport,
  onEnrol,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-3.5 flex items-center justify-end gap-3 select-none">
      <button
        type="button"
        onClick={onExport}
        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-secondary text-secondary hover:bg-amber-50 font-semibold text-xs transition-colors cursor-pointer"
      >
        <span>Export</span>
        <LuFileText className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={onEnrol}
        className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
      >
        <span>Enrol</span>
        <LuPlus className="w-4 h-4" />
      </button>
    </div>
  );
};
