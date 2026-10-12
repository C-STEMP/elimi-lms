import axios from "axios";
import { createHttpClient } from "@/shared/api/create-http-client";
import { env } from "@/shared/config/env";
import type { ApiError } from "@/shared/types";

let cachedAccessToken: string | null = null;
let tokenPromise: Promise<string> | null = null;
let refreshPromise: Promise<string> | null = null;

export async function getAccessToken(forceRefresh = false): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }

  if (forceRefresh) {
    if (!refreshPromise) {
      refreshPromise = axios
        .get<{ data: { accessToken: string } }>(
          "/api/auth/access-token?refresh=1",
        )
        .then((res) => {
          cachedAccessToken = res.data.data.accessToken;
          return cachedAccessToken;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
    return refreshPromise;
  }

  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  if (!tokenPromise) {
    tokenPromise = axios
      .get<{ data: { accessToken: string } }>("/api/auth/access-token")
      .then((res) => {
        cachedAccessToken = res.data.data.accessToken;
        return cachedAccessToken;
      })
      .finally(() => {
        tokenPromise = null;
      });
  }
  return tokenPromise;
}

export function clearCachedAccessToken() {
  cachedAccessToken = null;
  tokenPromise = null;
  refreshPromise = null;
}

export const lmsClient = createHttpClient("/api/proxy/lms");
export const orchestratorClient = createHttpClient("/api/proxy/orchestrator");
export const capClient = createHttpClient("/api/proxy/cap");

export const lmsDirectClient = createHttpClient(env.lmsApiBaseUrl);
lmsDirectClient.defaults.withCredentials = false;

export const orchestratorDirectClient = createHttpClient(
  env.orchestratorApiBaseUrl,
);
orchestratorDirectClient.defaults.withCredentials = false;

export async function withDirectAuth<T>(
  action: (accessToken: string) => Promise<T>,
): Promise<T> {
  try {
    const token = await getAccessToken();
    return await action(token);
  } catch (err) {
    if ((err as Partial<ApiError> | null)?.status !== 401) throw err;
    const refreshedToken = await getAccessToken(true);
    return await action(refreshedToken);
  }
}
