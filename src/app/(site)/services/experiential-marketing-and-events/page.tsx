import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Experiential Marketing & Events - Bogues Group",
  description:
    "Memorable activations and events that create lasting impressions and deepen engagement. Experiential marketing services from Bogues Group.",
  openGraph: {
    title: "Experiential Marketing & Events - Bogues Group",
    description:
      "Memorable activations and events that create lasting impressions and deepen engagement.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/experiential-marketing-and-events",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experiential Marketing & Events - Bogues Group",
    description:
      "Memorable activations and events that create lasting impressions and deepen engagement.",
  },
};

export default function ExperientialMarketingEventsPage() {
  const page = getPage("experiential-marketing-and-events");

  return (
    <>
      <Hero
        title="Experiential Marketing & Events"
        subtitle="Memorable activations and events that create lasting impressions and deepen engagement"
        compact
      />
      <section className="max-w-4xl mx-auto px-6 py-16">
        {page ? (
          <ContentRenderer html={page.content.rendered} />
        ) : (
          <p className="text-gray-500 text-center">Content coming soon.</p>
        )}
      </section>
    </>
  );
}
