import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "About Us - Bogues Group",
  description:
    "Learn about Bogues Group, North Carolina's premier public relations firm delivering strategic communications and brand storytelling.",
  openGraph: {
    title: "About Us - Bogues Group",
    description:
      "Learn about Bogues Group, North Carolina's premier public relations firm delivering strategic communications and brand storytelling.",
    type: "website",
    siteName: "Bogues Group",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Bogues Group",
    description:
      "Learn about Bogues Group, North Carolina's premier public relations firm delivering strategic communications and brand storytelling.",
  },
};

export default function AboutPage() {
  const page = getPage("about-us");

  return (
    <>
      <Hero
        title="About Us"
        subtitle="North Carolina's Premier PR Firm"
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
