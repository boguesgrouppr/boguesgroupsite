"use client";

import { useConsent } from "@/contexts/ConsentProvider";

interface CookiePreferencesLinkProps {
  className?: string;
}

export function CookiePreferencesLink({
  className = "",
}: CookiePreferencesLinkProps) {
  const { resetConsent } = useConsent();

  return (
    <button type="button" onClick={resetConsent} className={className}>
      Cookie Preferences
    </button>
  );
}