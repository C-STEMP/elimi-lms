import React from "react";
import { LuPlus } from "react-icons/lu";

export interface StaffTopActionsProps {
  onAddStaff: () => void;
}

export const StaffTopActions: React.FC<StaffTopActionsProps> = ({
  onAddStaff,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-3.5 flex items-center justify-end select-none">
      <button
        type="button"
        onClick={onAddStaff}
        className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
      >
        <span>Add Staff</span>
        <LuPlus className="w-4 h-4" />
      </button>
    </div>
  );
};
