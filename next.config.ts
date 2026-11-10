import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const SITE = "https://www.boguesgroup.com";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/small-business-hub", destination: `${SITE}/brand-builder-hub`, permanent: true },
      { source: "/small-business-hub/:path*", destination: `${SITE}/brand-builder-hub`, permanent: true },
      { source: "/collective-grow", destination: `${SITE}/brand-builder-hub`, permanent: true },
      { source: "/collectivegrow", destination: `${SITE}/brand-builder-hub`, permanent: true },
      { source: "/blog/:slug(__trashed.*)", destination: `${SITE}/blog`, permanent: true },
      { source: "/category/:path*", destination: `${SITE}/blog`, permanent: true },
      { source: "/tag/:path*", destination: `${SITE}/blog`, permanent: true },
      {
        source: "/blog/holiday-wishes-from-bg-9h6e4",
        destination: `${SITE}/blog/holiday-wishes-from-bg`,
        permanent: true,
      },
      {
        source:
          "/blog/narcan-to-be-part-of-charlotte-abc-store-renovation-devices-coming-to-all-mecklenburg-county-stores-2",
        destination: `${SITE}/blog/narcan-to-be-part-of-charlotte-abc-store-renovation-devices-coming-to-all-mecklenburg-county-stores`,
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [400, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 128, 192, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "boguesgroup.com" },
      { protocol: "https", hostname: "www.boguesgroup.com" },
      { protocol: "https", hostname: "bogues-group.pages.dev" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();