import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Small & Micro Business Hub - Bogues Group",
  description:
    "Your branding solution: a digital workbook and kit with expert advice from industry leaders, detailed checklists, and tools for small and micro businesses.",
  openGraph: {
    title: "Small & Micro Business Hub - Bogues Group",
    description:
      "Expert branding workbook and kit for small and micro businesses from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/small-micro-business-hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Small & Micro Business Hub - Bogues Group",
    description:
      "Expert branding workbook and kit for small and micro businesses from Bogues Group.",
  },
};

export default function SmallMicroBusinessHubPage() {
  const page = getPage("small-micro-business-hub");

  return (
    <>
      <Hero
        title="Small & Micro Business Hub"
        subtitle="Your branding solution with expert advice, detailed checklists, and tools to grow"
        ctaText="Get the Workbook"
        ctaHref="/contact"
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
