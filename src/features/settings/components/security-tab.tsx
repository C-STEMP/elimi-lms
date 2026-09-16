"use client";

import React from "react";
import { ChangePasswordSection } from "./change-password-section";

export const SecurityTab: React.FC = () => {
  return (
    <div className="bg-white rounded-[20px] p-6 lg:p-8 shadow-lg border border-gray-100/80 flex flex-col gap-8 w-full">
      <ChangePasswordSection />
    </div>
  );
};
