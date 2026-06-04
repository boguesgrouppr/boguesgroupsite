import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Wellness & Recovery PR - Bogues Group",
  description:
    "Thoughtful messaging for health, wellness, and recovery brands that need sensitivity and authority. PR services from Bogues Group.",
  openGraph: {
    title: "Wellness & Recovery PR - Bogues Group",
    description:
      "Thoughtful messaging for health, wellness, and recovery brands from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/industries/wellness-and-recovery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wellness & Recovery PR - Bogues Group",
    description:
      "Thoughtful messaging for health, wellness, and recovery brands from Bogues Group.",
  },
};

export default function WellnessRecoveryPage() {
  const page = getPage("wellness-and-recovery");

  return (
    <>
      <Hero
        title="Wellness & Recovery"
        subtitle="Thoughtful messaging for brands that need sensitivity and authority"
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
