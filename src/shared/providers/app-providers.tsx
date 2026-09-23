"use client";

import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getQueryClient } from "@/shared/api/query-client";
import { AntdProvider } from "@/shared/components/ui/antd-provider";
import { ToastProvider } from "@/shared/components/ui/toast";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <AntdRegistry>
      <AntdProvider>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={googleClientId}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </AntdProvider>
    </AntdRegistry>
  );
}
