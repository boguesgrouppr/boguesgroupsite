import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPost,
  getMediaUrl,
  getMediaAlt,
  stripHtml,
  formatDate,
} from "@/lib/content";
import ContentRenderer from "@/components/ContentRenderer";
import FeaturedImage from "@/components/FeaturedImage";
import PageViewTracker from "@/components/PageViewTracker";
import { toAbsoluteMediaUrl } from "@/lib/media-url";
import { supabase } from "@/lib/supabase";

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "publish");

  return posts?.map(({ slug }) => ({ slug })) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };

  const title = `${stripHtml(post.title.rendered)} - Bogues Group`;
  const description = stripHtml(post.excerpt.rendered).slice(0, 160);
  const imageUrl = toAbsoluteMediaUrl(
    post._featuredImage || getMediaUrl(post.featured_media) || ""
  );

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Bogues Group",
      url: `/blog/${slug}`,
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const imageUrl =
    post._featuredImage || getMediaUrl(post.featured_media) || "";
  const imageAlt = getMediaAlt(post.featured_media);

  return (
    <div>
      {post._supabaseId && (
        <PageViewTracker postId={post._supabaseId} path={`/blog/${slug}`} />
      )}
      {/* Hero / Header */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/blog"
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
            Back to Blog
          </Link>
          <h1 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {stripHtml(post.title.rendered)}
          </h1>
          <time className="mt-4 block text-white/70">
            {formatDate(post.date)}
          </time>
        </div>
      </section>

      {/* Featured Image */}
      {imageUrl && (
        <FeaturedImage src={imageUrl} alt={imageAlt} priority />
      )}

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-12">
        <ContentRenderer html={post?.content?.rendered ?? ""} />
      </article>
    </div>
  );
}
