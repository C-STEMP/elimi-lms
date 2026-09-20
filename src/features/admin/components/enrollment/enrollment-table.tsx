import React from "react";
import { EnrollmentTableHeader } from "./enrollment-table-header";
import { EnrollmentTableRow } from "./enrollment-table-row";
import type { AdminEnrollmentItem } from "../../types/enrollment";

export interface EnrollmentTableProps {
  enrollments: AdminEnrollmentItem[];
}

export const EnrollmentTable: React.FC<EnrollmentTableProps> = ({ enrollments }) => {
  if (enrollments.length === 0) {
    return (
      <div className="p-12 text-center text-neutral-secondary text-xs">
        No enrollments found matching your search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse">
        <EnrollmentTableHeader />
        <tbody className="divide-y divide-gray-50">
          {enrollments.map((item) => (
            <EnrollmentTableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
