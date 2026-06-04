import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCaseStudies,
  getCaseStudy,
  getMediaUrl,
  getMediaAlt,
  stripHtml,
  formatDate,
} from "@/lib/content";
import ContentRenderer from "@/components/ContentRenderer";
import FeaturedImage from "@/components/FeaturedImage";

export function generateStaticParams() {
  const caseStudies = getAllCaseStudies();
  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return { title: "Case Study Not Found" };

  const title = `${stripHtml(caseStudy.title.rendered)} - Bogues Group`;
  const description = stripHtml(caseStudy.excerpt.rendered).slice(0, 160);
  const imageUrl = getMediaUrl(caseStudy.featured_media);

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

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const imageUrl = getMediaUrl(caseStudy.featured_media);
  const imageAlt = getMediaAlt(caseStudy.featured_media);

  return (
    <div>
      {/* Hero / Header */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/case-studies"
            className="mb-6 inline-flex items-center text-sm text-white/70 transition-colors hover:text-gold"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Case Studies
          </Link>
          <h1 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {stripHtml(caseStudy.title.rendered)}
          </h1>
          <time className="mt-4 block text-white/70">
            {formatDate(caseStudy.date)}
          </time>
        </div>
      </section>

      {/* Featured Image */}
      {imageUrl && (
        <FeaturedImage src={imageUrl} alt={imageAlt} priority />
      )}

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-12">
        <ContentRenderer html={caseStudy.content.rendered} />
      </article>
    </div>
  );
}
