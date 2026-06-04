import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Messaging & Positioning - Bogues Group",
  description:
    "Expert messaging and brand positioning services from Bogues Group. We help you define your voice, craft your narrative, and position your brand for growth.",
  openGraph: {
    title: "Messaging & Positioning - Bogues Group",
    description:
      "Define your voice, craft your narrative, and position your brand for growth.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services/messaging-positioning",
  },
  twitter: {
    card: "summary_large_image",
    title: "Messaging & Positioning - Bogues Group",
    description:
      "Define your voice, craft your narrative, and position your brand for growth.",
  },
};

export default function MessagingPositioningPage() {
  const page = getPage("messaging-positioning");

  return (
    <>
      <Hero
        title="Messaging & Positioning"
        subtitle="Define your voice, craft your narrative, and position your brand for growth"
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
