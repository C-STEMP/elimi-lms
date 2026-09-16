import { lmsClient } from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type {
  ItemLaunch,
  ItemProgressWrite,
  ProgressSnapshot,
  ScormCmiCommit,
  ScormSession,
} from "@/features/player/types";

export function launchItem(enrollmentId: string, itemId: string) {
  return unwrapItem<ItemLaunch>(
    lmsClient.post(`/enrollments/${enrollmentId}/items/${itemId}/launch`)
  );
}

export function recordItemProgress(
  enrollmentId: string,
  itemId: string,
  input: ItemProgressWrite
) {
  return unwrapItem<ProgressSnapshot>(
    lmsClient.post(`/enrollments/${enrollmentId}/items/${itemId}/progress`, input)
  );
}

export function getEnrollmentProgress(enrollmentId: string) {
  return unwrapItem<ProgressSnapshot>(
    lmsClient.get(`/enrollments/${enrollmentId}/progress`)
  );
}

export function getScormSession(sessionId: string) {
  return unwrapItem<ScormSession>(lmsClient.get(`/player/scorm/${sessionId}`));
}

export function commitScormCmi(sessionId: string, input: ScormCmiCommit) {
  return unwrapItem<ProgressSnapshot>(
    lmsClient.post(`/player/scorm/${sessionId}/cmi`, input)
  );
}
