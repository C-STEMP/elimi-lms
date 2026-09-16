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
        staleTime: 30 * 1000,
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
