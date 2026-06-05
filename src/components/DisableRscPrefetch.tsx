"use client";

import { useEffect } from "react";

function isRscPrefetchRequest(input: RequestInfo | URL, init?: RequestInit): boolean {
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      return init.headers.get("next-router-prefetch") === "1";
    }
    if (Array.isArray(init.headers)) {
      return init.headers.some(
        ([key, value]) =>
          key.toLowerCase() === "next-router-prefetch" && value === "1"
      );
    }
    const headers = init.headers as Record<string, string>;
    if (headers["next-router-prefetch"] === "1") return true;
  }

  if (typeof input === "object" && input instanceof Request) {
    return input.headers.get("next-router-prefetch") === "1";
  }

  return false;
}

/**
 * Block background RSC prefetches — they exceed Cloudflare Worker CPU limits.
 * Real navigations (clicks) are unaffected and still fetch page data on demand.
 */
export default function DisableRscPrefetch() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as Window & { __rscPrefetchDisabled?: boolean }).__rscPrefetchDisabled
    ) {
      return;
    }

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input, init) => {
      if (isRscPrefetchRequest(input, init)) {
        return new Response(null, { status: 204 });
      }
      return originalFetch(input, init);
    };

    (window as Window & { __rscPrefetchDisabled?: boolean }).__rscPrefetchDisabled =
      true;

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
