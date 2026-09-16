import axios from "axios";
import { env } from "@/shared/config/env";
import { tokenStorage } from "@/shared/lib/token-storage";

type RefreshResponse = {
  data?: {
    accessToken: string;
    refreshToken: string;
  };
};

let inFlightRefresh: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<RefreshResponse>(
      `${env.orchestratorApiBaseUrl}/auth/refresh`,
      { refreshToken }
    );
    if (!data.data) return null;
    tokenStorage.setTokens(data.data);
    return data.data.accessToken;
  } catch {
    tokenStorage.clearTokens();
    return null;
  }
}

/** Deduplicates concurrent 401s into a single refresh call. */
export function refreshAccessToken(): Promise<string | null> {
  inFlightRefresh ??= performRefresh().finally(() => {
    inFlightRefresh = null;
  });
  return inFlightRefresh;
}
