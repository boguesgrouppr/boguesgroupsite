export const SITE_URL = "https://www.boguesgroup.com" as const;

export interface RedirectRule {
  source: string;
  destination: string;
  permanent: true;
}

const toWww = (path: string): string => `${SITE_URL}${path}`;

/**
 * Legacy WordPress and renamed-route redirects.
 * Destinations are absolute www URLs so apex requests resolve in a single hop.
 */
export const LEGACY_REDIRECTS: readonly RedirectRule[] = [
  { source: "/small-business-hub", destination: toWww("/brand-builder-hub"), permanent: true },
  { source: "/small-business-hub/:path*", destination: toWww("/brand-builder-hub"), permanent: true },

  // WP trashed posts (e.g. /blog/__trashed-4) still receiving impressions
  { source: "/blog/:slug(__trashed.*)", destination: toWww("/blog"), permanent: true },

  // WP taxonomy archives
  { source: "/category/:path*", destination: toWww("/blog"), permanent: true },
  { source: "/tag/:path*", destination: toWww("/blog"), permanent: true },

  // TODO: append one-to-one mappings from the Search Console 404 export
];