import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { LEGACY_REDIRECTS, SITE_URL } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      ...LEGACY_REDIRECTS,
      // Canonical host: apex -> www (keeps path and query string)
      {
        source: "/:path*",
        has: [{ type: "host", value: "boguesgroup.com" }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
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