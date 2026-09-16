import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/shared/lib/token-storage";
import { refreshAccessToken } from "@/shared/api/auth-refresh";
import type { ApiError, ApiErrorEnvelope } from "@/shared/types";

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retried?: boolean };

const AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH = ["/auth/login", "/auth/refresh", "/auth/register"];

export function createHttpClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorEnvelope>) => {
      const originalRequest = error.config as RetriableRequestConfig | undefined;
      const isRefreshable =
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retried &&
        !AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH.some((path) => originalRequest.url?.includes(path));

      if (isRefreshable && originalRequest) {
        originalRequest._retried = true;
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        }
      }

      const envelope = error.response?.data;
      const apiError: ApiError = {
        status: error.response?.status ?? null,
        code: envelope?.error?.code ?? "network_error",
        message: envelope?.error?.message ?? error.message,
        details: envelope?.error?.details,
        requestId: envelope?.requestId,
      };
      return Promise.reject(apiError);
    }
  );

  return client;
}
