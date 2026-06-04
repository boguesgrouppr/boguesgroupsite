import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Newsletter Sign Up - Bogues Group",
  description:
    "Subscribe to the Bogues Group newsletter for the latest PR insights, brand-building tips, and community updates.",
  openGraph: {
    title: "Newsletter Sign Up - Bogues Group",
    description:
      "Subscribe for the latest PR insights, brand-building tips, and community updates from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/newsletter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsletter Sign Up - Bogues Group",
    description:
      "Subscribe for the latest PR insights, brand-building tips, and community updates from Bogues Group.",
  },
};

export default function NewsletterPage() {
  const page = getPage("newsletter-sign-up");

  return (
    <>
      <Hero
        title="BG Newsletter"
        subtitle="Stay in the loop with PR insights, brand-building tips, and community updates"
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
