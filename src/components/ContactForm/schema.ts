import { z } from "zod";
import {
  BUDGET_RANGES,
  INQUIRY_TYPES,
  INTERESTED_SERVICES,
  PARTNERSHIP_TYPES,
  PREFERRED_CONTACT_METHODS,
  type ContactFormValues,
  type InquiryTag,
  type InquiryType,
} from "./types";

const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;

export const contactFormSchema = z
  .object({
    full_name: z.string().min(2, "Full Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || phoneRegex.test(value), {
        message: "Please enter a valid phone number.",
      }),
    company: z.string().trim().optional(),
    inquiry_type: z.enum(INQUIRY_TYPES, {
      message: "Please select an inquiry type.",
    }),
    message: z
      .string()
      .min(10, "Message must be at least 10 characters.")
      .max(1000, "Message cannot exceed 1000 characters."),
    budget_range: z.enum(BUDGET_RANGES).optional(),
    interested_service: z.enum(INTERESTED_SERVICES).optional(),
    preferred_contact: z.enum(PREFERRED_CONTACT_METHODS).optional(),
    meeting_request: z.boolean().optional(),
    website_url: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: "Please enter a valid website URL.",
      }),
    media_kit_needed: z.boolean().optional(),
    partnership_type: z.enum(PARTNERSHIP_TYPES).optional(),
    spam_token: z.string().min(1, "Spam verification is required."),
  })
  .superRefine((data, ctx) => {
    if (data.inquiry_type === "Potential Client" && !data.budget_range) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budget_range"],
        message: "Budget Range is required for potential clients.",
      });
    }
  });

export type ContactFormSchemaValues = z.infer<typeof contactFormSchema>;

const inquiryTagMap: Record<InquiryType, InquiryTag> = {
  "General Inquiry": "general",
  "Potential Client": "lead",
  "Media Request": "media",
  "Speaker Booking": "speaker",
  "Partnership/Collaboration": "partner",
};

export function getInquiryTag(inquiryType: InquiryType): InquiryTag {
  return inquiryTagMap[inquiryType];
}

export function sanitizeContactValues(values: ContactFormValues): ContactFormValues {
  return {
    ...values,
    phone: values.phone?.trim() || undefined,
    company: values.company?.trim() || undefined,
    website_url: values.website_url?.trim() || undefined,
    message: values.message.trim(),
  };
}
