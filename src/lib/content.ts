import pagesData from "@/data/pages.json";
import caseStudiesData from "@/data/case-studies.json";
import categoriesData from "@/data/categories.json";
import mediaData from "@/data/media.json";
import pressSlugsData from "@/data/press-slugs.json";
import { supabase } from "./supabase";

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

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  title: { rendered: string };
  media_details?: {
    width: number;
    height: number;
    sizes?: Record<string, { source_url: string; width: number; height: number }>;
  };
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
const media = mediaData as unknown as WPMedia[];

// Media lookup
const mediaMap = new Map(media.map((m) => [m.id, m]));

// Strip WordPress image size suffixes (e.g., "-300x300", "-1024x768") from filenames
// so URLs point to the original full-size file we have locally.
function stripWpSizeSuffix(url: string): string {
  return url.replace(/-\d+x\d+(\.\w+)$/, "$1");
}

// Rewrite media URLs from WordPress to local /media/ paths
function rewriteMediaUrl(url: string): string {
  return url.replace(
    /https?:\/\/(?:www\.)?boguesgroup\.com\/wp-content\/uploads\//g,
    "/media/"
  );
}

export function getMediaUrl(id: number): string | null {
  const item = mediaMap.get(id);
  if (!item) return null;
  return rewriteMediaUrl(item.source_url);
}

// Rewrite WordPress content URLs to local /media/ paths and strip size suffixes.
// Also rewrite dead WordPress registration/account URLs to /contact.
export function rewriteContentUrls(html: string): string {
  return html
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/wp-content\/uploads\/([^"'\s<>]+)/g,
      (_match, path: string) => {
        // Strip size suffix so it resolves to the original file
        const cleanPath = stripWpSizeSuffix("/media/" + path);
        return cleanPath;
      }
    )
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/register\/[^"'\s<>]*/g,
      "/contact?inquiry=workbook"
    )
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/my-account\/[^"'\s<>]*/g,
      "/contact?inquiry=account"
    );
}

export function getMediaAlt(id: number): string {
  return mediaMap.get(id)?.alt_text || "";
}

// --- Blog Posts (from Supabase) ---

function blogPostToWPContent(post: BlogPost): WPContent {
  return {
    id: post.wp_id || post.id,
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
      wp._featuredImage = post.featured_image;
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
    wp._featuredImage = post.featured_image;
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

// Strip HTML tags for plain text excerpts
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&#8211;/g, "-").replace(/&#038;/g, "&").replace(/&nbsp;/g, " ").replace(/\[\.\.\.\]/g, "...").trim();
}

// Format date
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
