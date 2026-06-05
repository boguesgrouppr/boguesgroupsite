import BlogPostGrid, { type BlogPostRow } from "@/components/BlogPostGrid";

interface HomeBlogPostsProps {
  posts: BlogPostRow[];
}

export default function HomeBlogPosts({ posts }: HomeBlogPostsProps) {
  return <BlogPostGrid posts={posts} limit={3} />;
}
