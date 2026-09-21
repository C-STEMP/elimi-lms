import "server-only";

import { env } from "@/shared/config/env";
import { isUserStaffOrAdmin } from "@/features/me/utils/is-staff-or-admin";
import type { LmsMe } from "@/features/me/types";
import type { SessionPayload } from "@/shared/lib/session";

type ApiSuccess<T> = { success: true; data: T };

/**
 * Dedupes concurrent refreshes of the same refresh token across in-flight
 * requests on this server process. Refresh tokens are typically single-use /
 * rotating upstream, so two proxied requests racing to refresh the same
 * token could otherwise invalidate each other. This is process-local (mirrors
 * the old client-side dedup in the now-deleted auth-refresh.ts) — it does not
 * cover horizontal multi-instance deployment; this app currently runs as a
 * conventional `next start` Node server with no edge/serverless config, so
 * that's an acceptable trade-off today, not a distributed lock.
 */
const inFlightRefreshes = new Map<string, Promise<SessionPayload | null>>();

async function performRefresh(refreshToken: string): Promise<SessionPayload | null> {
  try {
    const refreshRes = await fetch(`${env.orchestratorApiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!refreshRes.ok) return null;

    const refreshBody = (await refreshRes.json()) as ApiSuccess<{
      accessToken: string;
      refreshToken: string;
    }>;
    const { accessToken, refreshToken: newRefreshToken } = refreshBody.data;

    const meRes = await fetch(`${env.lmsApiBaseUrl}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!meRes.ok) return null;

    const meBody = (await meRes.json()) as ApiSuccess<LmsMe>;

    return {
      accessToken,
      refreshToken: newRefreshToken,
      isStaffOrAdmin: isUserStaffOrAdmin(meBody.data),
    };
  } catch {
    return null;
  }
}

/** Refreshes the upstream session and recomputes the signed isStaffOrAdmin flag. Returns null if the refresh token is no longer valid. */
export function refreshUpstreamSession(refreshToken: string): Promise<SessionPayload | null> {
  const inFlight = inFlightRefreshes.get(refreshToken);
  if (inFlight) return inFlight;

  const promise = performRefresh(refreshToken).finally(() => {
    inFlightRefreshes.delete(refreshToken);
  });
  inFlightRefreshes.set(refreshToken, promise);
  return promise;
}
