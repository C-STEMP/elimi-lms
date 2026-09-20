import React from "react";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import type { RecentEnrollmentItem, EnrollmentStatus } from "../../types/overview";

export interface RecentEnrollmentsTableProps {
  readonly enrollments?: readonly RecentEnrollmentItem[];
  readonly viewAllHref?: string;
}

const getStatusBadge = (status: EnrollmentStatus) => {
  switch (status) {
    case "Successful":
      return "bg-[#DCFCE7] text-[#166534]";
    case "Pending":
      return "bg-[#FEF3C7] text-[#B45309]";
    case "Failed":
      return "bg-[#FEE2E2] text-[#991B1B]";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const RecentEnrollmentsTable: React.FC<RecentEnrollmentsTableProps> = ({
  enrollments = [],
  viewAllHref = "/admin/enrollment",
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col justify-between select-none h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-neutral-primary tracking-tight">
          Enrollment
        </h2>

        <Link
          href={viewAllHref}
          className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-0.5 transition-colors"
        >
          <span>View All</span>
          <LuChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="p-8 text-center text-xs text-neutral-secondary">
          No recent enrollments recorded.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-neutral-secondary text-xs font-bold rounded-lg">
                <th className="py-2.5 px-3 rounded-l-lg">Learner&apos;s Name</th>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3">Amount Paid</th>
                <th className="py-2.5 px-3 rounded-r-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
              {enrollments.map((row, idx) => (
              <tr key={`${row.id}-${idx}`} className="hover:bg-gray-50/50">
                <td className="py-3 px-3 font-semibold text-neutral-primary">
                  {row.learnerName}
                </td>
                <td className="py-3 px-3 text-neutral-secondary">
                  {row.course}
                </td>
                <td className="py-3 px-3 font-bold text-neutral-primary">
                  {row.amountPaid}
                </td>
                <td className="py-3 px-3 text-right">
                  <span
                    className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};
