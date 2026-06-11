import { Metadata } from "next";
import { notFound } from "next/navigation";
import NavLink from "@/components/NavLink";
import VimeoEmbed from "@/components/case-studies/VimeoEmbed";
import {
  getCaseStudy,
  getCategoryLabel,
  getPublishedCaseStudySlugs,
} from "@/lib/case-studies";
import { toAbsoluteMediaUrl } from "@/lib/media-url";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);
  if (!caseStudy) return { title: "Case Study Not Found" };

  const title = `${caseStudy.title} - Bogues Group`;
  const description =
    caseStudy.short_description?.slice(0, 160) ??
    `Case study: ${caseStudy.title}`;
  const imageUrl = toAbsoluteMediaUrl(caseStudy.cover_image_url ?? "");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Bogues Group",
      url: `/case-studies/${slug}`,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

function ContentSection({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section>
      <div className="mb-4 h-1 w-12 rounded-full bg-gold" />
      <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
        {title}
      </h2>
      <div className="prose prose-lg mt-4 max-w-none text-body prose-p:leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const hasCta = Boolean(caseStudy.cta_label && caseStudy.cta_url);

  return (
    <div>
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <NavLink
            href="/case-studies"
            className="mb-6 inline-flex items-center text-sm text-white/70 transition-colors hover:text-gold"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Case Studies
          </NavLink>

          <h1 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {caseStudy.title}
          </h1>
          <p className="mt-4 text-lg text-white/80">{caseStudy.client}</p>

          {caseStudy.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {caseStudy.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold"
                >
                  {getCategoryLabel(category)}
                </span>
              ))}
            </div>
          )}

          {caseStudy.industry_tags.length > 0 && (
            <p className="mt-3 text-sm text-white/60">
              {caseStudy.industry_tags.join(" · ")}
            </p>
          )}

          {caseStudy.cover_image_url && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl shadow-xl">
              <img
                src={caseStudy.cover_image_url}
                alt={caseStudy.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}

          {caseStudy.key_metrics && caseStudy.key_metrics.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {caseStudy.key_metrics.map((metric, index) => (
                <div
                  key={`${metric.label}-${index}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center sm:px-4 sm:py-5"
                >
                  <p className="font-heading text-xl font-bold text-gold sm:text-2xl">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase leading-tight tracking-wider text-white/70 sm:text-xs">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-12 px-6 py-12 md:space-y-14 md:py-16">
        {caseStudy.overview && (
          <ContentSection title="Overview" body={caseStudy.overview} />
        )}
        {caseStudy.challenge && (
          <ContentSection title="Challenge" body={caseStudy.challenge} />
        )}
        {caseStudy.strategy && (
          <ContentSection title="Strategy" body={caseStudy.strategy} />
        )}
        {caseStudy.execution && (
          <ContentSection title="Execution" body={caseStudy.execution} />
        )}
        {caseStudy.results && (
          <ContentSection title="Results" body={caseStudy.results} />
        )}

        {caseStudy.testimonial && (
          <section className="rounded-2xl border-l-4 border-gold bg-gray-50 px-8 py-8">
            <blockquote className="font-heading text-xl italic leading-relaxed text-navy md:text-2xl">
              &ldquo;{caseStudy.testimonial}&rdquo;
            </blockquote>
            {caseStudy.testimonial_author && (
              <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                {caseStudy.testimonial_author}
              </p>
            )}
          </section>
        )}

        {hasCta && (
          <section className="pt-2">
            {caseStudy.cta_url.startsWith("http") ? (
              <a
                href={caseStudy.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
              >
                {caseStudy.cta_label}
              </a>
            ) : (
              <NavLink
                href={caseStudy.cta_url}
                className="inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
              >
                {caseStudy.cta_label}
              </NavLink>
            )}
          </section>
        )}

        {caseStudy.pdf_url && (
          <section>
            <a
              href={caseStudy.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-navy px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </a>
          </section>
        )}

        {caseStudy.video_url && (
          <section>
            <div className="mb-6 h-1 w-12 rounded-full bg-gold" />
            <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
              Video
            </h2>
            <div className="mt-6">
              <VimeoEmbed
                videoUrl={caseStudy.video_url}
                title={caseStudy.title}
              />
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
