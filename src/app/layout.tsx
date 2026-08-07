import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import { Plus_Jakarta_Sans, Roboto, Poppins, Rubik } from "next/font/google";
import QueryProvider from "@/contexts/QueryProvider";
import "./globals.css";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { Analytics } from "@/components/Analytics";
import { ConsentProvider } from "@/contexts/ConsentProvider";
import { CONSENT_COOKIE_NAME, type ConsentState } from "@/lib/consent";
import JsonLd from "@/components/JsonLd";
import { buildOrganizationSchema, buildLocalBusinessSchema } from "@/lib/jsonld";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-nav",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${plusJakarta.variable} ${roboto.variable} ${poppins.variable} ${rubik.variable} h-full antialiased`}
    >
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