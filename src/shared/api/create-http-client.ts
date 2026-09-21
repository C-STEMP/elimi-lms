import axios, { type AxiosError } from "axios";
import type { ApiError, ApiErrorEnvelope } from "@/shared/types";

export function createHttpClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorEnvelope>) => {
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
