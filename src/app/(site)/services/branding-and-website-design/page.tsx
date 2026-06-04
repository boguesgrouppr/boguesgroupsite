import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Branding & Website Design - Bogues Group",
  description:
    "Visual identity, messaging frameworks, and web experiences that set you apart. Branding and website design services from Bogues Group.",
  openGraph: {
    title: "Branding & Website Design - Bogues Group",
    description:
      "Visual identity, messaging frameworks, and web experiences that set you apart.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/branding-and-website-design",
  },
  twitter: {
    card: "summary_large_image",
    title: "Branding & Website Design - Bogues Group",
    description:
      "Visual identity, messaging frameworks, and web experiences that set you apart.",
  },
};

export default function BrandingWebsiteDesignPage() {
  const page = getPage("branding-and-website-design");

  return (
    <>
      <Hero
        title="Branding & Website Design"
        subtitle="Visual identity, messaging frameworks, and web experiences that set you apart"
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
