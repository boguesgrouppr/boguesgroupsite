import { Metadata } from "next";
import MeetTheFounderContent from "@/components/pages/MeetTheFounderContent";

export const metadata: Metadata = {
  title: "Meet the Founder - Brittney Bogues - Bogues Group",
  description:
    "Meet Brittney Bogues, founder of Bogues Group. A strategic communications leader with 15+ years of experience in public relations, marketing, event strategy, and nonprofit leadership.",
  openGraph: {
    title: "Meet the Founder - Brittney Bogues - Bogues Group",
    description:
      "Meet Brittney Bogues, founder of Bogues Group and strategic communications leader with 15+ years of experience.",
    type: "website",
    siteName: "Bogues Group",
    url: "/meet-the-founder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the Founder - Brittney Bogues - Bogues Group",
    description:
      "Meet Brittney Bogues, founder of Bogues Group and strategic communications leader with 15+ years of experience.",
  },
};

export default function MeetTheFounderPage() {
  return <MeetTheFounderContent />;
}