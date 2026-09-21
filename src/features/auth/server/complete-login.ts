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

  const meRes = await fetch(`${env.lmsApiBaseUrl}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const isStaffOrAdmin = meRes.ok
    ? isUserStaffOrAdmin(((await meRes.json()) as ApiSuccess<LmsMe>).data)
    : false;

  await setSessionCookie({ accessToken, refreshToken, isStaffOrAdmin });

  return NextResponse.json({ success: true, data: rest });
}
