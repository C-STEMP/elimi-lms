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
export function isUserStaffOrAdmin(me: LmsMe | undefined | null): boolean {
  if (!me) return false;
  const anyMe = me as Record<string, unknown>;

  // 1. Explicit staffRole
  if (
    Boolean(me.staffRole) ||
    anyMe.staffRole === "admin" ||
    anyMe.staffRole === "content_manager" ||
    anyMe.staffRole === "support"
  ) {
    return true;
  }

  // 2. Persona check ("staff", "admin", "administrator")
  if (
    Array.isArray(me.personas) &&
    me.personas.some((p) => {
      const personaVal = String(p.persona || "").toLowerCase();
      const roleVal = String((p as Record<string, unknown>).role || "").toLowerCase();
      return (
        personaVal === "staff" ||
        personaVal === "admin" ||
        personaVal === "administrator" ||
        roleVal === "admin" ||
        roleVal === "staff"
      );
    })
  ) {
    return true;
  }

  // 3. Direct role/admin properties
  if (
    anyMe.role === "admin" ||
    anyMe.role === "staff" ||
    anyMe.role === "super_admin" ||
    anyMe.isAdmin === true ||
    anyMe.isStaff === true
  ) {
    return true;
  }

  // 4. Roles array
  if (
    Array.isArray(anyMe.roles) &&
    anyMe.roles.some((r) =>
      ["admin", "staff", "super_admin"].includes(String(r).toLowerCase())
    )
  ) {
    return true;
  }

  // 5. Capabilities check
  if (
    Array.isArray(me.capabilities) &&
    me.capabilities.some((c: string) => {
      const cap = String(c).toLowerCase();
      return (
        cap.includes("admin") ||
        cap.includes("course.content.edit") ||
        cap.includes("course.publish") ||
        cap.includes("entitlement.grant")
      );
    })
  ) {
    return true;
  }

  return false;
}

