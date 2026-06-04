import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Bogues Group",
  description:
    "Get in touch with Bogues Group, North Carolina's premier PR firm. Start a conversation about your brand and communications goals.",
  openGraph: {
    title: "Contact Us - Bogues Group",
    description:
      "Get in touch with Bogues Group. Start a conversation about your brand and communications goals.",
    type: "website",
    siteName: "Bogues Group",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Bogues Group",
    description:
      "Get in touch with Bogues Group. Start a conversation about your brand and communications goals.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
