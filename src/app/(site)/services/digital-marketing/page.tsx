import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Digital Marketing - Bogues Group",
  description:
    "SEO, social media, content strategy, and paid campaigns that drive measurable results. Digital marketing services from Bogues Group.",
  openGraph: {
    title: "Digital Marketing - Bogues Group",
    description:
      "SEO, social media, content strategy, and paid campaigns that drive measurable results.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/digital-marketing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing - Bogues Group",
    description:
      "SEO, social media, content strategy, and paid campaigns that drive measurable results.",
  },
};

export default function DigitalMarketingPage() {
  const page = getPage("digital-marketing");

  return (
    <>
      <Hero
        title="Digital Marketing"
        subtitle="SEO, social media, content strategy, and paid campaigns that drive measurable results"
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
