import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Media Relations - Bogues Group",
  description:
    "Press outreach, media training, and relationship building with top-tier journalists. Expert media and public relations services from Bogues Group.",
  openGraph: {
    title: "Media Relations - Bogues Group",
    description:
      "Press outreach, media training, and journalist relationship building from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/media-relations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Relations - Bogues Group",
    description:
      "Press outreach, media training, and journalist relationship building from Bogues Group.",
  },
};

export default function MediaRelationsPage() {
  const page = getPage("media-relations");

  return (
    <>
      <Hero
        title="Media Relations"
        subtitle="Press outreach, media training, and relationship building with top-tier journalists"
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
