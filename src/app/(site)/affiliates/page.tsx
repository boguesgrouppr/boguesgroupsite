import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Brand Builder Affiliate Program - Bogues Group",
  description:
    "Earn with purpose. Join the Brand Builder Affiliate Program and earn $100 per workbook sold with no upfront cost. Empower entrepreneurs while building income.",
  openGraph: {
    title: "Brand Builder Affiliate Program - Bogues Group",
    description:
      "Earn $100 per workbook sold with no upfront cost. Empower entrepreneurs while building income.",
    type: "website",
    siteName: "Bogues Group",
    url: "/affiliates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Builder Affiliate Program - Bogues Group",
    description:
      "Earn $100 per workbook sold with no upfront cost. Empower entrepreneurs while building income.",
  },
};

export default function AffiliatesPage() {
  const page = getPage("become-an-affiliate");

  return (
    <>
      <Hero
        title="Brand Builder Affiliate Program"
        subtitle="Earn with purpose. Empower entrepreneurs."
        ctaText="Get Started"
        ctaHref="/contact"
      />
      <section className="max-w-4xl mx-auto px-6 py-16">
        {page ? (
          <ContentRenderer html={page.content.rendered} />
        ) : (
          <p className="text-gray-500 text-center">Content coming soon.</p>
        )}

        {/* Affiliate Program Overview */}
        <div className="mt-12 aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src="https://player.vimeo.com/video/1101607424"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        {/* Affiliate Signup Video */}
        <div className="mt-10 aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src="https://player.vimeo.com/video/1118293958"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </section>
    </>
  );
}
