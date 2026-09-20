"use client";

import React from "react";
import { LuEllipsisVertical } from "react-icons/lu";
import type { AdminEnrollmentItem } from "../../types/enrollment";

export interface EnrollmentTableRowProps {
  item: AdminEnrollmentItem;
}

export const EnrollmentTableRow: React.FC<EnrollmentTableRowProps> = ({ item }) => {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-xs text-neutral-primary">
      <td className="py-4 px-4 text-neutral-secondary whitespace-nowrap">
        {item.date}
      </td>

      <td className="py-4 px-4 font-semibold text-neutral-primary">
        {item.organizationName}
      </td>

      <td className="py-4 px-4 text-neutral-secondary">
        {item.email}
      </td>

      <td className="py-4 px-4 font-medium">
        {item.numberOfStudents}
      </td>

      <td className="py-4 px-4 font-medium">
        {item.slotsAvailable}
      </td>

      <td className="py-4 px-4 font-medium text-neutral-primary">
        {item.course}
      </td>

      <td className="py-4 px-4 text-center">
        <button
          type="button"
          aria-label="Enrollment actions"
          className="p-1 hover:text-neutral-primary text-gray-400 transition-colors cursor-pointer"
        >
          <LuEllipsisVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
