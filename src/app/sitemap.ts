import type { MetadataRoute } from 'next';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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
  { path: '/services', priority: 0.7 },
  { path: '/brand-builder-hub', priority: 0.7 },
  { path: '/cannabis-fund', priority: 0.6 },
  { path: '/cpcc', priority: 0.6 },
  { path: '/press-room', priority: 0.5 },
  { path: '/privacy', priority: 0.3 },
  { path: '/terms', priority: 0.3 },
];

// Published rows that should not be in the sitemap (duplicates / junk).
// Prefer noindex, a merge, or a 301 on the page itself; this keeps them out meanwhile.
const EXCLUDED_BLOG_SLUGS: ReadonlySet<string> = new Set([
  'bg-interview-brittney-bogues-ynz8k',
  'bg-interview-jodi-rizzo-5ofjq',
  'fall-intern-spotlight-paris-clark-ba4i5',
  '06q7huklb03xbzsd43tjdncqfguwil-da6kh',
  'holiday-wishes-from-bg-9h6e4',
  'narcan-to-be-part-of-charlotte-abc-store-renovation-devices-coming-to-all-mecklenburg-county-stores-2',
  '3ctlvjstnmsutdrdzfl07iu627z99a',
  '9n69wkt9zpm6s3ahm9dxkuklopvezd',
  'coasvyazwc5qauo8uv11uuadodvrs5',
  '2019-06-04-2019-6-4-s98g20gxhrhosn76z8qhel3196m3ab',
  '2019-09-26-2019-9-26-biumeaqmstvtg14xka2x6b80g6ric0',
]);

const SLUG_PATTERN = /^[a-z0-9-]+$/;

async function fetchSlugs(
  supabase: SupabaseClient,
  table: 'case_studies' | 'blog_posts',
  filterColumn: string,
  filterValue: string | boolean,
): Promise<SlugRow[]> {
  const withDates = await supabase
    .from(table)
    .select('slug, updated_at')
    .eq(filterColumn, filterValue);

  if (!withDates.error) return (withDates.data ?? []) as SlugRow[];

  // updated_at may not exist on every table; retry with slug only.
  const slugOnly = await supabase.from(table).select('slug').eq(filterColumn, filterValue);
  if (slugOnly.error) {
    // Throw rather than return []: a failed revalidation should keep the last
    // good sitemap instead of caching one with the section missing.
    throw new Error(`sitemap: failed to load ${table}: ${slugOnly.error.message}`);
  }
  return ((slugOnly.data ?? []) as Array<{ slug: string }>).map(({ slug }) => ({
    slug,
    updated_at: null,
  }));
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [caseStudies, blogPosts] = await Promise.all([
    fetchSlugs(supabase, 'case_studies', 'is_published', true),
    fetchSlugs(supabase, 'blog_posts', 'status', 'publish'),
  ]);

  // An empty result almost always means a silent failure (restricted project,
  // RLS change), not a site with no content. Fail loudly instead.
  if (caseStudies.length === 0 || blogPosts.length === 0) {
    throw new Error(
      `sitemap: unexpected empty result (case_studies=${caseStudies.length}, blog_posts=${blogPosts.length})`,
    );
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'monthly',
    priority,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies
    .filter((row) => SLUG_PATTERN.test(row.slug))
    .map((row) => ({
      url: `${SITE_URL}/case-studies/${row.slug}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  // SLUG_PATTERN also drops the "__trashed-N" slugs (underscores).
  const blogEntries: MetadataRoute.Sitemap = blogPosts
    .filter((row) => SLUG_PATTERN.test(row.slug) && !EXCLUDED_BLOG_SLUGS.has(row.slug))
    .map((row) => ({
      url: `${SITE_URL}/blog/${row.slug}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

  return [...staticEntries, ...caseStudyEntries, ...blogEntries];
}