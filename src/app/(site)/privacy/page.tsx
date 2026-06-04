import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Privacy Policy - Bogues Group",
  description:
    "Read the Bogues Group privacy policy to understand how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy - Bogues Group",
    description:
      "How Bogues Group collects, uses, and protects your personal information.",
    type: "website",
    siteName: "Bogues Group",
    url: "/privacy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - Bogues Group",
    description:
      "How Bogues Group collects, uses, and protects your personal information.",
  },
};

export default function PrivacyPage() {
  const page = getPage("privacy");

  return (
    <>
      <Hero title="Privacy Policy" compact />
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
