import Card from "@/components/Card";
import { stripHtml } from "@/lib/content-urls";

export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  date: string;
}

interface BlogPostGridProps {
  posts: BlogPostRow[];
  limit?: number;
  showCount?: boolean;
}

export default function BlogPostGrid({
  posts,
  limit,
  showCount = false,
}: BlogPostGridProps) {
  const visible = limit ? posts.slice(0, limit) : posts;

  return (
    <>
      {showCount && (
        <p className="mb-8 text-sm text-gray-500">
          {visible.length} article{visible.length !== 1 ? "s" : ""}
        </p>
      )}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <Card
            key={post.id}
            title={post.title}
            excerpt={stripHtml(post.excerpt)}
            slug={post.slug}
            href={`/blog/${post.slug}`}
            imageUrl={post.featured_image}
            imageAlt=""
            date={post.date}
          />
        ))}
      </div>
    </>
  );
}
