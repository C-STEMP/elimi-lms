import React from "react";

/** Learner's name on the certificate, with an underline rule. */
export const CertificateName: React.FC<{ fullname?: string }> = ({ fullname }) => (
  <div className="flex flex-col items-center gap-2">
    <h3 className="text-5xl font-serif italic font-semibold text-primary-solid capitalize text-center leading-tight px-4">
      {fullname || "Learner"}
    </h3>
    <span className="block h-0.5 w-[60%] bg-secondary" />
  </div>
);
