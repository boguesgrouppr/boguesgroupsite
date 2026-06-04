import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Brand Builder Coaches Roundtable - Bogues Group",
  description:
    "Turn your community into a revenue stream with the Brand Builder Affiliate Program. Join the Coaches Roundtable to learn how you can earn by empowering entrepreneurs.",
  openGraph: {
    title: "Brand Builder Coaches Roundtable - Bogues Group",
    description:
      "Turn your community into a revenue stream with the Brand Builder Affiliate Program.",
    type: "website",
    siteName: "Bogues Group",
    url: "/coaches-roundtable",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Builder Coaches Roundtable - Bogues Group",
    description:
      "Turn your community into a revenue stream with the Brand Builder Affiliate Program.",
  },
};

export default function CoachesRoundtablePage() {
  const page = getPage("coaches-roundtable-funnel");

  return (
    <>
      <Hero
        title="Coaches Roundtable"
        subtitle="Turn your community into a revenue stream with the Brand Builder Affiliate Program"
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
