import { lmsClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type { Invite, PaginationParams } from "@/shared/types";
import type { CreateInstructorInviteInput } from "@/features/instructors/types";

export function getInstructorInvites(params?: PaginationParams) {
  return unwrapList<Invite>(lmsClient.get("/instructors/invites", { params }));
}

export function createInstructorInvite(input: CreateInstructorInviteInput) {
  return unwrapItem<Invite>(lmsClient.post("/instructors/invites", input));
}
