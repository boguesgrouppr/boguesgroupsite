"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import Hero from "@/components/Hero";
import NavLink from "@/components/NavLink";
import NewsletterForm from "@/components/NewsletterForm";
import VimeoEmbed from "@/components/case-studies/VimeoEmbed";
import { toMediaUrl } from "@/lib/media-url";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import WorkbookCheckoutButton from "@/components/WorkbookCheckoutButton";

interface FreeResource {
  title: string;
  description: string;
  slug: string;
  fileUrl: string;
}

const freeResources: FreeResource[] = [
  {
    title: "Brand Builder Workbook Sample",
    description:
      "Preview chapters from the complete workbook including brand positioning exercises and audience discovery worksheets.",
    slug: "workbook-sample",
    fileUrl: "/pdfs/brand-builder-workbook-sample.pdf",
  },
  {
    title: "Brand Discovery Worksheet",
    description:
      "A guided worksheet to uncover your brand's core values, mission, and unique positioning in the market.",
    slug: "discovery-worksheet",
    fileUrl: "/pdfs/brand-discovery-worksheet.pdf",
  },
  {
    title: "Brand Audit Checklist",
    description:
      "A comprehensive checklist to evaluate your current brand health across messaging, visual identity, and digital presence.",
    slug: "audit-checklist",
    fileUrl: "/pdfs/brand-audit-checklist.pdf",
  },
  {
    title: "Marketing Planning Template",
    description:
      "A structured template for building quarterly and annual marketing plans with goals, tactics, and KPIs.",
    slug: "marketing-template",
    fileUrl: "/pdfs/marketing-planning-template.pdf",
  },
];

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

function DownloadIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-gold" />
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
        {children}
      </span>
      <span className="h-px w-8 bg-gold" />
    </div>
  );
}

/**
 * Reusable gated-download form. Used for the 4 static PDF resources AND
 * the Webinar Replay, so every "free resource" on this page consistently
 * requires email capture per the content brief, instead of the webinar
 * being an ungated exception.
 */
function useGatedDownload(slug: string) {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setStatus("submitting");

    const trimmedEmail = normalizeEmail(email);
    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    try {
      const response = await fetch("/api/resource-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, slug }),
      });
      const data = await response.json();

      if (!response.ok || !data.file_url) {
        setErrorMessage(
          data.error || "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setFileUrl(data.file_url);
      setStatus("success");
      setEmail("");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return {
    modalOpen,
    setModalOpen,
    email,
    setEmail,
    status,
    setStatus,
    errorMessage,
    fileUrl,
    handleSubmit,
  };
}

function ResourceCard({ resource }: { resource: FreeResource }) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg">
      <div className="mb-4 h-1 w-10 rounded-full bg-gold transition-all duration-300 group-hover:w-14" />
      <h3 className="mb-2 font-heading text-lg font-bold text-navy">
        {resource.title}
      </h3>
      <p className="mb-6 flex-1 text-sm text-gray-500">
        {resource.description}
      </p>
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="PDF downloads coming soon"
        className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3.5 text-sm font-semibold text-gray-400"
      >
        <DownloadIcon className="h-4 w-4" />
        Coming Soon
      </button>
    </div>
  );
}

/**
 * Gated webinar replay — same email-capture pattern as ResourceCard,
 * but reveals the VimeoEmbed instead of a PDF link on success.
 */
function WebinarReplay() {
  const {
    modalOpen,
    setModalOpen,
    email,
    setEmail,
    status,
    errorMessage,
    handleSubmit,
  } = useGatedDownload("webinar-replay");

  return (
    <div className="mt-16">
      <SectionEyebrow>On-Demand</SectionEyebrow>
      <h3 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
        Webinar Replay
      </h3>
      <p className="mt-2 text-center text-gray-500">
        Amplify Your Event with Brittney Bogues
      </p>

      {status === "success" ? (
        <div className="mt-10 overflow-hidden rounded-xl shadow-lg">
          <VimeoEmbed
            videoUrl="https://vimeo.com/1101607424"
            title="Amplify Your Event with Brittney Bogues"
          />
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="max-w-md text-gray-600">
            Enter your email to unlock instant access to the full webinar
            replay.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
          >
            Get Instant Access
          </button>
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="webinar-modal-title"
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2
              id="webinar-modal-title"
              className="font-heading text-2xl font-bold text-navy"
            >
              Webinar Replay
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email to receive instant access.
            </p>
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <label htmlFor="webinar-email" className="sr-only">
                Email address
              </label>
              <input
                id="webinar-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-navy placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              {errorMessage && (
                <p className="text-sm text-red-600" role="alert">
                  {errorMessage}
                </p>
              )}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-[#021f2e] transition-colors hover:bg-[#e5c256]"
              >
                Get Access
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrandBuilderHubContent() {
  const checklistImage = toMediaUrl("/media/2025/08/business-checklist-2.png");
  const workbookCoverImage = "/logos/Brand_Builder_cover_page.png";
  const [tierModalOpen, setTierModalOpen] = useState(false);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setTierModalOpen(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <>
      <Hero
        title="Brand Builder Hub"
        subtitle="Build your brand with confidence."
      />

      {/* Intro */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <p className="text-lg leading-relaxed text-body">
          Whether you&apos;re launching a business, growing an established
          organization, educating future entrepreneurs, or navigating a highly
          regulated industry, building a successful brand starts with the right
          strategy and resources.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-body">
          The Brand Builder Hub brings together educational tools, practical
          workbooks, industry programs, and expert guidance designed to help you
          build a stronger brand, connect with your audience, and grow with
          confidence.
        </p>
      </section>

      {/* Featured Resource */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div
              className="flex gap-0.5 text-gold"
              aria-label="Rated 5 out of 5"
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <strong className="text-navy">5.0</strong> &middot; 218 ratings
              &middot; 3,000+ students
            </p>
            <p className="text-sm italic text-gray-400">
              Last updated July 2025
            </p>
          </div>

          <SectionEyebrow>Featured Resource</SectionEyebrow>
          <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
            Complete Brand Builder Workbook
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your step-by-step guide to building a stronger brand.
          </p>

          <div className="mt-8 grid gap-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:grid-cols-[0.7fr_1.3fr] md:p-10">
            <div className="relative self-start overflow-hidden rounded-xl bg-navy p-3 shadow-lg">
              <div className="relative aspect-[768/501] w-full overflow-hidden rounded-lg">
                <Image
                  src={workbookCoverImage}
                  alt="Brand Builder planning checklist"
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-6 left-6 rounded-lg bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-navy shadow">
                Brand Builder
              </div>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-navy">
                The Complete Brand Builder Workbook
              </h3>
              <p className="mt-4 leading-relaxed text-body">
                <strong>
                  The Complete Brand Builder Workbook is a practical, hands-on
                  resource designed to help entrepreneurs, business owners,
                  students, and professionals build a brand from the inside
                  out.
                </strong>
              </p>
              <p className="mt-3 leading-relaxed text-body">
                Through guided exercises, strategic frameworks, and actionable
                planning tools, you&apos;ll gain the clarity and confidence
                needed to strengthen your brand and market your business
                effectively.
              </p>
              <p className="mt-3 leading-relaxed text-body">
                Whether you&apos;re starting from scratch or refining an
                existing brand, the workbook provides a roadmap you can
                implement immediately.
              </p>

              <h4 className="mt-6 font-heading text-lg font-bold text-navy">
                What&apos;s Included:
              </h4>
              <ul className="mt-4 space-y-2 text-body">
                {[
                  "Brand positioning exercises",
                  "Audience discovery worksheets",
                  "Messaging framework",
                  "Marketing planning templates",
                  "Goal-setting tools",
                  "Action plans and checklists",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 flex-shrink-0 text-gold" />{" "}
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setTierModalOpen(true)}
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
              >
                Purchase the Complete Workbook
              </button>
            </div>
          </div>
        </div>
      </section>

      {tierModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setTierModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tier-modal-title"
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setTierModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2
              id="tier-modal-title"
              className="font-heading text-2xl font-bold text-navy"
            >
              Choose Your Format
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Pick the edition of The Complete Brand Builder Workbook that works
              best for you.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-navy">
                    Digital
                  </h3>
                  <p className="text-sm text-gray-500">
                    Instant download &mdash; $99
                  </p>
                </div>
                <WorkbookCheckoutButton
                  tier="digital"
                  label="Buy Digital"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-[#021f2e] shadow transition-all duration-300 hover:bg-[#e5c256]"
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-navy">
                    Printed
                  </h3>
                  <p className="text-sm text-gray-500">
                    Delivered to your door &mdash; $149
                  </p>
                </div>
                <WorkbookCheckoutButton
                  tier="printed"
                  label="Buy Printed"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-[#021f2e] shadow transition-all duration-300 hover:bg-[#e5c256]"
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-navy">
                    Bundle
                  </h3>
                  <p className="text-sm text-gray-500">
                    Digital + Printed &mdash; $249
                  </p>
                </div>
                <WorkbookCheckoutButton
                  tier="bundle"
                  label="Buy Bundle"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-[#021f2e] shadow transition-all duration-300 hover:bg-[#e5c256]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free Resources */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionEyebrow>Start Building Today</SectionEyebrow>
        <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
          Free Resources
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-500">
          Explore free tools and resources designed to help you strengthen your
          brand one step at a time.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {freeResources.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>

        <WebinarReplay />
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-navy px-6 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#064e73]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row">
          <div className="relative h-[300px] w-[210px] shrink-0 overflow-hidden rounded-lg">
            <Image
              src={checklistImage}
              alt="Business planning checklist"
              fill
              sizes="210px"
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
              Our checklists can help you plan for success.
            </h2>
            <p className="mt-4 leading-relaxed text-white/75">
              Get expert PR tips, branding strategies, and actionable resources
              delivered to your inbox. Subscribe to stay ahead of the
              competition.
            </p>
            <div className="mt-6 max-w-md">
              <NewsletterForm source="brand-builder-hub" theme="dark" />
            </div>
            <p className="mt-8 text-sm text-white/60">
              Want hands-on support?{" "}
              <NavLink
                href="/contact"
                className="font-semibold text-gold underline transition-colors hover:text-white"
              >
                Get in touch with our team
              </NavLink>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Collective Grow */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg md:flex md:items-center md:gap-10 md:p-10">
          <div className="flex-1">
            <SectionEyebrow>Cannabis PR Education Fund</SectionEyebrow>
            <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
              Collective Grow
            </h2>
            <p className="mt-4 leading-relaxed text-body">
              Marketing a cannabis brand comes with unique challenges — from
              advertising restrictions and evolving regulations to limited media
              opportunities. Collective Grow was created to help brands overcome
              these barriers through a collaborative public relations and
              education model.
            </p>
            <p className="mt-4 leading-relaxed text-body">
              Instead of navigating these challenges alone, participating brands
              gain access to strategic campaigns, educational resources,
              co-branded marketing initiatives, and industry-wide storytelling
              designed to strengthen both individual businesses and the cannabis
              community as a whole.
            </p>
            <h3 className="mt-6 font-heading text-lg font-bold text-navy">
              What You&apos;ll Gain
            </h3>
            <ul className="mt-4 space-y-2 text-body">
              {[
                "Collaborative PR campaigns",
                "Co-branded marketing opportunities",
                "Increased media visibility",
                "Educational resources built for compliance",
                "Industry networking and expert insights",
                "Stronger market positioning through collective storytelling",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 flex-shrink-0 text-gold" />{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 md:mt-0 md:shrink-0">
            <NavLink
              href="/collective-grow"
              className="inline-flex items-center whitespace-nowrap rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
            >
              Explore Collective Grow
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Schools / Education */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionEyebrow>Education Programs</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
            Bringing Branding Into the Classroom
          </h2>

          <div className="mt-10 space-y-6 text-body">
            <p className="leading-relaxed">
              The Brand Builder Workbook is not just helping businesses but also
              helps prepare the next generation of entrepreneurs and marketing
              professionals.
            </p>
            <p className="leading-relaxed">
              Our education program provides schools, educators, and workforce
              development organizations with practical branding and marketing
              curriculum that encourages creativity, strategic thinking, and
              real-world business skills.
            </p>
            <p className="leading-relaxed">
              Learn how schools like Kannapolis City Schools are using the Brand
              Builder Workbook to empower students through hands-on learning and
              career readiness.
            </p>
          </div>

          {/* Pending: Kannapolis video — placeholder until URL provided (per active dependency tracker) */}
          {/* <div className="mt-10 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-gray-200 shadow-lg">
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-gray-500">
                Kannapolis City Schools Video &mdash; Placeholder
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Video URL to be provided
              </p>
            </div>
          </div> */}
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <iframe
              src="https://player.vimeo.com/video/1101607424?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
              title="How Kannapolis City Schools Used the Brand Builder Workbook"
            />
          </div>
        </div>
      </section>

      {/* Coach With Bogues Group */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg md:flex md:items-center md:gap-10 md:p-10">
          <div className="flex-1">
            <SectionEyebrow>Grow Your Business</SectionEyebrow>
            <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
              Coach With Bogues Group
            </h2>
            <p className="mt-4 leading-relaxed text-body">
              Expand Your Coaching Impact. Create New Revenue.
            </p>
            <p className="mt-4 leading-relaxed text-body">
              Your clients trust you for guidance &mdash; now give them access
              to a resource that helps them turn their ideas into a stronger,
              more intentional brand.
            </p>
            <p className="mt-4 leading-relaxed text-body">
              The Bogues Group Brand Builder Workbook is designed for coaches,
              consultants, and leaders who want to provide additional value
              without creating new materials themselves.
            </p>
            <p className="mt-4 leading-relaxed text-body">
              Add it to your existing coaching programs, recommend it as a
              client resource, and build recurring revenue through every sale.
            </p>
            <p className="mt-4 font-bold text-navy">
              10 workbook sales = $1,000 in additional monthly income.
            </p>
            <p className="mt-4 leading-relaxed text-body">
              Partner with Bogues Group and give your clients a proven framework
              while growing your business.
            </p>
          </div>
          <div className="mt-8 md:mt-0 md:shrink-0">
            <NavLink
              href="/coaches-roundtable-funnel"
              className="inline-flex items-center whitespace-nowrap rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
            >
              Become a Coach Today
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Crisis Communication Support for Hotels */}
      <section className="relative overflow-hidden bg-navy px-6 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#064e73]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <SectionEyebrow>Crisis Support</SectionEyebrow>
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            Crisis Communication Support for Hotels
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Dealing with a Crisis? We&apos;re your support team.
          </p>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/75">
            When a crisis impacts your team, guests, or reputation, having the
            right communication strategy matters. Our crisis communication
            experts help HR leaders and hospitality teams respond quickly,
            communicate effectively, and protect the trust they&apos;ve built.
          </p>
          <div className="mt-10">
            <NavLink
              href="/hr-crisis-communications-roundtable"
              className="inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
            >
              Get the support you need before, during, and after a crisis.
            </NavLink>
          </div>
        </div>
      </section>

      {/* Need More Support */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
        <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
          Need More Support?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-body">
          If you&apos;re looking for customized communications, branding, public
          relations, or event strategy, the Bogues Group team is here to help.
        </p>
        <div className="mt-8">
          <NavLink
            href="/contact"
            className="inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
          >
            Schedule a Consultation
          </NavLink>
        </div>
      </section>
    </>
  );
}
