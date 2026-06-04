import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Awards and Recognition - Bogues Group",
  description:
    "Explore the awards, recognition, and media features earned by Bogues Group for excellence in public relations and communications.",
  openGraph: {
    title: "Awards and Recognition - Bogues Group",
    description:
      "Awards, recognition, and media features earned by Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/awards",
  },
  twitter: {
    card: "summary_large_image",
    title: "Awards and Recognition - Bogues Group",
    description:
      "Awards, recognition, and media features earned by Bogues Group.",
  },
};

export default function AwardsPage() {
  const page = getPage("awards");

  return (
    <>
      <Hero
        title="Awards & Recognition"
        subtitle="As seen in top publications and honored for excellence"
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
