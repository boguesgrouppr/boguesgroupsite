import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Cannabis Fund - The Collective Grow - Bogues Group",
  description:
    "The Collective Grow is a PR engine for cannabis brands ready to grow their visibility. Raising standards, restoring access, and reinvesting in people.",
  openGraph: {
    title: "Cannabis Fund - The Collective Grow - Bogues Group",
    description:
      "A collective PR engine for cannabis brands ready to grow their visibility.",
    type: "website",
    siteName: "Bogues Group",
    url: "/cannabis-fund",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cannabis Fund - The Collective Grow - Bogues Group",
    description:
      "A collective PR engine for cannabis brands ready to grow their visibility.",
  },
};

export default function CannabisFundPage() {
  const page = getPage("cannabis-fund");

  return (
    <>
      <Hero
        title="The Collective Grow"
        subtitle="Raising standards. Restoring access. Reinvesting in people."
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
