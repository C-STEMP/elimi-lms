"use client";

import React from "react";
import { Input } from "@/shared/components/ui/input";

export interface SponsoredOrgFieldsProps {
  organizationName: string;
  organizationEmail: string;
  onChangeName: (val: string) => void;
  onChangeEmail: (val: string) => void;
}

export const SponsoredOrgFields: React.FC<SponsoredOrgFieldsProps> = ({
  organizationName,
  organizationEmail,
  onChangeName,
  onChangeEmail,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Input
        label="Organization Name"
        type="text"
        value={organizationName}
        onChange={(e) => onChangeName(e.target.value)}
        placeholder="Type Here"
      />
      <Input
        label="Organization Email"
        type="email"
        value={organizationEmail}
        onChange={(e) => onChangeEmail(e.target.value)}
        placeholder="Type Here"
      />
    </div>
  );
};
