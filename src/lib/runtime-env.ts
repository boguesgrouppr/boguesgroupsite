import { getCloudflareContext } from "@opennextjs/cloudflare";

function readBindingValue(env: Record<string, unknown>, name: string): string | undefined {
  const value = env[name];
  if (typeof value === "string" && value !== "") {
    return value;
  }
  return undefined;
}

async function getCloudflareBinding(name: string): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return readBindingValue(env as Record<string, unknown>, name);
  } catch {
    try {
      const { env } = getCloudflareContext();
      return readBindingValue(env as Record<string, unknown>, name);
    } catch {
      return undefined;
    }
  }
}

/**
 * Read env vars at request time from Cloudflare bindings and process.env.
 * Dynamic access avoids Next.js inlining undefined at build time.
 */
export async function getRuntimeEnv(name: string): Promise<string | undefined> {
  const fromCloudflare = await getCloudflareBinding(name);
  if (fromCloudflare) {
    return fromCloudflare;
  }

  const fromProcess = process.env[name];
  if (fromProcess !== undefined && fromProcess !== "") {
    return fromProcess;
  }

  return undefined;
}
