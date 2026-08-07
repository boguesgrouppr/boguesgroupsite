"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useConsent } from "@/contexts/ConsentProvider";

export function CookieConsentBanner() {
  const { consent, acceptConsent, denyConsent } = useConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (consent !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy shadow-[0_-8px_30px_rgba(0,0,0,0.25)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="text-sm leading-relaxed text-white/70">
          We use cookies to analyze site traffic and improve your experience
          on our site. By clicking &ldquo;Accept&rdquo;, you agree to our use
          of cookies as described in our{" "}
          <Link
            href="/privacy"
            className="font-medium text-gold underline underline-offset-2 hover:text-gold/80"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={denyConsent}
            className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={acceptConsent}
            className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}