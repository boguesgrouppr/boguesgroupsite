"use server";

import { contactFormSchema, getInquiryTag, sanitizeContactValues } from "@/components/ContactForm/schema";
import type { ContactSubmitPayload, ContactSubmitResponse } from "@/components/ContactForm/types";
import { createServerActionClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { headers } from "next/headers";

const CONTACT_NOTIFY_URL = "https://bogues-contact-notify.thatllcthatllc.workers.dev";
const TURNSTILE_ACTION = "contact";
const MAX_URL_LENGTH = 2048;
const MAX_UTM_LENGTH = 256;

function clamp(value: string | undefined, max: number): string | null {
  return value ? value.slice(0, max) : null;
}

export async function submitContact(data: ContactSubmitPayload): Promise<ContactSubmitResponse> {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please review your form values.",
    };
  }

  const values = sanitizeContactValues(parsed.data);

  const check = await verifyTurnstile(
    values.spam_token,
    TURNSTILE_ACTION,
    (await headers()).get("cf-connecting-ip"),
  );

  if (!check.ok) {
    return {
      success: false,
      error:
        check.reason === "rejected" || check.reason === "missing_token"
          ? "Spam verification failed. Please try again."
          : "Verification is temporarily unavailable. Please try again shortly.",
    };
  }

  const inquiryTag = getInquiryTag(values.inquiry_type);

  // Persist only the conditional fields that belong to the selected inquiry type.
  const isClient = values.inquiry_type === "Potential Client";
  const isMediaOrSpeaker =
    values.inquiry_type === "Media Request" || values.inquiry_type === "Speaker Booking";
  const isPartner = values.inquiry_type === "Partnership/Collaboration";

  const supabase = await createServerActionClient();

  const { error } = await supabase.from("contacts").insert({
    full_name: values.full_name,
    email: values.email,
    phone: values.phone ?? null,
    company: values.company ?? null,
    inquiry_type: values.inquiry_type,
    inquiry_tag: inquiryTag,
    message: values.message,
    budget_range: isClient ? (values.budget_range ?? null) : null,
    interested_service: isClient ? (values.interested_service ?? null) : null,
    preferred_contact: isClient ? (values.preferred_contact ?? null) : null,
    meeting_request: isClient ? (values.meeting_request ?? false) : false,
    website_url: isMediaOrSpeaker || isPartner ? (values.website_url ?? null) : null,
    media_kit_needed: isMediaOrSpeaker ? (values.media_kit_needed ?? false) : false,
    partnership_type: isPartner ? (values.partnership_type ?? null) : null,
    source_url: clamp(data.source_url, MAX_URL_LENGTH),
    utm_source: clamp(data.utm_source, MAX_UTM_LENGTH),
    utm_medium: clamp(data.utm_medium, MAX_UTM_LENGTH),
    utm_campaign: clamp(data.utm_campaign, MAX_UTM_LENGTH),
    submission_date: new Date().toISOString(),
    internal_status: "new",
    metadata: {},
  });

  if (error) {
    console.error("[contact] Supabase insert failed", error);
    return {
      success: false,
      error: "Something went wrong while submitting. Please try again.",
    };
  }

  // Awaited with a timeout: un-awaited work can be cancelled when the Worker response returns.
  try {
    const res = await fetch(CONTACT_NOTIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: values.full_name,
        email: values.email,
        inquiry_type: values.inquiry_type,
        inquiry_tag: inquiryTag,
        message: values.message,
        phone: values.phone,
        company: values.company,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("[contact] notify worker responded", res.status);
    }
  } catch (notifyError) {
    // The row is saved; a failed notification must not fail the submission.
    console.error("[contact] notify worker failed", notifyError);
  }

  return { success: true };
}