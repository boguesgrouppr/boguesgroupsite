import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Marketing Services - Bogues Group",
  description:
    "Content marketing, influencer marketing, and social media marketing services from Bogues Group. Integrated campaigns that connect your brand with the right audiences.",
  openGraph: {
    title: "Marketing Services - Bogues Group",
    description:
      "Content, influencer, and social media marketing from North Carolina's premier PR firm.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/marketing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketing Services - Bogues Group",
    description:
      "Content, influencer, and social media marketing from North Carolina's premier PR firm.",
  },
};

export default function MarketingPage() {
  const page = getPage("marketing");

  return (
    <>
      <Hero
        title="Marketing"
        subtitle="Integrated campaigns that connect your brand with the right audiences at the right time"
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
