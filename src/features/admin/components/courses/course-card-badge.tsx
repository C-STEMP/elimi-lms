import React from "react";

export interface CourseCardBadgeProps {
  status: "published" | "draft";
}

export const CourseCardBadge: React.FC<CourseCardBadgeProps> = ({ status }) => {
  if (status === "published") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#dcfce7] text-[#15803d]">
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#e2e8f0] text-[#475569]">
      Draft
    </span>
  );
};
