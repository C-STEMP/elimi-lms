import { lmsClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type { PaginationParams } from "@/shared/types";
import type { LmsCertificate } from "@/features/certificates/types";

export function getMyCertificates(params?: PaginationParams) {
  return unwrapList<LmsCertificate>(lmsClient.get("/certificates/mine", { params }));
}

export function getCertificate(certificateId: string) {
  return unwrapItem<LmsCertificate>(lmsClient.get(`/certificates/${certificateId}`));
}

export function getEnrollmentCertificate(enrollmentId: string) {
  return unwrapItem<LmsCertificate>(
    lmsClient.get(`/enrollments/${enrollmentId}/certificate`)
  );
}
