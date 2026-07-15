import { getSiteOrigin } from "@/lib/media-url";

export const BOGUES_ORGANIZATION = {
  "@type": "Organization" as const,
  name: "Bogues Group",
  url: getSiteOrigin(),
  logo: `${getSiteOrigin()}/logo.png`,
};
