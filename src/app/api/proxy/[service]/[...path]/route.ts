import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/shared/config/env";
import { getSession, setSessionCookie } from "@/shared/lib/session";
import { refreshUpstreamSession } from "@/shared/api/create-server-http";
import type { SessionPayload } from "@/shared/lib/session";

export const runtime = "nodejs";

const SERVICE_BASE_URLS: Record<string, string> = {
  lms: env.lmsApiBaseUrl,
  orchestrator: env.orchestratorApiBaseUrl,
};

const REQUEST_HEADERS_TO_DROP = new Set(["host", "cookie", "content-length"]);
const RESPONSE_HEADERS_TO_DROP = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
]);

function buildForwardHeaders(source: Headers, accessToken: string | undefined): Headers {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (!REQUEST_HEADERS_TO_DROP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  } else {
    headers.delete("Authorization");
  }
  return headers;
}

function buildResponseHeaders(source: Headers): Headers {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (!RESPONSE_HEADERS_TO_DROP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return headers;
}

async function forward(
  request: NextRequest,
  upstreamUrl: string,
  accessToken: string | undefined
): Promise<Response> {
  const hasBody = !["GET", "HEAD"].includes(request.method);
  return fetch(upstreamUrl, {
    method: request.method,
    headers: buildForwardHeaders(request.headers, accessToken),
    body: hasBody ? request.body : undefined,
    // @ts-expect-error -- required by undici when streaming a request body
    duplex: hasBody ? "half" : undefined,
    cache: "no-store",
    redirect: "manual",
  });
}

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ service: string; path: string[] }> }
): Promise<Response> {
  const { service, path } = await context.params;
  const baseUrl = SERVICE_BASE_URLS[service];
  if (!baseUrl) {
    return NextResponse.json(
      { success: false, error: { code: "not_found", message: "Unknown upstream service" } },
      { status: 404 }
    );
  }

  const upstreamUrl = `${baseUrl}/${path.join("/")}${request.nextUrl.search}`;

  let session: SessionPayload | null = await getSession();

  let upstreamRes = await forward(request, upstreamUrl, session?.accessToken);

  // A logged-out visitor has no refresh token to retry with — pass the 401 through as-is.
  if (upstreamRes.status === 401 && session?.refreshToken) {
    const refreshed = await refreshUpstreamSession(session.refreshToken);
    if (refreshed) {
      await setSessionCookie(refreshed);
      session = refreshed;
      upstreamRes = await forward(request, upstreamUrl, session.accessToken);
    }
  }

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: buildResponseHeaders(upstreamRes.headers),
  });
}

export {
  handleProxy as GET,
  handleProxy as POST,
  handleProxy as PUT,
  handleProxy as PATCH,
  handleProxy as DELETE,
};
