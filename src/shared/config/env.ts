function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  lmsApiBaseUrl: requireEnv(
    "NEXT_PUBLIC_LMS_API_BASE_URL",
    process.env.NEXT_PUBLIC_LMS_API_BASE_URL
  ),
  orchestratorApiBaseUrl: requireEnv(
    "NEXT_PUBLIC_ORCHESTRATOR_API_BASE_URL",
    process.env.NEXT_PUBLIC_ORCHESTRATOR_API_BASE_URL
  ),
};
