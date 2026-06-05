import NavLink from "@/components/NavLink";
import Hero from "@/components/Hero";
import ContentRenderer from "@/components/ContentRenderer";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Extra Squeeze Grant - Community PR by Bogues Group",
  description:
    "The Extra Squeeze Grant uplifts local brands one story at a time. Community-powered PR support from Bogues Group for small businesses that deserve visibility.",
  openGraph: {
    title: "Extra Squeeze Grant - Community PR by Bogues Group",
    description:
      "Uplifting local brands one story at a time through community-powered PR support.",
    type: "website",
    siteName: "Bogues Group",
    url: "/extra-squeeze-grant",
  },
  twitter: {
    card: "summary_large_image",
    title: "Extra Squeeze Grant - Community PR by Bogues Group",
    description:
      "Uplifting local brands one story at a time through community-powered PR support.",
  },
};

/**
 * Replace stale placeholder text from the static Elementor HTML.
 * The 2026 cycle is already active, so remove the "Launching late February" line.
 */
function patchContent(html: string): string {
  return html.replace(
    "The squeeze continues in 2026. Launching late February.",
    "The 2026 cycle is live. New recipients announced monthly."
  );
}

export default function ExtraSqueezeGrantPage() {
  const page = getPage("extra-squeeze-grant-community-pr-by-bogues-group");

  return (
    <>
      <Hero
        title="The Extra Squeeze Grant"
        subtitle="Uplifting local brands one story at a time"
        ctaText="Apply Now"
        ctaHref="/contact"
      />
      <section className="max-w-4xl mx-auto px-6 py-16">
        {page ? (
          <ContentRenderer html={patchContent(page.content?.rendered ?? "")} />
        ) : (
          <p className="text-gray-500 text-center">Content coming soon.</p>
        )}

        {/* Extra Squeeze Grant Video */}
        <div className="mt-12 aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src="https://player.vimeo.com/video/1102151786"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </section>

      {/* April 2026 Winner */}
      <section className="bg-[#f8f6f1] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] items-start">
            {/* Left column: month label + name */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#D4AF38]">
                April&apos;s Main Squeeze
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-[#021f2e]">
                Mia Nguyen
              </h2>
            </div>

            {/* Right column: description */}
            <div className="space-y-4 text-base leading-relaxed text-[#3a3a3a]">
              <p>
                April&apos;s Extra Squeeze Grant recipient is Mia Nguyen, selected
                through the ongoing partnership between CLT F.I.V.E., Charlotte
                Is Creative, Springclean, and Bogues Group. Mia brought a pop-up
                activation to Camp North End, spotlighting local creatives and
                building community through shared space and storytelling.
              </p>
              <p>
                Through the Extra Squeeze Grant, Mia received PR support to
                amplify her work and connect with a wider audience across
                Charlotte.
              </p>
              <NavLink
                href="/blog/extra-squeeze-grant-april-2026-mia-nguyen"
                className="inline-flex items-center gap-2 rounded bg-[#021f2e] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#021f2e]/80 hover:text-[#D4AF38]"
              >
                Read the full story
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Jarrell Wallace */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#021f2e] mb-8 text-center">
            Jarrell Wallace
          </h2>
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/bVOzmAU54Eg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
