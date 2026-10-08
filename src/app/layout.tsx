import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import localFont from "next/font/local";
import QueryProvider from "@/contexts/QueryProvider";
import "./globals.css";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { Analytics } from "@/components/Analytics";
import { ConsentProvider } from "@/contexts/ConsentProvider";
import { CONSENT_COOKIE_NAME, type ConsentState } from "@/lib/consent";
import JsonLd from "@/components/JsonLd";
import { buildOrganizationSchema, buildLocalBusinessSchema } from "@/lib/jsonld";

// Self-hosted (latin subset) so builds never depend on fonts.googleapis.com.
// Files live in src/fonts and are copied from @fontsource packages.
const plusJakarta = localFont({
  variable: "--font-heading",
  src: [
    {
      path: "../fonts/plus-jakarta-sans-latin-wght-normal.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
  display: "swap",
});

const poppins = localFont({
  variable: "--font-nav",
  src: [
    { path: "../fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
});

const rubik = localFont({
  variable: "--font-accent",
  src: [
    {
      path: "../fonts/rubik-latin-wght-normal.woff2",
      weight: "300 900",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bogues Group - North Carolina's Premier PR Firm",
  description:
    "Bogues Group is North Carolina's premier public relations firm, delivering strategic communications, media relations, and brand storytelling for businesses across the state.",
  keywords: [
    "PR firm",
    "public relations",
    "North Carolina",
    "media relations",
    "communications",
    "Bogues Group",
  ],
  openGraph: {
    type: "website",
    siteName: "Bogues Group",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

function resolveInitialConsent(
  cookieValue: string | undefined
): ConsentState {
  return cookieValue === "granted" || cookieValue === "denied"
    ? cookieValue
    : "pending";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialConsent = resolveInitialConsent(
    cookieStore.get(CONSENT_COOKIE_NAME)?.value
  );

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      style={{ "--font-body": "Roboto, system-ui, sans-serif" } as React.CSSProperties}
      className={`${plusJakarta.variable} ${poppins.variable} ${rubik.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd data={[buildOrganizationSchema(), buildLocalBusinessSchema()]} />
        <ConsentProvider initialConsent={initialConsent}>
          <Script src="/disable-rsc-prefetch.js" strategy="beforeInteractive" />
          <QueryProvider>{children}</QueryProvider>
          <CookieConsentBanner />
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}