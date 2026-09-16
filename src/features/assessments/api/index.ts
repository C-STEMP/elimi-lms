import { lmsClient } from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type {
  AssessmentAttempt,
  AssessmentPaper,
  AssessmentSubmitInput,
  AssessmentSubmitResult,
} from "@/features/assessments/types";

export function getItemAssessment(enrollmentId: string, itemId: string) {
  return unwrapItem<AssessmentPaper>(
    lmsClient.get(`/enrollments/${enrollmentId}/items/${itemId}/assessment`)
  );
}

export function startAttempt(enrollmentId: string, itemId: string) {
  return unwrapItem<AssessmentAttempt>(
    lmsClient.post(`/enrollments/${enrollmentId}/items/${itemId}/attempts`)
  );
}

export function getAttempt(enrollmentId: string, itemId: string, attemptId: string) {
  return unwrapItem<AssessmentAttempt>(
    lmsClient.get(`/enrollments/${enrollmentId}/items/${itemId}/attempts/${attemptId}`)
  );
}

export function submitAttempt(
  enrollmentId: string,
  itemId: string,
  attemptId: string,
  input: AssessmentSubmitInput
) {
  return unwrapItem<AssessmentSubmitResult>(
    lmsClient.post(
      `/enrollments/${enrollmentId}/items/${itemId}/attempts/${attemptId}/submit`,
      input
    )
  );
}
