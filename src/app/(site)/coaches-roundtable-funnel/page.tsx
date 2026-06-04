import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Brand Builder Coaches Roundtable - Bogues Group",
  description:
    "Turn your community into a revenue stream with the Brand Builder Affiliate Program. Join the Coaches Roundtable to learn how you can earn by empowering entrepreneurs.",
  openGraph: {
    title: "Brand Builder Coaches Roundtable - Bogues Group",
    description:
      "Turn your community into a revenue stream with the Brand Builder Affiliate Program.",
    type: "website",
    siteName: "Bogues Group",
    url: "/coaches-roundtable-funnel",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Builder Coaches Roundtable - Bogues Group",
    description:
      "Turn your community into a revenue stream with the Brand Builder Affiliate Program.",
  },
};

/**
 * Remove the duplicate "What your clients want most?" icon-box block.
 * Element b888428 is an exact duplicate of element 05f19a4 (same heading + description).
 */
function removeDuplicateBlock(html: string): string {
  const marker = 'elementor-element-b888428';
  const idx = html.indexOf(marker);
  if (idx === -1) return html;

  // Walk backwards to find the opening <div
  const divOpen = html.lastIndexOf('<div', idx);
  if (divOpen === -1) return html;

  // Count nested divs to find the matching close
  let depth = 0;
  let i = divOpen;
  while (i < html.length) {
    if (html.startsWith('<div', i)) {
      depth++;
      i += 4;
    } else if (html.startsWith('</div>', i)) {
      depth--;
      if (depth === 0) {
        // Remove the block (including the closing </div>)
        return html.slice(0, divOpen) + html.slice(i + 6);
      }
      i += 6;
    } else {
      i++;
    }
  }
  return html;
}

export default function CoachesRoundtableFunnelPage() {
  const page = getPage("coaches-roundtable-funnel");

  const cleanedHtml = page
    ? removeDuplicateBlock(page.content.rendered)
    : "";

  return (
    <>
      <Hero
        title="Coaches Roundtable"
        subtitle="Turn your community into a revenue stream with the Brand Builder Affiliate Program"
      />
      <section className="max-w-4xl mx-auto px-6 py-16">
        {page ? (
          <ContentRenderer html={cleanedHtml} />
        ) : (
          <p className="text-gray-500 text-center">Content coming soon.</p>
        )}
      </section>
    </>
  );
}
