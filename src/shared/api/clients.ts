import { env } from "@/shared/config/env";
import { createHttpClient } from "@/shared/api/create-http-client";

export const lmsClient = createHttpClient(env.lmsApiBaseUrl);
export const orchestratorClient = createHttpClient(env.orchestratorApiBaseUrl);
