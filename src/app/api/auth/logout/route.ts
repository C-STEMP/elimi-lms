import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";
import { getSession, clearSessionCookie } from "@/shared/lib/session";

export const runtime = "nodejs";

export async function POST() {
  const session = await getSession();

  if (session) {
    // Best-effort — the cookie is cleared regardless of whether upstream logout succeeds.
    try {
      await fetch(`${env.orchestratorApiBaseUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
        cache: "no-store",
      });
    } catch {
      // ignore
    }
  }

  await clearSessionCookie();

  return NextResponse.json({ success: true, data: { message: "Logged out" } });
}
