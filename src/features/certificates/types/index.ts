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
