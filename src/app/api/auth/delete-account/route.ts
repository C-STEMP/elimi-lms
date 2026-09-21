import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/shared/config/env";
import { getSession, clearSessionCookie } from "@/shared/lib/session";
import type { DeleteAccountInput } from "@/features/auth/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: "unauthenticated", message: "Not signed in" } },
      { status: 401 }
    );
  }

  const input = (await request.json()) as DeleteAccountInput;

  const upstreamRes = await fetch(`${env.orchestratorApiBaseUrl}/auth/delete-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const responseBody = await upstreamRes.text();

  if (upstreamRes.ok) {
    await clearSessionCookie();
  }

  return new NextResponse(responseBody, {
    status: upstreamRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
