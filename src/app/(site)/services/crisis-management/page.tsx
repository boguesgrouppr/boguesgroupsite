import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Crisis Management - Bogues Group",
  description:
    "Rapid-response crisis management and communications planning to protect your reputation when it matters most. Expert crisis PR from Bogues Group.",
  openGraph: {
    title: "Crisis Management - Bogues Group",
    description:
      "Rapid-response crisis management and communications planning from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/crisis-management",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crisis Management - Bogues Group",
    description:
      "Rapid-response crisis management and communications planning from Bogues Group.",
  },
};

export default function CrisisManagementPage() {
  const page = getPage("crisis-management");

  return (
    <>
      <Hero
        title="Crisis Management"
        subtitle="Rapid-response planning and execution to protect your reputation when it matters most"
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
