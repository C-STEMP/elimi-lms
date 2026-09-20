import React from "react";

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
      <div>
        <label className="block text-xs font-semibold text-neutral-primary mb-1">
          Organization Name
        </label>
        <input
          type="text"
          value={organizationName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Type Here"
          className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-primary mb-1">
          Organization Email
        </label>
        <input
          type="email"
          value={organizationEmail}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder="Type Here"
          className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
};
