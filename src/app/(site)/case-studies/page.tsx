import { Metadata } from "next";
import CaseStudiesClient from "@/components/case-studies/CaseStudiesClient";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import { getAllCaseStudies } from "@/lib/case-studies";
import { getSiteOrigin } from "@/lib/media-url";

export const revalidate = 60;

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

export default async function CaseStudiesPage() {
  const caseStudies = await getAllCaseStudies();

  const caseStudiesIndexSchema = {
    "@type": "CollectionPage",
    name: "Case Studies - Bogues Group",
    description:
      "Explore how Bogues Group has helped clients build their brands and achieve measurable PR results.",
    url: `${getSiteOrigin()}/case-studies`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: caseStudies.map((study, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${getSiteOrigin()}/case-studies/${study.slug}`,
        name: study.title,
      })),
    },
  };

  return (
    <div>
      <JsonLd data={caseStudiesIndexSchema} />
      <Hero
        title="Case Studies"
        subtitle="Real results for real clients. See how we deliver impact through strategic communications."
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <CaseStudiesClient caseStudies={caseStudies} />
      </section>
    </div>
  );
}
