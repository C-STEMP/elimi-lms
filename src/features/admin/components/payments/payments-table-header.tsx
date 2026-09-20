import React from "react";

export const PaymentsTableHeader: React.FC = () => {
  return (
    <thead>
      <tr className="bg-input-bg/60 border-b border-gray-100 text-left text-xs font-semibold text-neutral-primary select-none">
        <th className="py-3.5 px-4">Candidate Name</th>
        <th className="py-3.5 px-4">Course</th>
        <th className="py-3.5 px-4">Amount Paid</th>
        <th className="py-3.5 px-4 text-center">Status</th>
        <th className="py-3.5 px-4 text-center w-24">Action</th>
      </tr>
    </thead>
  );
};
