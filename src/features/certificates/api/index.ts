import { lmsClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type { PaginationParams } from "@/shared/types";
import type { LmsCertificate, LmsLevelCertificate } from "@/features/certificates/types";

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

export function getMyLevelCertificates(params?: PaginationParams) {
  return unwrapList<LmsLevelCertificate>(
    lmsClient.get("/level-certificates/mine", { params })
  );
}

export function getLevelCertificate(certificateId: string) {
  return unwrapItem<LmsLevelCertificate>(
    lmsClient.get(`/level-certificates/${certificateId}`)
  );
}

export function getLevelEnrollmentCertificate(levelEnrollmentId: string) {
  return unwrapItem<LmsLevelCertificate>(
    lmsClient.get(`/level-enrollments/${levelEnrollmentId}/certificate`)
  );
}
