const SITE_URL = "https://www.boguesgroup.com";
const LOGO_URL = `${SITE_URL}/logo.png`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const SOCIAL_PROFILES = [
  "https://www.facebook.com/BoguesGroup/",
  "https://www.linkedin.com/company/bogues-group",
  "https://www.instagram.com/boguesgroup/",
  "https://x.com/BoguesGroup",
  "https://www.youtube.com/@boguesgroup9706",
] as const;

const NAP = {
  streetAddress: "8022 Providence Rd, STE 500-178",
  addressLocality: "Charlotte",
  addressRegion: "NC",
  postalCode: "28277",
  addressCountry: "US",
  telephone: "+1-910-634-0054",
} as const;

// Note: none of these builders include "@context" — the JsonLd component
// injects it automatically (either at the top level for a single object,
// or once for the whole "@graph" array). Adding it here too would produce
// duplicate/invalid nesting.

interface OrganizationSchema {
  [key: string]: unknown;
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: readonly string[];
}

export function buildOrganizationSchema(): OrganizationSchema {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Bogues Group",
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      "North Carolina's premier public relations firm, delivering strategic communications, media relations, and brand storytelling for businesses across the state.",
    sameAs: SOCIAL_PROFILES,
  };
}

interface LocalBusinessSchema {
  [key: string]: unknown;
  "@type": "ProfessionalService";
  "@id": string;
  name: string;
  url: string;
  logo: string;
  image: string;
  telephone: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  sameAs: readonly string[];
}

export function buildLocalBusinessSchema(): LocalBusinessSchema {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Bogues Group",
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: NAP.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: NAP.streetAddress,
      addressLocality: NAP.addressLocality,
      addressRegion: NAP.addressRegion,
      postalCode: NAP.postalCode,
      addressCountry: NAP.addressCountry,
    },
    sameAs: SOCIAL_PROFILES,
  };
}

interface ReviewSchemaInput {
  testimonial: string;
  testimonialAuthor: string;
  /** Case study title, used as the review name. */
  serviceName: string;
  /** Absolute www URL of the case study detail page. */
  pageUrl: string;
}

interface ReviewSchema {
  [key: string]: unknown;
  "@type": "Review";
  name: string;
  itemReviewed: {
    "@type": "Organization";
    "@id": string;
    name: string;
    url: string;
  };
  reviewBody: string;
  author: {
    "@type": "Person";
    name: string;
  };
  url: string;
}

export function buildReviewSchema(input: ReviewSchemaInput): ReviewSchema {
  return {
    "@type": "Review",
    name: input.serviceName,
    // "Service" is not a supported itemReviewed type for review snippets.
    // Reference the Organization node already emitted in the root layout.
    itemReviewed: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Bogues Group",
      url: SITE_URL,
    },
    reviewBody: input.testimonial,
    author: {
      "@type": "Person",
      name: input.testimonialAuthor,
    },
    url: input.pageUrl,
  };
}