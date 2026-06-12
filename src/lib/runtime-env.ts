/**
 * Runtime env accessor compatible with both Node.js and Cloudflare Workers.
 * Cloudflare Workers exposes dashboard secrets/vars on globalThis in addition
 * to process.env. Checking both ensures secrets set via dashboard are read.
 */
export function getRuntimeEnv(name: string): string | undefined {
  // Check process.env first (works locally + Cloudflare Variables)
  const fromProcess = process.env[name];
  if (fromProcess !== undefined && fromProcess !== "") {
    return fromProcess;
  }

  // Fallback to globalThis for Cloudflare Workers secrets
  const fromGlobal = (globalThis as Record<string, unknown>)[name];
  if (typeof fromGlobal === "string" && fromGlobal !== "") {
    return fromGlobal;
  }

  return undefined;
}