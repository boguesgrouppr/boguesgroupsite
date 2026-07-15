import { Metadata } from "next";
import BrandBuilderHubContent from "@/components/pages/BrandBuilderHubContent";

export const metadata: Metadata = {
  title: "Brand Builder Hub - Bogues Group",
  description:
    "Resources, courses, and tools to build your brand, spread your story, and connect with customers. The Brand Builder Hub from Bogues Group.",
  openGraph: {
    title: "Brand Builder Hub - Bogues Group",
    description:
      "Build your brand with expert PR strategy, workbooks, courses, and tools from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/brand-builder-hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Builder Hub - Bogues Group",
    description:
      "Build your brand with expert PR strategy, workbooks, courses, and tools from Bogues Group.",
  },
};

export default function BrandBuilderHubPage() {
  return <BrandBuilderHubContent />;
}