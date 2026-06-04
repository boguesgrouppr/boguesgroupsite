import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Sports & Entertainment PR - Bogues Group",
  description:
    "From athlete branding to franchise communications, Bogues Group understands the pace and stakes of sports and entertainment public relations.",
  openGraph: {
    title: "Sports & Entertainment PR - Bogues Group",
    description:
      "Athlete branding, franchise communications, and entertainment PR from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/industries/sports-and-entertainment",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports & Entertainment PR - Bogues Group",
    description:
      "Athlete branding, franchise communications, and entertainment PR from Bogues Group.",
  },
};

export default function SportsEntertainmentPage() {
  const page = getPage("sports-and-entertainment");

  return (
    <>
      <Hero
        title="Sports & Entertainment"
        subtitle="From athlete branding to franchise communications, we understand the pace and stakes"
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
