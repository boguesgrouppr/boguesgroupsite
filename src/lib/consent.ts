export type ConsentValue = "granted" | "denied";
export type ConsentState = ConsentValue | "pending";

export const CONSENT_COOKIE_NAME = "bg_consent";
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function readConsentCookie(): ConsentState {
  if (typeof document === "undefined") return "pending";

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!match) return "pending";

  const value = match.split("=")[1];
  return value === "granted" || value === "denied" ? value : "pending";
}

export function writeConsentCookie(value: ConsentValue): void {
  if (typeof document === "undefined") return;

  const isSecureContext =
    typeof window !== "undefined" && window.location.protocol === "https:";

  document.cookie = [
    `${CONSENT_COOKIE_NAME}=${value}`,
    `Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax",
    isSecureContext ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearConsentCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${CONSENT_COOKIE_NAME}=`,
    "Max-Age=0",
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
}