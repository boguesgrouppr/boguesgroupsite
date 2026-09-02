"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useConsent } from "@/contexts/ConsentProvider";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA4_MEASUREMENT_ID = "G-H9KDXM5VSF";

export function GaPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { consent } = useConsent();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (consent !== "granted") return;
    if (typeof window.gtag !== "function") return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("event", "page_view", {
      page_path: pagePath,
      send_to: GA4_MEASUREMENT_ID,
    });
  }, [pathname, searchParams, consent]);

  return null;
}
