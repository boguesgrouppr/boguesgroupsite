import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Marketing & Branding Consultancy - Bogues Group",
  description:
    "Expert marketing and branding consultancy services. Strategic guidance to elevate your brand identity and market position from Bogues Group.",
  openGraph: {
    title: "Marketing & Branding Consultancy - Bogues Group",
    description:
      "Strategic marketing and branding consultancy to elevate your brand identity and market position.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/marketing-branding-consultancy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketing & Branding Consultancy - Bogues Group",
    description:
      "Strategic marketing and branding consultancy to elevate your brand identity and market position.",
  },
};

export default function MarketingBrandingConsultancyPage() {
  const page = getPage("marketing-branding-consultancy");

  return (
    <>
      <Hero
        title="Marketing & Branding Consultancy"
        subtitle="Strategic guidance to elevate your brand identity and market position"
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
