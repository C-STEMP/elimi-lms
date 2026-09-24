import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/shared/types";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}

let browserQueryClient: QueryClient | undefined;

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false, // Prevent continuous reload when switching windows/tabs
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  });
}

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
