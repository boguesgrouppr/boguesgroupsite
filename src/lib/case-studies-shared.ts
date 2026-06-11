export type CaseStudyCategory =
  | "csr"
  | "community_impact"
  | "brand_activations"
  | "public_relations"
  | "momentum"
  | "crisis_communications"
  | "hospitality";

export interface KeyMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  categories: CaseStudyCategory[];
  industry_tags: string[];
  short_description: string | null;
  overview: string | null;
  challenge: string | null;
  strategy: string | null;
  execution: string | null;
  results: string | null;
  testimonial: string | null;
  testimonial_author: string | null;
  key_metrics: KeyMetric[] | null;
  cover_image_url: string | null;
  video_url: string | null;
  pdf_url: string | null;
  cta_label: string;
  cta_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const CATEGORY_LABELS: Record<CaseStudyCategory, string> = {
  csr: "Corporate Social Responsibility",
  community_impact: "Community Impact",
  brand_activations: "Brand Activations",
  public_relations: "Public Relations",
  momentum: "Momentum",
  crisis_communications: "Crisis Communications",
  hospitality: "Hospitality",
};

const CATEGORY_TAB_LABELS: Record<CaseStudyCategory, string> = {
  csr: "CSR",
  community_impact: "Community Impact",
  brand_activations: "Brand Activations",
  public_relations: "Public Relations",
  momentum: "Momentum",
  crisis_communications: "Crisis Communications",
  hospitality: "Hospitality",
};

const VALID_CATEGORIES = new Set<string>(Object.keys(CATEGORY_LABELS));

export function isCaseStudyCategory(value: string): value is CaseStudyCategory {
  return VALID_CATEGORIES.has(value);
}

function parsePostgresArray(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return [];
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(",")
    .map((item) => item.trim().replace(/^"(.*)"$/, "$1"))
    .filter(Boolean);
}

export function parseCategories(raw: unknown): CaseStudyCategory[] {
  if (typeof raw === "string") {
    return parsePostgresArray(raw).filter(isCaseStudyCategory);
  }
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is CaseStudyCategory =>
      typeof item === "string" && isCaseStudyCategory(item)
  );
}

export function parseIndustryTags(raw: unknown): string[] {
  if (typeof raw === "string") {
    return parsePostgresArray(raw);
  }
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string");
}

export function getCategoryLabel(category: CaseStudyCategory): string {
  return CATEGORY_LABELS[category];
}

export function getCategoryTabLabel(category: CaseStudyCategory): string {
  return CATEGORY_TAB_LABELS[category];
}

export function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!match) return null;
  return `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0`;
}

export const CASE_STUDY_TABS: {
  id: "all" | CaseStudyCategory;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "csr", label: "CSR" },
  { id: "community_impact", label: "Community Impact" },
  { id: "brand_activations", label: "Brand Activations" },
  { id: "public_relations", label: "Public Relations" },
  { id: "momentum", label: "Momentum" },
  { id: "crisis_communications", label: "Crisis Communications" },
  { id: "hospitality", label: "Hospitality" },
];
