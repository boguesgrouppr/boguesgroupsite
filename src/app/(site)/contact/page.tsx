import ContactContent from "@/components/pages/ContactContent";

export const metadata = {
  title: "Contact Us - Bogues Group",
  description:
    "Let's start a conversation about your brand. Whether you're launching a new brand, planning an event, navigating a communications challenge, or looking to grow your organization's visibility, we're here to help.",
  openGraph: {
    title: "Contact Us - Bogues Group",
    description:
      "Let's start a conversation about your brand. We're here to help you build, grow, and protect your reputation.",
    type: "website",
    siteName: "Bogues Group",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Bogues Group",
    description:
      "Let's start a conversation about your brand. We're here to help you build, grow, and protect your reputation.",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}