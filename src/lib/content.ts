import pagesData from "@/data/pages.json";
import caseStudiesData from "@/data/case-studies.json";
import categoriesData from "@/data/categories.json";
import mediaLookup from "@/data/media-lookup.json";
import pressSlugsData from "@/data/press-slugs.json";
import { rewriteContentUrls, stripHtml, formatDate } from "./content-urls";
import { toMediaUrl } from "./media-url";
import { supabase } from "./supabase";

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
}

export interface BlogPost {
  id: number;
  wp_id: number | null;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  date: string;
  categories: number[];
  tags: number[];
  status: string;
  author: number;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

const pages = pagesData as WPContent[];
const caseStudies = caseStudiesData as WPContent[];
const categories = categoriesData as WPCategory[];
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

function blogPostToWPContent(post: BlogPost): WPContent {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    title: { rendered: post.title },
    content: { rendered: rewriteContentUrls(post.content) },
    excerpt: { rendered: post.excerpt || "" },
    featured_media: 0,
    author: post.author,
    categories: post.categories,
    link: `/blog/${post.slug}`,
    _supabaseId: post.id,
  };
}

export async function getAllPosts(): Promise<WPContent[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "publish")
    .order("date", { ascending: false });

  if (error) {
    console.error("Supabase error fetching posts:", error);
    return [];
  }

  return (data as BlogPost[]).map((post) => {
    const wp = blogPostToWPContent(post);
    // Use featured_image from Supabase if available, otherwise try media map
    if (post.featured_image) {
      wp._featuredImage = toMediaUrl(post.featured_image);
    }
    return wp;
  });
}

export async function getPost(slug: string): Promise<WPContent | undefined> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "publish")
    .single();

  if (error || !data) return undefined;

  const post = data as BlogPost;
  const wp = blogPostToWPContent(post);
  if (post.featured_image) {
    wp._featuredImage = toMediaUrl(post.featured_image);
  }
  return wp;
}

// --- Press Articles (filtered by curated slug list) ---

const pressSlugs = new Set(pressSlugsData as string[]);

export async function getPressPosts(): Promise<WPContent[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => pressSlugs.has(post.slug));
}

// --- Pages (still from static JSON) ---

export function getPage(slug: string): WPContent | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getAllPages(): WPContent[] {
  return pages;
}

// --- Case Studies (still from static JSON) ---

export function getAllCaseStudies(): WPContent[] {
  return caseStudies;
}

export function getCaseStudy(slug: string): WPContent | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

// --- Categories ---

export function getAllCategories(): WPCategory[] {
  return categories;
}

export function getCategoryName(id: number): string {
  return categories.find((c) => c.id === id)?.name || "Uncategorized";
}

