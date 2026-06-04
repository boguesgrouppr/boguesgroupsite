import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Hospitality PR & Marketing - Bogues Group",
  description:
    "Digital and social strategies, experiential marketing, and brand storytelling for hotels, restaurants, and hospitality brands from Bogues Group.",
  openGraph: {
    title: "Hospitality PR & Marketing - Bogues Group",
    description:
      "PR, marketing, and brand storytelling for hotels, restaurants, and hospitality brands.",
    type: "website",
    siteName: "Bogues Group",
    url: "/industries/hospitality",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hospitality PR & Marketing - Bogues Group",
    description:
      "PR, marketing, and brand storytelling for hotels, restaurants, and hospitality brands.",
  },
};

export default function HospitalityPage() {
  const page = getPage("hospitality-3");

  return (
    <>
      <Hero
        title="Hospitality"
        subtitle="Compelling stories that drive bookings, loyalty, and guest engagement"
        compact
      />
      <section className="max-w-4xl mx-auto px-6 py-16">
        {page?.content?.rendered ? (
          <ContentRenderer html={page.content?.rendered ?? ""} />
        ) : (
          <p className="text-gray-500 text-center">Content coming soon.</p>
        )}
      </section>
    </>
  );
}
