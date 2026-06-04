"use server";

import { contactFormSchema, getInquiryTag, sanitizeContactValues } from "@/components/ContactForm/schema";
import type { ContactSubmitPayload, ContactSubmitResponse } from "@/components/ContactForm/types";
import { createServerActionClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/supabase/turnstile";

const CONTACT_NOTIFY_URL = "https://bogues-contact-notify.thatllcthatllc.workers.dev";

export async function submitContact(
  data: ContactSubmitPayload
): Promise<ContactSubmitResponse> {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please review your form values.",
    };
  }

  const validatedValues = sanitizeContactValues(parsed.data);
  const turnstileResult = await verifyTurnstileToken(validatedValues.spam_token);

  if (!turnstileResult.success) {
    return {
      success: false,
      error: turnstileResult.error,
    };
  }

  const inquiryTag = getInquiryTag(validatedValues.inquiry_type);
  const supabase = await createServerActionClient();

  const { error } = await supabase.from("contacts").insert({
    full_name: validatedValues.full_name,
    email: validatedValues.email,
    phone: validatedValues.phone ?? null,
    company: validatedValues.company ?? null,
    inquiry_type: validatedValues.inquiry_type,
    inquiry_tag: inquiryTag,
    message: validatedValues.message,
    budget_range: validatedValues.budget_range ?? null,
    interested_service: validatedValues.interested_service ?? null,
    preferred_contact: validatedValues.preferred_contact ?? null,
    meeting_request: validatedValues.meeting_request ?? false,
    website_url: validatedValues.website_url ?? null,
    media_kit_needed: validatedValues.media_kit_needed ?? false,
    partnership_type: validatedValues.partnership_type ?? null,
    source_url: data.source_url,
    utm_source: data.utm_source ?? null,
    utm_medium: data.utm_medium ?? null,
    utm_campaign: data.utm_campaign ?? null,
    submission_date: data.submission_date,
    internal_status: data.internal_status,
    metadata: data.metadata ?? {},
  });

  if (error) {
    return {
      success: false,
      error: "Something went wrong while submitting. Please try again.",
    };
  }

  fetch(CONTACT_NOTIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: validatedValues.full_name,
      email: validatedValues.email,
      inquiry_type: validatedValues.inquiry_type,
      inquiry_tag: inquiryTag,
      message: validatedValues.message,
      phone: validatedValues.phone,
      company: validatedValues.company,
    }),
  }).catch(() => {});

  return { success: true };
}
