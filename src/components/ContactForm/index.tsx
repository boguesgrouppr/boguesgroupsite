"use client";

import { submitContact } from "@/actions/submitContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { contactFormSchema, getInquiryTag } from "./schema";
import {
  BUDGET_RANGES,
  INQUIRY_TYPES,
  INTERESTED_SERVICES,
  PARTNERSHIP_TYPES,
  PREFERRED_CONTACT_METHODS,
  type ContactFormValues,
  type InquiryTag,
} from "./types";

const inputClasses =
  "w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent";

const sectionTransition = {
  initial: { opacity: 0, y: -8, height: 0 },
  animate: { opacity: 1, y: 0, height: "auto" },
  exit: { opacity: 0, y: -8, height: 0 },
  transition: { duration: 0.2 },
};

const defaultValues: ContactFormValues = {
  full_name: "",
  email: "",
  phone: "",
  company: "",
  inquiry_type: "General Inquiry",
  message: "",
  budget_range: undefined,
  interested_service: undefined,
  preferred_contact: undefined,
  meeting_request: false,
  website_url: "",
  media_kit_needed: false,
  partnership_type: undefined,
  spam_token: "",
};

function mapInquiryParamToType(value: string | null): ContactFormValues["inquiry_type"] | null {
  if (!value) return null;

  const normalized = value.toLowerCase().trim();

  if (normalized === "speaking" || normalized === "speaker" || normalized === "speaker-booking") {
    return "Speaker Booking";
  }
  if (normalized === "media" || normalized === "media-request" || normalized === "press") {
    return "Media Request";
  }
  if (normalized === "client" || normalized === "potential-client" || normalized === "lead") {
    return "Potential Client";
  }
  if (normalized === "partner" || normalized === "partnership" || normalized === "collaboration") {
    return "Partnership/Collaboration";
  }
  if (normalized === "general" || normalized === "general-inquiry") {
    return "General Inquiry";
  }

  return null;
}

function getSuccessMessage(tag: InquiryTag) {
  if (tag === "lead") {
    return "We'll be in touch within 24 hours to discuss your project.";
  }
  if (tag === "media" || tag === "speaker") {
    return "Our team will prioritize your request and respond shortly.";
  }
  if (tag === "partner") {
    return "We'll review your partnership proposal and reach out soon.";
  }
  return "Thanks! We'll get back to you within 2–3 business days.";
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const utmRef = useRef<{ utm_source?: string; utm_medium?: string; utm_campaign?: string }>({});
  const hasCapturedUtm = useRef(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [successTag, setSuccessTag] = useState<InquiryTag | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const inquiryType = watch("inquiry_type");
  const showPotentialClientFields = inquiryType === "Potential Client";
  const showMediaSpeakerFields =
    inquiryType === "Media Request" || inquiryType === "Speaker Booking";
  const showPartnershipFields = inquiryType === "Partnership/Collaboration";

  useEffect(() => {
    if (hasCapturedUtm.current) {
      return;
    }

    const inquiryTypeFromQuery = mapInquiryParamToType(searchParams.get("inquiry"));
    if (inquiryTypeFromQuery) {
      setValue("inquiry_type", inquiryTypeFromQuery, { shouldValidate: true });
    }

    utmRef.current = {
      utm_source: searchParams.get("utm_source") ?? undefined,
      utm_medium: searchParams.get("utm_medium") ?? undefined,
      utm_campaign: searchParams.get("utm_campaign") ?? undefined,
    };
    hasCapturedUtm.current = true;
  }, [searchParams, setValue]);

  useEffect(() => {
    if (!showPotentialClientFields) {
      setValue("budget_range", undefined);
      setValue("interested_service", undefined);
      setValue("preferred_contact", undefined);
      setValue("meeting_request", false);
    }

    if (!showMediaSpeakerFields) {
      setValue("website_url", "");
      setValue("media_kit_needed", false);
    }

    if (!showPartnershipFields) {
      setValue("partnership_type", undefined);
      if (!showMediaSpeakerFields) {
        setValue("website_url", "");
      }
    }
  }, [setValue, showMediaSpeakerFields, showPartnershipFields, showPotentialClientFields]);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError("");

    const inquiryTag = getInquiryTag(values.inquiry_type);
    const payload = {
      ...values,
      inquiry_tag: inquiryTag,
      source_url: window.location.href,
      utm_source: utmRef.current.utm_source,
      utm_medium: utmRef.current.utm_medium,
      utm_campaign: utmRef.current.utm_campaign,
      submission_date: new Date().toISOString(),
      internal_status: "new" as const,
      metadata: {},
    };

    const result = await submitContact(payload);

    if (!result.success) {
      setSubmitError(result.error ?? "Unable to send your message right now.");
      return;
    }

    reset(defaultValues);
    setSuccessTag(inquiryTag);
  });

  if (successTag) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <h3 className="text-xl font-semibold text-green-800">Thank you for reaching out.</h3>
        <p className="mt-3 text-green-700">{getSuccessMessage(successTag)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name
        </label>
        <input
          id="full_name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.full_name)}
          aria-describedby={errors.full_name ? "full_name-error" : undefined}
          className={inputClasses}
          placeholder="Your full name"
          {...register("full_name")}
        />
        {errors.full_name ? (
          <p id="full_name-error" className="mt-1 text-sm text-red-600">
            {errors.full_name.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClasses}
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={inputClasses}
          placeholder="(555) 123-4567"
          {...register("phone")}
        />
        {errors.phone ? (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
          Company/Organization Name
        </label>
        <input
          id="company"
          type="text"
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "company-error" : undefined}
          className={inputClasses}
          placeholder="Your company or organization"
          {...register("company")}
        />
        {errors.company ? (
          <p id="company-error" className="mt-1 text-sm text-red-600">
            {errors.company.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="inquiry_type" className="block text-sm font-semibold text-gray-700 mb-2">
          Inquiry Type
        </label>
        <select
          id="inquiry_type"
          aria-invalid={Boolean(errors.inquiry_type)}
          aria-describedby={errors.inquiry_type ? "inquiry_type-error" : undefined}
          className={inputClasses}
          {...register("inquiry_type")}
        >
          {INQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.inquiry_type ? (
          <p id="inquiry_type-error" className="mt-1 text-sm text-red-600">
            {errors.inquiry_type.message}
          </p>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        {showPotentialClientFields ? (
          <motion.div key="potential-client" className="space-y-6 overflow-hidden" {...sectionTransition}>
            <div>
              <label htmlFor="budget_range" className="block text-sm font-semibold text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                id="budget_range"
                aria-invalid={Boolean(errors.budget_range)}
                aria-describedby={errors.budget_range ? "budget_range-error" : undefined}
                className={inputClasses}
                {...register("budget_range")}
              >
                <option value="">Select budget range</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              {errors.budget_range ? (
                <p id="budget_range-error" className="mt-1 text-sm text-red-600">
                  {errors.budget_range.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="interested_service"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Interested Service
              </label>
              <select
                id="interested_service"
                className={inputClasses}
                {...register("interested_service")}
              >
                <option value="">Select service</option>
                {INTERESTED_SERVICES.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Contact Method
              </legend>
              <div className="space-y-2">
                {PREFERRED_CONTACT_METHODS.map((method) => (
                  <label key={method} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" value={method} {...register("preferred_contact")} />
                    {method}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" {...register("meeting_request")} />
              Meeting Request
            </label>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showMediaSpeakerFields ? (
          <motion.div key="media-speaker" className="space-y-6 overflow-hidden" {...sectionTransition}>
            <div>
              <label htmlFor="website_url" className="block text-sm font-semibold text-gray-700 mb-2">
                Website URL
              </label>
              <input
                id="website_url"
                type="url"
                className={inputClasses}
                placeholder="https://example.com"
                aria-invalid={Boolean(errors.website_url)}
                aria-describedby={errors.website_url ? "website_url-error" : undefined}
                {...register("website_url")}
              />
              {errors.website_url ? (
                <p id="website_url-error" className="mt-1 text-sm text-red-600">
                  {errors.website_url.message}
                </p>
              ) : null}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" {...register("media_kit_needed")} />
              Media Kit Needed
            </label>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showPartnershipFields ? (
          <motion.div key="partnership" className="space-y-6 overflow-hidden" {...sectionTransition}>
            <div>
              <label
                htmlFor="partnership_type"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Partnership Type
              </label>
              <select id="partnership_type" className={inputClasses} {...register("partnership_type")}>
                <option value="">Select partnership type</option>
                {PARTNERSHIP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="website_url_partner" className="block text-sm font-semibold text-gray-700 mb-2">
                Website URL
              </label>
              <input
                id="website_url_partner"
                type="url"
                className={inputClasses}
                placeholder="https://example.com"
                aria-invalid={Boolean(errors.website_url)}
                aria-describedby={errors.website_url ? "website_url-partner-error" : undefined}
                {...register("website_url")}
              />
              {errors.website_url ? (
                <p id="website_url-partner-error" className="mt-1 text-sm text-red-600">
                  {errors.website_url.message}
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          className={`${inputClasses} resize-vertical`}
          placeholder="Tell us about your project or inquiry..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="mt-1 text-sm text-red-600">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div>
        <Turnstile
          siteKey={turnstileSiteKey}
          onSuccess={(token) => {
            setValue("spam_token", token, { shouldValidate: true });
          }}
          onExpire={() => {
            setValue("spam_token", "", { shouldValidate: true });
          }}
          onError={() => {
            setValue("spam_token", "", { shouldValidate: true });
          }}
        />
        {errors.spam_token ? (
          <p id="spam_token-error" className="mt-1 text-sm text-red-600">
            {errors.spam_token.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gold text-navy font-bold py-4 px-8 rounded-lg hover:bg-gold-light transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>

      {submitError ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}
    </form>
  );
}
