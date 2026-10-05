import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, setSessionCookie } from "@/shared/lib/session";
import { refreshUpstreamSession } from "@/shared/api/create-server-http";

export const runtime = "nodejs";

/**
 * Hands the session's upstream access token to the browser for requests that
 * must go straight to Orchestrator instead of through /api/proxy — currently
 * file uploads to /storage/upload, so large SCORM zips aren't buffered by this
 * server. `?refresh=1` forces a refresh first (used after an upstream 401).
 */
export async function GET(request: NextRequest) {
  let session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: "unauthorized", message: "Not signed in" } },
      { status: 401 },
    );
  }

  if (request.nextUrl.searchParams.get("refresh") === "1") {
    const refreshed = await refreshUpstreamSession(session.refreshToken);
    if (!refreshed) {
      return NextResponse.json(
        { success: false, error: { code: "unauthorized", message: "Session expired" } },
        { status: 401 },
      );
    }
    await setSessionCookie(refreshed);
    session = refreshed;
  }

  return NextResponse.json(
    { success: true, data: { accessToken: session.accessToken } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
