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
  cap: env.capApiBaseUrl,
};

const REQUEST_HEADERS_TO_DROP = new Set(["host", "cookie", "content-length"]);
const RESPONSE_HEADERS_TO_DROP = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
  // Allow the SCORM player HTML to render inside our iframe.
  "x-frame-options",
  "content-security-policy",
]);

function rewriteScormPlayerBaseHtml(
  html: string,
  requestUrl: string,
  sessionId: string,
): string {
  if (!sessionId || (!html.includes("<html") && !html.includes("<body"))) {
    return html;
  }

  const { origin } = new URL(requestUrl);
  // Base must be the session directory so that `./content/...` resolves to
  // `/player/scorm/{sessionId}/content/...` and `./cmi` resolves to
  // `/player/scorm/{sessionId}/cmi`.
  const proxyBaseHref = `${origin}/api/proxy/lms/player/scorm/${sessionId}/`;

  const normalized = html.replace(
    /<base\s+[^>]*href\s*=\s*['"][^'"]*['"][^>]*>/i,
    `<base href="${proxyBaseHref}">`,
  );

  if (normalized === html && /<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `<base href="${proxyBaseHref}"></head>`);
  }

  if (normalized === html) {
    return `<base href="${proxyBaseHref}">${html}`;
  }

  return normalized;
}

function buildForwardHeaders(
  source: Headers,
  accessToken: string | undefined,
): Headers {
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
  accessToken: string | undefined,
  body: ArrayBuffer | undefined,
): Promise<Response> {
  return fetch(upstreamUrl, {
    method: request.method,
    headers: buildForwardHeaders(request.headers, accessToken),
    body,
    cache: "no-store",
    redirect: "manual",
  });
}

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ service: string; path: string[] }> },
): Promise<Response> {
  const { service, path } = await context.params;
  const baseUrl = SERVICE_BASE_URLS[service];
  if (!baseUrl) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "not_found", message: "Unknown upstream service" },
      },
      { status: 404 },
    );
  }

  const upstreamUrl = `${baseUrl}/${path.join("/")}${request.nextUrl.search}`;

  // Buffered once so it can be replayed on the refresh-retry below — the
  // request body stream can only be read a single time.
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  let session: SessionPayload | null = await getSession();

  let upstreamRes = await forward(
    request,
    upstreamUrl,
    session?.accessToken,
    body,
  );

  // A logged-out visitor has no refresh token to retry with — pass the 401 through as-is.
  if (upstreamRes.status === 401 && session?.refreshToken) {
    const refreshed = await refreshUpstreamSession(session.refreshToken);
    if (refreshed) {
      await setSessionCookie(refreshed);
      session = refreshed;
      upstreamRes = await forward(
        request,
        upstreamUrl,
        session.accessToken,
        body,
      );
    }
  }

  const isScormPlayerHtml =
    service === "lms" &&
    path[0] === "player" &&
    path[1] === "scorm" &&
    path.at(-1) === "player" &&
    (upstreamRes.headers.get("content-type") ?? "").includes("text/html");

  if (isScormPlayerHtml) {
    const html = await upstreamRes.text();
    const sessionId = path[2];
    const rewritten = rewriteScormPlayerBaseHtml(html, request.url, sessionId);

    return new NextResponse(rewritten, {
      status: upstreamRes.status,
      headers: buildResponseHeaders(upstreamRes.headers),
    });
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
