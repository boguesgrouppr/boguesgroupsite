import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Education and Training - Bogues Group",
  description:
    "Upskilling businesses, schools, and creatives through PR, branding, and storytelling education from Bogues Group.",
  openGraph: {
    title: "Education and Training - Bogues Group",
    description:
      "PR, branding, and storytelling education for businesses, schools, and creatives.",
    type: "website",
    siteName: "Bogues Group",
    url: "/education",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education and Training - Bogues Group",
    description:
      "PR, branding, and storytelling education for businesses, schools, and creatives.",
  },
};

export default function EducationPage() {
  const page = getPage("education");

  return (
    <>
      <Hero
        title="Education & Training"
        subtitle="Upskilling businesses, schools, and creatives through PR, branding, and storytelling education"
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
