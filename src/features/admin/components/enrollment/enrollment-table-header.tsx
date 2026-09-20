import React from "react";

export const EnrollmentTableHeader: React.FC = () => {
  return (
    <thead>
      <tr className="bg-input-bg/60 border-b border-gray-100 text-left text-xs font-semibold text-neutral-primary select-none">
        <th className="py-3.5 px-4">Date</th>
        <th className="py-3.5 px-4">Organization&apos;s Name</th>
        <th className="py-3.5 px-4">Email</th>
        <th className="py-3.5 px-4">No. Of Students</th>
        <th className="py-3.5 px-4">Slots Available</th>
        <th className="py-3.5 px-4">Course</th>
        <th className="py-3.5 px-4 text-center w-20">Action</th>
      </tr>
    </thead>
  );
};
