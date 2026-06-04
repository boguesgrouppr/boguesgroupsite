import { Metadata } from "next";
import { getAllPosts, getMediaUrl, getMediaAlt, stripHtml, formatDate } from "@/lib/content";
import Card from "@/components/Card";
import Hero from "@/components/Hero";

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
  const posts = await getAllPosts();

  return (
    <div>
      <Hero
        title="Blog"
        subtitle="News, insights, and stories from the Bogues Group team."
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-8 text-sm text-gray-500">
          {posts.length} articles
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const imageUrl = post._featuredImage || getMediaUrl(post.featured_media);
            return (
              <Card
                key={post.id}
                title={post.title.rendered}
                excerpt={stripHtml(post.excerpt.rendered)}
                slug={post.slug}
                href={`/blog/${post.slug}`}
                imageUrl={imageUrl}
                imageAlt={getMediaAlt(post.featured_media)}
                date={formatDate(post.date)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
