import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Strategy & Planning - Bogues Group",
  description:
    "Research-backed communications strategies aligned with your business objectives. Strategic planning services from Bogues Group.",
  openGraph: {
    title: "Strategy & Planning - Bogues Group",
    description:
      "Research-backed communications strategies aligned with your business objectives.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/strategy-planning",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategy & Planning - Bogues Group",
    description:
      "Research-backed communications strategies aligned with your business objectives.",
  },
};

export default function StrategyPlanningPage() {
  const page = getPage("strategy-planning");

  return (
    <>
      <Hero
        title="Strategy & Planning"
        subtitle="Research-backed communications strategies aligned with your business objectives"
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
