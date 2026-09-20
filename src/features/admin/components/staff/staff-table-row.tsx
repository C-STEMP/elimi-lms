"use client";

import React from "react";
import { LuEllipsisVertical } from "react-icons/lu";
import type { AdminStaffItem } from "../../types/staff";

export interface StaffTableRowProps {
  item: AdminStaffItem;
}

export const StaffTableRow: React.FC<StaffTableRowProps> = ({ item }) => {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-xs text-neutral-primary">
      <td className="py-4 px-4 font-semibold text-neutral-primary">
        {item.name}
      </td>

      <td className="py-4 px-4 text-neutral-secondary">
        {item.email}
      </td>

      <td className="py-4 px-4 font-medium text-neutral-primary">
        {item.role}
      </td>

      <td className="py-4 px-4 text-neutral-secondary whitespace-nowrap">
        {item.date}
      </td>

      <td className="py-4 px-4 text-center">
        <button
          type="button"
          aria-label="Staff actions"
          className="p-1 hover:text-neutral-primary text-gray-400 transition-colors cursor-pointer"
        >
          <LuEllipsisVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
