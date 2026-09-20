import React from "react";

export const StaffTableHeader: React.FC = () => {
  return (
    <thead>
      <tr className="bg-input-bg/60 border-b border-gray-100 text-left text-xs font-semibold text-neutral-primary select-none">
        <th className="py-3.5 px-4">Staff Name</th>
        <th className="py-3.5 px-4">Email</th>
        <th className="py-3.5 px-4">Role</th>
        <th className="py-3.5 px-4">Date</th>
        <th className="py-3.5 px-4 text-center w-20">Action</th>
      </tr>
    </thead>
  );
};
