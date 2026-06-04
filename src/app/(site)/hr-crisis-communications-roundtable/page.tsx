import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "HR Crisis Communications Roundtable - Bogues Group",
  description:
    "Crisis-ready communication for hotels that protects your brand, staff, and guests. A proven framework for HR and hotel leaders.",
  openGraph: {
    title: "HR Crisis Communications Roundtable - Bogues Group",
    description:
      "A proven framework for HR and hotel leaders to respond quickly, clearly, and compassionately before, during, and after a crisis.",
    type: "website",
    siteName: "Bogues Group",
    url: "/hr-crisis-communications-roundtable",
  },
  twitter: {
    card: "summary_large_image",
    title: "HR Crisis Communications Roundtable - Bogues Group",
    description:
      "A proven framework for HR and hotel leaders to respond quickly, clearly, and compassionately before, during, and after a crisis.",
  },
};

export default function HRCrisisRoundtablePage() {
  const page = getPage("hr-crisis-communications-roundtable");

  return (
    <>
      <Hero
        title="HR Crisis Communications Roundtable"
        subtitle="Crisis-ready communication for hotels that protects your brand, staff, and guests"
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
