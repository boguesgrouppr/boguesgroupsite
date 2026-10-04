   import type { MetadataRoute } from 'next';

   const SITE_URL = 'https://www.boguesgroup.com';

   export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
     const staticRoutes = ['', '/about', '/meet-the-founder', '/contact', '/blog', '/case-studies', '/speaker-roster'];
     return staticRoutes.map((path) => ({
       url: `${SITE_URL}${path}`,
       changeFrequency: 'monthly',
       priority: path === '' ? 1 : 0.7,
     }));
   }