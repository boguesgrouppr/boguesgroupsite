import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Media and Public Relations - Bogues Group",
  description:
    "A robust marketing and media strategy should not rely on one method. Earned media, press coverage, and strategic PR services from Bogues Group.",
  openGraph: {
    title: "Media and Public Relations - Bogues Group",
    description:
      "Earned media, press coverage, and strategic PR services from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/media-and-public-relations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media and Public Relations - Bogues Group",
    description:
      "Earned media, press coverage, and strategic PR services from Bogues Group.",
  },
};

export default function MediaPublicRelationsPage() {
  const page = getPage("media-and-public-relations");

  return (
    <>
      <Hero
        title="Media and Public Relations"
        subtitle="A robust strategy that goes beyond a single method to deliver real results"
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
