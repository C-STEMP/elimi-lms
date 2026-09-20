import React from "react";
import { StaffTableHeader } from "./staff-table-header";
import { StaffTableRow } from "./staff-table-row";
import type { AdminStaffItem } from "../../types/staff";

export interface StaffTableProps {
  staffList: AdminStaffItem[];
}

export const StaffTable: React.FC<StaffTableProps> = ({ staffList }) => {
  if (staffList.length === 0) {
    return (
      <div className="p-12 text-center text-neutral-secondary text-xs">
        No staff members found matching your search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse">
        <StaffTableHeader />
        <tbody className="divide-y divide-gray-50">
          {staffList.map((item) => (
            <StaffTableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
