import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Roboto, Poppins, Rubik } from "next/font/google";
import QueryProvider from "@/contexts/QueryProvider";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${roboto.variable} ${poppins.variable} ${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="/disable-rsc-prefetch.js"
          strategy="beforeInteractive"
        />
        <QueryProvider>{children}</QueryProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1G1HEFQKMR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1G1HEFQKMR');
          `}
        </Script>
      </body>
    </html>
  );
}
