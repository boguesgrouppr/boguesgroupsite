import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Testimonials - Bogues Group",
  description:
    "Hear what clients say about working with Bogues Group, North Carolina's premier PR and marketing firm.",
  openGraph: {
    title: "Testimonials - Bogues Group",
    description:
      "Hear what clients say about working with Bogues Group, North Carolina's premier PR and marketing firm.",
    type: "website",
    siteName: "Bogues Group",
    url: "/testimonials",
  },
  twitter: {
    card: "summary_large_image",
    title: "Testimonials - Bogues Group",
    description:
      "Hear what clients say about working with Bogues Group, North Carolina's premier PR and marketing firm.",
  },
};

export default function TestimonialsPage() {
  const page = getPage("testimonials");

  return (
    <>
      <Hero
        title="Testimonials"
        subtitle="What our clients say about working with us"
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
