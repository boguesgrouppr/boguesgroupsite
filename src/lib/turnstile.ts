import "server-only";

interface SiteverifyResponse {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export type TurnstileResult =
  | { ok: true }
  | {
      ok: false;
      reason: "not_configured" | "missing_token" | "network" | "rejected";
      codes?: string[];
    };

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2048;

function getAllowedHostnames(): Set<string> {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );
}

export async function verifyTurnstile(
  token: unknown,
  expectedAction: string,
  remoteIp?: string | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const allowedHostnames = getAllowedHostnames();

  if (!secret || allowedHostnames.size === 0) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY or TURNSTILE_HOSTNAMES is not configured");
    return { ok: false, reason: "not_configured" };
  }

  if (typeof token !== "string" || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return { ok: false, reason: "missing_token" };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  let result: SiteverifyResponse;
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    result = (await res.json()) as SiteverifyResponse;
  } catch (error) {
    console.error("[turnstile] siteverify request failed", error);
    return { ok: false, reason: "network" };
  }

  if (
    !result.success ||
    result.action !== expectedAction ||
    !result.hostname ||
    !allowedHostnames.has(result.hostname)
  ) {
    console.warn("[turnstile] rejected", {
      success: result.success,
      action: result.action,
      hostname: result.hostname,
      codes: result["error-codes"],
    });
    return { ok: false, reason: "rejected", codes: result["error-codes"] };
  }

  return { ok: true };
}