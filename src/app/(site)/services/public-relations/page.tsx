import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Public Relations - Bogues Group",
  description:
    "Strategic public relations services including strategy and planning, messaging and positioning, media relations, and crisis management from Bogues Group.",
  openGraph: {
    title: "Public Relations - Bogues Group",
    description:
      "Strategic public relations services from North Carolina's premier PR firm.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/public-relations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Public Relations - Bogues Group",
    description:
      "Strategic public relations services from North Carolina's premier PR firm.",
  },
};

export default function PublicRelationsPage() {
  const page = getPage("public-relations");

  return (
    <>
      <Hero
        title="Public Relations"
        subtitle="Strategic communications that build credibility, shape narratives, and earn media coverage"
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
