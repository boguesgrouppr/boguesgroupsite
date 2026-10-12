"use client";

import { Suspense, useEffect, useRef } from "react";
import Script from "next/script";
import { useConsent } from "@/contexts/ConsentProvider";
import { GaPageviewTracker } from "@/components/GaPageviewTracker";

const GA4_MEASUREMENT_ID = "G-H9KDXM5VSF";
const CLARITY_PROJECT_ID = "ywekv27cew";
const GTM_CONTAINER_ID: string | undefined = undefined;

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const { consent } = useConsent();
  const wasGranted = useRef(false);

  // Scripts already running can't be unloaded, so when consent is withdrawn
  // (e.g. via the preferences link) wipe Clarity's cookies and reload clean.
  useEffect(() => {
    if (consent === "granted") {
      wasGranted.current = true;
      return;
    }
    if (wasGranted.current) {
      wasGranted.current = false;
      window.clarity?.("consent", false);
      window.location.reload();
    }
  }, [consent]);

  if (consent !== "granted") return null;

  return (
    <>
      <Script
        id="ga4-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}');
        `}
      </Script>

      <Script id="ms-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${CLARITY_PROJECT_ID}");
          window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
        `}
      </Script>

      {/* useSearchParams requires a Suspense boundary in App Router */}
      <Suspense fallback={null}>
        <GaPageviewTracker />
      </Suspense>

      {GTM_CONTAINER_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');
          `}
        </Script>
      )}
    </>
  );
}