import { cache } from "react";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import { toMediaUrl } from "@/lib/media-url";
import type { CaseStudy, KeyMetric } from "@/lib/case-studies-shared";
import {
  parseCategories,
  parseIndustryTags,
} from "@/lib/case-studies-shared";

export type {
  CaseStudy,
  CaseStudyCategory,
  KeyMetric,
} from "@/lib/case-studies-shared";

export {
  getCategoryLabel,
  getCategoryTabLabel,
  getVimeoEmbedUrl,
  CASE_STUDY_TABS,
  isCaseStudyCategory,
  parseCategories,
  parseIndustryTags,
} from "@/lib/case-studies-shared";

const REVALIDATE_SECONDS = 3600;
const CACHE_TAG = "case-studies";

function parseKeyMetrics(raw: unknown): KeyMetric[] | null {
  if (raw === null || raw === undefined) return null;
  if (Array.isArray(raw)) {
    const metrics = raw.filter(
      (item): item is KeyMetric =>
        typeof item === "object" &&
        item !== null &&
        "label" in item &&
        "value" in item &&
        typeof item.label === "string" &&
        typeof item.value === "string"
    );
    return metrics.length > 0 ? metrics : null;
  }
  if (typeof raw === "string") {
    try {
      return parseKeyMetrics(JSON.parse(raw));
    } catch {
      return null;
    }
  }
  return null;
}

function normalizeCoverImage(url: string | null): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return toMediaUrl(trimmed);
}

function mapRow(row: Record<string, unknown>): CaseStudy {
  return {
    id: String(row.id ?? ""),
    slug: (row.slug as string) ?? "",
    title: (row.title as string) ?? "",
    client: (row.client as string) ?? "",
    categories: parseCategories(row.categories),
    industry_tags: parseIndustryTags(row.industry_tags),
    short_description: (row.short_description as string | null) ?? null,
    overview: (row.overview as string | null) ?? null,
    challenge: (row.challenge as string | null) ?? null,
    strategy: (row.strategy as string | null) ?? null,
    execution: (row.execution as string | null) ?? null,
    results: (row.results as string | null) ?? null,
    testimonial: (row.testimonial as string | null) ?? null,
    testimonial_author: (row.testimonial_author as string | null) ?? null,
    key_metrics: parseKeyMetrics(row.key_metrics),
    cover_image_url: normalizeCoverImage(row.cover_image_url as string | null),
    video_url: (row.video_url as string | null) ?? null,
    pdf_url: (row.pdf_url as string | null) ?? null,
    cta_label: (row.cta_label as string) ?? "",
    cta_url: (row.cta_url as string) ?? "",
    is_published: Boolean(row.is_published),
    sort_order: (row.sort_order as number) ?? 0,
    created_at: (row.created_at as string) ?? "",
    updated_at: (row.updated_at as string) ?? "",
  };
}

// Throwing inside unstable_cache callbacks keeps failed responses out of the cache.
const fetchAllCaseStudies = unstable_cache(
  async (): Promise<CaseStudy[]> => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  },
  ["case-studies:all"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
);

const fetchCaseStudyBySlug = unstable_cache(
  async (slug: string): Promise<CaseStudy | null> => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapRow(data as Record<string, unknown>) : null;
  },
  ["case-studies:by-slug"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
);

const fetchPublishedSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("slug")
      .eq("is_published", true);

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => row.slug as string);
  },
  ["case-studies:slugs"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
);

export const getAllCaseStudies = cache(async (): Promise<CaseStudy[]> => {
  try {
    return await fetchAllCaseStudies();
  } catch (err) {
    console.error("Case studies fetch failed:", err instanceof Error ? err.message : err);
    return [];
  }
});

export const getCaseStudy = cache(
  async (slug: string): Promise<CaseStudy | undefined> => {
    try {
      return (await fetchCaseStudyBySlug(slug)) ?? undefined;
    } catch (err) {
      console.error("Case study fetch failed:", err instanceof Error ? err.message : err);
      return undefined;
    }
  }
);

export const getPublishedCaseStudySlugs = cache(async (): Promise<string[]> => {
  try {
    return await fetchPublishedSlugs();
  } catch (err) {
    console.error("Case study slugs fetch failed:", err instanceof Error ? err.message : err);
    return [];
  }
});