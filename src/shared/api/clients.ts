import { createHttpClient } from "@/shared/api/create-http-client";

// Relative, same-origin paths — the Next.js proxy Route Handler attaches the
// session's access token server-side and forwards to the real upstream APIs.
// The browser never sees the external base URLs or the tokens.
export const lmsClient = createHttpClient("/api/proxy/lms");
export const orchestratorClient = createHttpClient("/api/proxy/orchestrator");
export const capClient = createHttpClient("/api/proxy/cap");
