import React from "react";
import { LearnersTableHeader } from "./learners-table-header";
import { LearnersTableRow } from "./learners-table-row";
import type { AdminLearnerItem } from "../../types/learners";

export interface LearnersTableProps {
  learners: AdminLearnerItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectLearner: (id: string) => void;
  onSuspend: (id: string) => void;
}

export const LearnersTable: React.FC<LearnersTableProps> = ({
  learners,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectLearner,
  onSuspend,
}) => {
  const isAllSelected = learners.length > 0 && selectedIds.length === learners.length;

  if (learners.length === 0) {
    return (
      <div className="p-12 text-center text-neutral-secondary text-xs">
        No candidates found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse">
        <LearnersTableHeader
          isAllSelected={isAllSelected}
          onToggleSelectAll={onToggleSelectAll}
        />
        <tbody className="divide-y divide-gray-50">
          {learners.map((learner) => (
            <LearnersTableRow
              key={learner.id}
              learner={learner}
              isSelected={selectedIds.includes(learner.id)}
              onToggleSelect={onToggleSelectLearner}
              onSuspend={onSuspend}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
