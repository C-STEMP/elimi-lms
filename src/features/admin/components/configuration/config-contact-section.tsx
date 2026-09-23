"use client";

import React from "react";
import { Input } from "@/shared/components/ui/input";

export interface ConfigContactSectionProps {
  email: string;
  onEmailChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
}

export const ConfigContactSection: React.FC<ConfigContactSectionProps> = ({
  email,
  onEmailChange,
  phone,
  onPhoneChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-neutral-primary">
        Contact Information
      </h2>

      <div className="space-y-4 max-w-4xl">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Type Here"
        />

        <Input
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Type Here"
        />
      </div>
    </div>
  );
};
