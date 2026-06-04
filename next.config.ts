import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "boguesgroup.com",
      },
      {
        protocol: "https",
        hostname: "www.boguesgroup.com",
      },
      {
        protocol: "https",
        hostname: "bogues-group.pages.dev",
      },
    ],
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
