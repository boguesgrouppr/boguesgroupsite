import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Meet the Founder - Brittney Bogues - Bogues Group",
  description:
    "Meet Brittney Bogues, founder of Bogues Group. A serial entrepreneur with a Masters in communications and a passion for strategic brand storytelling.",
  openGraph: {
    title: "Meet the Founder - Brittney Bogues - Bogues Group",
    description:
      "Meet Brittney Bogues, founder of Bogues Group and serial entrepreneur with a Masters in communications.",
    type: "website",
    siteName: "Bogues Group",
    url: "/meet-the-founder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the Founder - Brittney Bogues - Bogues Group",
    description:
      "Meet Brittney Bogues, founder of Bogues Group and serial entrepreneur with a Masters in communications.",
  },
};

export default function MeetTheFounderPage() {
  const page = getPage("meet-the-founder");

  return (
    <>
      <Hero
        title="Meet the Founder"
        subtitle="Brittney Bogues, Founder and Chief Impact Officer"
      />
      <section className="max-w-4xl mx-auto px-6 py-16">
        {page ? (
          <ContentRenderer html={page.content.rendered} />
        ) : (
          <p className="text-gray-500 text-center">Content coming soon.</p>
        )}

        {/* Founder Video */}
        <div className="mt-12 aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/GD-tqj4v_78"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </section>
    </>
  );
}
