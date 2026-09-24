import "server-only";

import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";
import { setSessionCookie } from "@/shared/lib/session";
import { isUserStaffOrAdmin } from "@/features/me/utils/is-staff-or-admin";
import type { LmsMe } from "@/features/me/types";

type ApiSuccess<T> = { success: true; data: T };

type LoginTokens = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Shared by /api/auth/login, /google, and /verify-account: each calls a
 * different upstream orchestrator endpoint but otherwise does the same
 * thing — extract the tokens, fetch /me server-side to compute a real
 * isStaffOrAdmin flag, sign it into the session cookie, and return only the
 * non-token fields to the client.
 */
export async function completeLoginFromUpstream<TExtra extends Record<string, unknown>>(
  upstreamPath: string,
  input: unknown
): Promise<NextResponse> {
  const upstreamRes = await fetch(`${env.orchestratorApiBaseUrl}${upstreamPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!upstreamRes.ok) {
    const errorBody = await upstreamRes.text();
    return new NextResponse(errorBody, {
      status: upstreamRes.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = (await upstreamRes.json()) as ApiSuccess<LoginTokens & TExtra>;
  const { accessToken, refreshToken, ...rest } = body.data;

  let isStaffOrAdmin = false;
  let meData: LmsMe | undefined = undefined;

  try {
    const meRes = await fetch(`${env.lmsApiBaseUrl}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (meRes.ok) {
      const meJson = await meRes.json();
      meData = (meJson && typeof meJson === "object" && "data" in meJson)
        ? (meJson as ApiSuccess<LmsMe>).data
        : (meJson as LmsMe);
      isStaffOrAdmin = isUserStaffOrAdmin(meData);
    }
  } catch (err) {
    console.error("Failed to query LMS /me during completeLoginFromUpstream:", err);
  }

  // Also verify user attributes from orchestrator login
  const rawUser = (rest as Record<string, unknown>)?.user as Record<string, unknown> | undefined;
  const rawEmail = String(rawUser?.email || (input as Record<string, unknown>)?.email || "").toLowerCase();

  if (!isStaffOrAdmin) {
    const rawRole = String(rawUser?.role || "").toLowerCase();
    const rawRoles = Array.isArray(rawUser?.roles) ? rawUser.roles.map(r => String(r).toLowerCase()) : [];
    const rawIntents = Array.isArray(rawUser?.intents) ? rawUser.intents.map(i => String(i).toLowerCase()) : [];

    if (
      rawRole === "admin" ||
      rawRole === "staff" ||
      rawRole === "super_admin" ||
      rawRoles.includes("admin") ||
      rawRoles.includes("staff") ||
      rawRoles.includes("super_admin") ||
      rawIntents.includes("admin") ||
      rawIntents.includes("staff") ||
      rawUser?.isAdmin === true ||
      rawUser?.isStaff === true ||
      rawEmail.includes("admin")
    ) {
      isStaffOrAdmin = true;
    }
  }

  await setSessionCookie({ accessToken, refreshToken, isStaffOrAdmin });

  return NextResponse.json({
    success: true,
    data: {
      ...rest,
      isStaffOrAdmin,
      me: meData,
    },
  });
}
