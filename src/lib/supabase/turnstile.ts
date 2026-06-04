const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerificationResult {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstileToken(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return {
      success: false,
      error: "Turnstile is not configured.",
    };
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      success: false,
      error: "Unable to verify spam protection token.",
    };
  }

  const data = (await response.json()) as TurnstileVerificationResult;

  if (!data.success) {
    return {
      success: false,
      error: "Spam protection validation failed.",
    };
  }

  return { success: true };
}
