export const INQUIRY_TYPES = [
  "General Inquiry",
  "Potential Client",
  "Media Request",
  "Speaker Booking",
  "Partnership/Collaboration",
] as const;

export const BUDGET_RANGES = [
  "Under $1K",
  "$1K-$5K",
  "$5K-$10K",
  "$10K+",
] as const;

export const INTERESTED_SERVICES = [
  "Public Relations",
  "Marketing",
  "Crisis Management",
  "Media Relations",
  "Digital Marketing",
  "Strategy & Planning",
  "Branding & Website Design",
  "Experiential Marketing & Events",
] as const;

export const PREFERRED_CONTACT_METHODS = ["Email", "Phone", "Video Call"] as const;

export const PARTNERSHIP_TYPES = [
  "Affiliate",
  "Co-Branding",
  "Integration",
  "Other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];
export type InquiryTag = "general" | "lead" | "media" | "speaker" | "partner";
export type BudgetRange = (typeof BUDGET_RANGES)[number];
export type InterestedService = (typeof INTERESTED_SERVICES)[number];
export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number];
export type PartnershipType = (typeof PARTNERSHIP_TYPES)[number];

export interface ContactFormValues {
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiry_type: InquiryType;
  message: string;
  budget_range?: BudgetRange;
  interested_service?: InterestedService;
  preferred_contact?: PreferredContactMethod;
  meeting_request?: boolean;
  website_url?: string;
  media_kit_needed?: boolean;
  partnership_type?: PartnershipType;
  spam_token: string;
}

export interface ContactSubmitPayload extends ContactFormValues {
  inquiry_tag: InquiryTag;
  source_url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  submission_date: string;
  internal_status: "new";
  metadata: Record<string, unknown>;
}

export interface ContactSubmitResponse {
  success: boolean;
  error?: string;
}
