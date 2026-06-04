import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "NGOs & Nonprofits PR - Bogues Group",
  description:
    "Mission-driven communications that amplify impact, attract donors, and engage communities. PR for NGOs and nonprofits from Bogues Group.",
  openGraph: {
    title: "NGOs & Nonprofits PR - Bogues Group",
    description:
      "Mission-driven communications that amplify impact, attract donors, and engage communities.",
    type: "website",
    siteName: "Bogues Group",
    url: "/industries/ngos-nonprofits",
  },
  twitter: {
    card: "summary_large_image",
    title: "NGOs & Nonprofits PR - Bogues Group",
    description:
      "Mission-driven communications that amplify impact, attract donors, and engage communities.",
  },
};

export default function NGOsNonprofitsPage() {
  const page = getPage("non-governmental-organizations-ngos-nonprofits");

  return (
    <>
      <Hero
        title="NGOs & Nonprofits"
        subtitle="Mission-driven communications that amplify impact, attract donors, and engage communities"
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
