"use client";

import React from "react";
import { AdminHeader } from "../overview/admin-header";
import { ConfigTopActions } from "./config-top-actions";
import { ConfigContactSection } from "./config-contact-section";
import { ConfigPolicySection } from "./config-policy-section";
import { useAdminConfiguration } from "../../hooks/use-admin-configuration";

export const AdminConfigurationView: React.FC = () => {
  const { config, updateField, handleSave, isSaving } = useAdminConfiguration();

  return (
    <div className="flex-1 flex flex-col gap-4 pb-8">
      <AdminHeader title="Platform Configuration" />

      <ConfigTopActions onSave={handleSave} isSaving={isSaving} />

      <ConfigContactSection
        email={config.emailAddress}
        onEmailChange={(val) => updateField("emailAddress", val)}
        phone={config.phoneNumber}
        onPhoneChange={(val) => updateField("phoneNumber", val)}
      />

      <ConfigPolicySection
        title="Terms and Conditions"
        textValue={config.termsText}
        onTextChange={(val) => updateField("termsText", val)}
        file={config.termsFile}
        onFileChange={(file) => updateField("termsFile", file)}
        uploadLabel="Upload Terms & Conditions"
      />

      <ConfigPolicySection
        title="Privacy Policy"
        textValue={config.privacyText}
        onTextChange={(val) => updateField("privacyText", val)}
        file={config.privacyFile}
        onFileChange={(file) => updateField("privacyFile", file)}
        uploadLabel="Upload Privacy Policy"
      />

      <ConfigPolicySection
        title="Refund Policy"
        textValue={config.refundText}
        onTextChange={(val) => updateField("refundText", val)}
        file={config.refundFile}
        onFileChange={(file) => updateField("refundFile", file)}
        uploadLabel="Upload Refund Policy"
      />
    </div>
  );
};
