"use client";

import React from "react";
import {
  FiFileText,
  FiPlayCircle,
  FiHelpCircle,
  FiClipboard,
  FiPackage,
  FiCheckCircle,
  FiLock,
  FiCircle,
} from "react-icons/fi";
import type { CourseOutlineItem, CourseOutlineModule } from "@/features/courses/types";
import type { ItemType } from "@/shared/types";

const ITEM_TYPE_ICON: Record<ItemType, React.ElementType> = {
  native_lesson: FiFileText,
  video: FiPlayCircle,
  quiz: FiHelpCircle,
  assignment: FiClipboard,
  scorm_package: FiPackage,
};

const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  native_lesson: "Lesson",
  video: "Video",
  quiz: "Quiz",
  assignment: "Assignment",
  scorm_package: "SCORM",
};

export interface CurriculumListProps {
  modules: CourseOutlineModule[];
  mode?: "preview" | "interactive";
  selectedItemId?: string;
  onSelectItem?: (item: CourseOutlineItem) => void;
}

export const CurriculumList: React.FC<CurriculumListProps> = ({
  modules,
  mode = "preview",
  selectedItemId,
  onSelectItem,
}) => {
  const interactive = mode === "interactive";

  return (
    <div className="flex flex-col gap-4">
      {modules.map((module, moduleIndex) => (
        <div key={module.id} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-1">
            {interactive && module.locked && (
              <FiLock className="w-3.5 h-3.5 text-neutral-secondary shrink-0" />
            )}
            <h3
              className={`text-xs font-bold uppercase tracking-wide ${
                interactive && module.locked ? "text-neutral-secondary/70" : "text-neutral-secondary"
              }`}
            >
              Module {moduleIndex + 1}: {module.title}
            </h3>
          </div>

          <div className="flex flex-col gap-1">
            {module.items.map((item) => {
              const Icon = ITEM_TYPE_ICON[item.type];
              const isLocked = interactive && Boolean(item.locked);
              const isCompleted = item.progressStatus === "completed";
              const isSelected = interactive && selectedItemId === item.id;
              const clickable = interactive && !isLocked && Boolean(onSelectItem);

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onSelectItem?.(item)}
                  className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    clickable ? "cursor-pointer" : "cursor-default"
                  } ${
                    isSelected
                      ? "bg-primary-solid/10"
                      : clickable
                        ? "hover:bg-input-bg"
                        : ""
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? "text-primary-solid" : isLocked ? "text-neutral-secondary/50" : "text-neutral-secondary"
                    }`}
                  />
                  <span className="flex-1 min-w-0">
                    <span
                      className={`block text-sm font-medium truncate ${
                        isSelected ? "text-primary-solid" : isLocked ? "text-neutral-secondary/60" : "text-text-dark"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="block text-[11px] text-neutral-secondary/80">
                      {ITEM_TYPE_LABEL[item.type]}
                    </span>
                  </span>

                  {interactive &&
                    (isLocked ? (
                      <FiLock className="w-3.5 h-3.5 text-neutral-secondary/50 shrink-0" />
                    ) : isCompleted ? (
                      <FiCheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <FiCircle className="w-4 h-4 text-neutral-secondary/40 shrink-0" />
                    ))}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
