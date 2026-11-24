export type CertificateStatus = "issued" | "revoked";

export type LmsCertificate = {
  id: string;
  enrollmentId: string;
  courseId: string;
  courseTitle?: string;
  learnerLmsUserId: string;
  status: CertificateStatus;
  /** Orchestrator storage assetId for the PDF/image; resolve the URL via OL. */
  assetId?: string | null;
  issuedAt: string;
  revokedAt?: string | null;
};

export type LmsLevelCertificate = {
  id: string;
  levelEnrollmentId?: string;
  offeringId?: string;
  offeringTitle?: string;
  qualificationLevelId?: string;
  tradeId?: string;
  tradeName?: string;
  level?: number;
  title?: string;
  learnerLmsUserId?: string;
  status: CertificateStatus;
  assetId?: string | null;
  issuedAt: string;
  revokedAt?: string | null;
};

/** Sponsoring organisation / programme shown on a certificate (optional). */
export type CertificateOrganization = {
  name: string;
  programmeDetails: {
    name?: string;
    /** Partner logo URLs rendered next to the ELIMI logo. */
    logos: string[];
    signatories: {
      /** Programme coordinator signature image URL. */
      coordinator?: string;
    };
  };
};

/** Everything the printable certificate template needs. */
export type CertificateRenderData = {
  certificateId: string;
  dateOfCompletion: string;
  user: { fullName: string };
  course: {
    name: string;
    instructors: { fullName?: string }[];
  };
  organization?: CertificateOrganization | null;
};
