"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LuEllipsisVertical } from "react-icons/lu";
import type { AdminLearnerItem } from "../../types/learners";

export interface LearnersTableRowProps {
  learner: AdminLearnerItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSuspend: (id: string) => void;
}

export const LearnersTableRow: React.FC<LearnersTableRowProps> = ({
  learner,
  isSelected,
  onToggleSelect,
  onSuspend,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-xs text-neutral-primary">
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(learner.id)}
          aria-label={`Select ${learner.name}`}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
        />
      </td>

      <td className="py-4 px-3 text-neutral-secondary font-medium">
        {learner.serialNo}
      </td>

      <td className="py-4 px-4 font-semibold">
        <Link
          href={`/admin/learners/${learner.id}`}
          className="underline decoration-neutral-primary/40 hover:text-primary hover:decoration-primary transition-colors"
        >
          {learner.name}
        </Link>
      </td>

      <td className="py-4 px-4 text-neutral-secondary">
        {learner.email}
      </td>

      <td className="py-4 px-4 font-medium text-neutral-primary">
        {learner.course}
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[11px] w-8">
            {learner.completionRate}%
          </span>
          <div className="w-20 sm:w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary-solid h-full rounded-full transition-all"
              style={{ width: `${learner.completionRate}%` }}
            />
          </div>
        </div>
      </td>

      <td className="py-4 px-4 text-neutral-secondary whitespace-nowrap">
        {learner.enrolledDate}
      </td>

      <td className="py-4 px-4 text-center relative">
        {learner.status === "suspended" ? (
          <span className="text-rose-600 font-semibold text-xs">
            Suspended
          </span>
        ) : (
          <div className="inline-block relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Learner actions"
              className="p-1 hover:text-neutral-primary text-gray-400 transition-colors cursor-pointer"
            >
              <LuEllipsisVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-100 shadow-md rounded-xl py-1 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onSuspend(learner.id);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-medium"
                  >
                    Suspend
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};
