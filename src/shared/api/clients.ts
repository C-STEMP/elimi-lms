import { createHttpClient } from "@/shared/api/create-http-client";
import { env } from "@/shared/config/env";

// Relative, same-origin paths — the Next.js proxy Route Handler attaches the
// session's access token server-side and forwards to the real upstream APIs.
// The browser never sees the external base URLs or the tokens.
export const lmsClient = createHttpClient("/api/proxy/lms");
export const orchestratorClient = createHttpClient("/api/proxy/orchestrator");
export const capClient = createHttpClient("/api/proxy/cap");

// Exception to the above: talks to Orchestrator directly from the browser, with
// a Bearer token fetched from /api/auth/access-token. Used for file uploads so
// the bytes go straight to the VPS instead of through the Next.js server.
export const orchestratorDirectClient = createHttpClient(env.orchestratorApiBaseUrl);
orchestratorDirectClient.defaults.withCredentials = false;
