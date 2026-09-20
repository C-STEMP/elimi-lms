import React from "react";

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
        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Type Here"
            className="w-full px-4 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Type Here"
            className="w-full px-4 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};
