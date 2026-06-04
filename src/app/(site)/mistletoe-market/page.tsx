import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Mistletoe Market - Bogues Group",
  description:
    "Mistletoe Market: where Charlotte comes to shop, sip, and celebrate. Featuring local artisans, makers, holiday cocktails, and seasonal festivities.",
  openGraph: {
    title: "Mistletoe Market - Bogues Group",
    description:
      "Where Charlotte comes to shop, sip, and celebrate. Local artisans, makers, and holiday festivities.",
    type: "website",
    siteName: "Bogues Group",
    url: "/mistletoe-market",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mistletoe Market - Bogues Group",
    description:
      "Where Charlotte comes to shop, sip, and celebrate. Local artisans, makers, and holiday festivities.",
  },
};

export default function MistletoeMarketPage() {
  const page = getPage("mistletoe-market");

  return (
    <>
      <Hero
        title="Mistletoe Market"
        subtitle="Where Charlotte comes to shop, sip, and celebrate"
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
