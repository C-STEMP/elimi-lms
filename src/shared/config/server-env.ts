import "server-only";

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Kept out of `env.ts` deliberately: that module is transitively imported by
 * client components (via shared/api/clients.ts), and anything on its `env`
 * object gets inlined into the client bundle by webpack. This secret must
 * never reach the browser.
 */
export const serverEnv = {
  sessionSecret: requireEnv("SESSION_SECRET", process.env.SESSION_SECRET),
};
