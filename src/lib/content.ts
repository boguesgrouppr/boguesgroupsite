import { cache } from "react";
import pagesData from "@/data/pages.json";
import pressSlugsData from "@/data/press-slugs.json";
import mediaLookup from "@/data/media-lookup.json";
import { rewriteContentUrls, stripHtml, formatDate } from "./content-urls";
import { toMediaUrl } from "./media-url";
import { supabase } from "./supabase";
import { getServiceContent } from "@/data/service-content";

export { rewriteContentUrls, stripHtml, formatDate } from "./content-urls";

export interface WPContent {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  author: number;
  categories?: number[];
  case_study_categories?: number[];
  link: string;
  _featuredImage?: string;
  _supabaseId?: number;
  _pdfUrl?: string | null;
}

export interface BlogPost {
  id: number;
  wp_id: number | null;
  slug: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  date: string | null;
  categories: number[] | null;
  tags: number[] | null;
  status: string;
  author: number | null;
  pdf_url?: string | null;
}

interface BlogPostListRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  date: string | null;
  author: number | null;
  categories: number[] | null;
}

const pages = pagesData as WPContent[];
const pressSlugs = new Set(pressSlugsData as string[]);
const mediaById = mediaLookup as Record<string, string[]>;

export function getMediaUrl(id: number): string | null {
  const entry = mediaById[String(id)];
  if (!entry?.[0]) return null;
  return toMediaUrl(entry[0]);
}

export function getMediaAlt(id: number): string {
  return mediaById[String(id)]?.[1] ?? "";
}

// --- Blog Posts (from Supabase) ---

function blogPostListRowToWPContent(post: BlogPostListRow): WPContent {
  const wp: WPContent = {
    id: post.id,
    slug: post.slug ?? "",
    date: post.date ?? new Date().toISOString(),
    title: { rendered: post.title ?? "" },
    content: { rendered: "" },
    excerpt: { rendered: post.excerpt ?? "" },
    featured_media: 0,
    author: post.author ?? 0,
    categories: post.categories ?? [],
    link: `/blog/${post.slug ?? ""}`,
    _supabaseId: post.id,
  };

  if (post.featured_image) {
    wp._featuredImage = toMediaUrl(post.featured_image);
  }

  return wp;
}

function blogPostToWPContent(post: BlogPost): WPContent {
  const wp: WPContent = {
    id: post.id,
    slug: post.slug ?? "",
    date: post.date ?? new Date().toISOString(),
    title: { rendered: post.title ?? "" },
    content: { rendered: rewriteContentUrls(post.content ?? "") },
    excerpt: { rendered: post.excerpt ?? "" },
    featured_media: 0,
    author: post.author ?? 0,
    categories: post.categories ?? [],
    link: `/blog/${post.slug ?? ""}`,
    _supabaseId: post.id,
    _pdfUrl: post.pdf_url ?? null,
  };

  if (post.featured_image) {
    wp._featuredImage = toMediaUrl(post.featured_image);
  }

  return wp;
}

/** Listing query — card fields only; avoids loading full post HTML bodies. */
export const getAllPosts = cache(async (): Promise<WPContent[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, featured_image, date, author, categories")
    .eq("status", "publish")
    .order("date", { ascending: false });

  if (error) {
    console.error("Supabase error fetching posts:", error);
    return [];
  }

  return (data as BlogPostListRow[]).map(blogPostListRowToWPContent);
});

export const getPost = cache(
  async (slug: string): Promise<WPContent | undefined> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "publish")
      .single();

    if (error || !data) return undefined;

    return blogPostToWPContent(data as BlogPost);
  }
);

// --- Press Articles (filtered by curated slug list) ---

export async function getPressPosts(): Promise<WPContent[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => pressSlugs.has(post.slug));
}

// --- Pages (still from static JSON) ---

export function getPage(slug: string): WPContent | undefined {
  const page = pages.find((p) => p.slug === slug);
  const serviceContent = getServiceContent(slug);

  return page && serviceContent
    ? { ...page, content: { ...page.content, rendered: serviceContent } }
    : page;
}
