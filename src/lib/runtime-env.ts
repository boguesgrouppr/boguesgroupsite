/**
 * Dynamic process.env access so Next.js does not inline values at build time.
 * Required for Cloudflare Workers runtime secrets/variables set in the dashboard.
 */
export function getRuntimeEnv(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined || value === "") {
    return undefined;
  }
  return value;
}
