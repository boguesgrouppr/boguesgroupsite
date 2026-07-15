import AboutContent from "@/components/pages/AboutContent";

export const metadata = {
  title: "About Us - Bogues Group",
  description:
    "Learn about Bogues Group, North Carolina's premier strategic communications and marketing agency. Meet our team, board of advisors, and discover our values.",
  openGraph: {
    title: "About Us - Bogues Group",
    description:
      "Learn about Bogues Group, North Carolina's premier strategic communications and marketing agency.",
    type: "website",
    siteName: "Bogues Group",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Bogues Group",
    description:
      "Learn about Bogues Group, North Carolina's premier strategic communications and marketing agency.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}