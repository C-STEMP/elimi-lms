import type { LmsMe } from "@/features/me/types";

/**
 * Portal access is granted by having a staff record — either a staff role,
 * or a "staff" persona (LmsPersonaType only ever has "learner" | "instructor"
 * | "staff", never a dedicated "admin" persona). `capabilities` is a set of
 * granular, feature-level permission grants (e.g. "course.content.edit")
 * that non-staff personas like instructors can also hold, so it must NOT be
 * used to decide admin-portal access.
 *
 * No "use client"/browser imports here on purpose — this same predicate runs
 * server-side (Route Handlers, session.ts) to compute the signed session's
 * `isStaffOrAdmin` flag, and client-side via `me/hooks/index.ts`.
 */
export function isUserStaffOrAdmin(me: LmsMe | undefined): boolean {
  if (!me) return false;
  return (
    Boolean(me.staffRole) ||
    Boolean(me.personas?.some((p) => p.persona === "staff"))
  );
}
