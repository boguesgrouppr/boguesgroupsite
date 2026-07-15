import { Metadata } from "next";
import BlogPostGrid from "@/components/BlogPostGrid";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import { createServerActionClient } from "@/lib/supabase/server";
import { getSiteOrigin, toMediaUrl } from "@/lib/media-url";
import { formatDate } from "@/lib/content-urls";

export const dynamic = "force-static";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog - Bogues Group",
  description:
    "Stay up to date with the latest news, insights, and stories from Bogues Group, North Carolina's premier PR firm.",
  openGraph: {
    title: "Blog - Bogues Group",
    description:
      "Stay up to date with the latest news, insights, and stories from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Bogues Group",
    description:
      "Stay up to date with the latest news, insights, and stories from Bogues Group.",
  },
};

export default async function BlogPage() {
  const supabase = await createServerActionClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, featured_image, date")
    .eq("status", "publish")
    .order("date", { ascending: false });

  const mapped = (posts ?? []).map((p) => ({
    ...p,
    featured_image: p.featured_image ? toMediaUrl(p.featured_image) : null,
    date: formatDate(p.date ?? new Date().toISOString()),
  }));

  const blogIndexSchema = {
    "@type": "CollectionPage",
    name: "Blog - Bogues Group",
    description:
      "Stay up to date with the latest news, insights, and stories from Bogues Group.",
    url: `${getSiteOrigin()}/blog`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: (posts ?? []).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${getSiteOrigin()}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <div>
      <JsonLd data={blogIndexSchema} />
      <Hero
        title="Blog"
        subtitle="News, insights, and stories from the Bogues Group team."
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <BlogPostGrid posts={mapped} showCount />
      </section>
    </div>
  );
}
