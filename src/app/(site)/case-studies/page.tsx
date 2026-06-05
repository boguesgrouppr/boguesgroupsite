import { Metadata } from "next";
import {
  getAllCaseStudies,
  getMediaUrl,
  getMediaAlt,
  stripHtml,
} from "@/lib/content";
import Hero from "@/components/Hero";
import Card from "@/components/Card";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Case Studies - Bogues Group",
  description:
    "Explore how Bogues Group has helped clients build their brands, amplify their stories, and achieve measurable PR results.",
  openGraph: {
    title: "Case Studies - Bogues Group",
    description:
      "Explore how Bogues Group has helped clients build their brands and achieve measurable PR results.",
    type: "website",
    siteName: "Bogues Group",
    url: "/case-studies",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies - Bogues Group",
    description:
      "Explore how Bogues Group has helped clients build their brands and achieve measurable PR results.",
  },
};

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <div>
      <Hero
        title="Case Studies"
        subtitle="Real results for real clients. See how we deliver impact through strategic communications."
      />

      {/* Case Studies Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <Card
              key={cs.id}
              title={cs.title.rendered}
              excerpt={stripHtml(cs.excerpt.rendered)}
              slug={cs.slug}
              href={`/case-studies/${cs.slug}`}
              imageUrl={getMediaUrl(cs.featured_media)}
              imageAlt={getMediaAlt(cs.featured_media)}
              date={cs.date}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
