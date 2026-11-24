import { lmsClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type {
  CheckoutResult,
  Enrollment,
  EnrollmentDetail,
  EnrollmentsQuery,
  LevelEnrollment,
} from "@/features/enrollments/types";
import type { PaginationParams } from "@/shared/types";

export function getMyEnrollments(params?: EnrollmentsQuery) {
  return unwrapList<Enrollment>(lmsClient.get("/enrollments/mine", { params }));
}

export function getMyLevelEnrollments(params?: PaginationParams) {
  return unwrapList<LevelEnrollment>(
    lmsClient.get("/level-enrollments/mine", { params }),
  );
}

export function createEnrollment(courseId: string) {
  return unwrapItem<Enrollment>(lmsClient.post(`/courses/${courseId}/enrollments`));
}

export function getEnrollment(enrollmentId: string) {
  return unwrapItem<EnrollmentDetail>(lmsClient.get(`/enrollments/${enrollmentId}`));
}

export function checkoutEnrollment(enrollmentId: string) {
  return unwrapItem<CheckoutResult>(
    lmsClient.post(`/enrollments/${enrollmentId}/checkout`)
  );
}
