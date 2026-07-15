import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/small-business-hub",
        destination: "/brand-builder-hub",
        permanent: true,
      },
      {
        source: "/small-business-hub/:path*",
        destination: "/brand-builder-hub",
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
