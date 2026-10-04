import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://www.boguesgroup.com';

interface SlugRow {
  slug: string;
  updated_at: string | null;
}

const STATIC_ROUTES: ReadonlyArray<{ path: string; priority: number }> = [
  { path: '', priority: 1 },
  { path: '/about', priority: 0.7 },
  { path: '/meet-the-founder', priority: 0.7 },
  { path: '/contact', priority: 0.7 },
  { path: '/blog', priority: 0.7 },
  { path: '/case-studies', priority: 0.7 },
  { path: '/speaker-roster', priority: 0.7 },
];

async function fetchSlugs(table: string, publishedFilter: boolean): Promise<SlugRow[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  let query = supabase.from(table).select('slug, updated_at');
  if (publishedFilter) query = query.eq('is_published', true);

  const { data, error } = await query;
  if (error) {
    console.error(`sitemap: failed to load ${table}`, error.message);
    return [];
  }
  return (data ?? []) as SlugRow[];
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const caseStudies = await fetchSlugs('case_studies', true);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'monthly',
    priority,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies
    .filter((row) => /^[a-z0-9-]+$/.test(row.slug))
    .map((row) => ({
      url: `${SITE_URL}/case-studies/${row.slug}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [...staticEntries, ...caseStudyEntries];
}