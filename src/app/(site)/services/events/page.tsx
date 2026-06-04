import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Events & Public Affairs - Bogues Group",
  description:
    "Stress-free, fun event planning that meets your goals, exceeds expectations, and makes the best impression. Corporate and public affairs events by Bogues Group.",
  openGraph: {
    title: "Events & Public Affairs - Bogues Group",
    description:
      "Corporate and public affairs event planning that exceeds expectations.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/events",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events & Public Affairs - Bogues Group",
    description:
      "Corporate and public affairs event planning that exceeds expectations.",
  },
};

export default function EventsPage() {
  const page = getPage("events");

  return (
    <>
      <Hero
        title="Events & Public Affairs"
        subtitle="Stress-free planning that meets your goals, exceeds expectations, and makes the best impression"
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
