"use client";

import { Suspense } from "react";
import Script from "next/script";
import { useConsent } from "@/contexts/ConsentProvider";
import { GaPageviewTracker } from "@/components/GaPageviewTracker";

const GA4_MEASUREMENT_ID = "G-H9KDXM5VSF";
const GTM_CONTAINER_ID: string | undefined = undefined;


export function Analytics() {
  const { consent } = useConsent();

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