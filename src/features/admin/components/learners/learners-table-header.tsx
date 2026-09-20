import React from "react";

export interface LearnersTableHeaderProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}

export const LearnersTableHeader: React.FC<LearnersTableHeaderProps> = ({
  isAllSelected,
  onToggleSelectAll,
}) => {
  return (
    <thead>
      <tr className="bg-input-bg/60 border-b border-gray-100 text-left text-xs font-semibold text-neutral-primary select-none">
        <th className="py-3.5 px-4 w-12">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            aria-label="Select all learners"
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
          />
        </th>
        <th className="py-3.5 px-3 w-16">S/N</th>
        <th className="py-3.5 px-4">Learners Name</th>
        <th className="py-3.5 px-4">Email</th>
        <th className="py-3.5 px-4">Course</th>
        <th className="py-3.5 px-4">Completion Rate</th>
        <th className="py-3.5 px-4">Enrolled</th>
        <th className="py-3.5 px-4 text-center w-20">Action</th>
      </tr>
    </thead>
  );
};
