import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Small Business Hub - Bogues Group",
  description:
    "Resources, solutions, and support for small business owners to build their brand, spread their story, and connect with customers.",
  openGraph: {
    title: "Small Business Hub - Bogues Group",
    description:
      "Resources and solutions for small business owners from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/small-business-hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Small Business Hub - Bogues Group",
    description:
      "Resources and solutions for small business owners from Bogues Group.",
  },
};

export default function SmallBusinessHubPage() {
  const page = getPage("small-business-hub");

  return (
    <>
      <Hero
        title="Small Business Hub"
        subtitle="Build your brand, spread your story, connect with customers"
      />
      <section className="max-w-4xl mx-auto px-6 py-16">
        {page ? (
          <ContentRenderer html={page.content.rendered} />
        ) : (
          <p className="text-gray-500 text-center">Content coming soon.</p>
        )}

        {/* Intro Video */}
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
      </section>
    </>
  );
}
