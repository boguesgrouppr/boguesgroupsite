"use client";

import { useState } from "react";
import Image from "next/image";
import NavLink from "@/components/NavLink";
import { toMediaUrl } from "@/lib/media-url";

const REGISTER_URL =
  "https://continuinged.cpcc.edu/search/publicCourseSearchDetails.do?method=load&courseId=52828144#courseSectionDetails_52834658";

const brittneyImage = toMediaUrl(
  "/media/2025/08/Brittney-Bogues-Founder-CIO-of-Bogues-Group-1-1-696x464-1.webp",
);

interface IconCardItem {
  title: string;
  icon: ReturnType<typeof CheckIcon>;
}

interface FaqItem {
  question: string;
  answer: string;
}

const heroValuePoints = [
  "Continuing Education Credit",
  "Portfolio-Ready Skills",
  "Practical Communication Frameworks",
  "Career Advancement",
];

const whoItsFor = [
  { title: "Professionals", icon: <BriefcaseIcon /> },
  { title: "Entrepreneurs", icon: <SparkIcon /> },
  { title: "Small Business Owners", icon: <StorefrontIcon /> },
  { title: "Career Changers", icon: <PathIcon /> },
  { title: "Recent Graduates", icon: <CapIcon /> },
  { title: "Emerging Leaders", icon: <CompassIcon /> },
];

const whatYoullLearn = [
  {
    title: "Personal Branding Strategy",
    description:
      "Define the story and positioning that set you apart professionally.",
    icon: <SparkIcon />,
  },
  {
    title: "Professional Communication",
    description:
      "Sharpen how you write, speak, and present in any professional setting.",
    icon: <MessageIcon />,
  },
  {
    title: "Strategic Messaging",
    description:
      "Build messages that connect with the audiences who matter most.",
    icon: <TargetIcon />,
  },
  {
    title: "Executive Presence",
    description:
      "Carry yourself with confidence in meetings, interviews, and leadership moments.",
    icon: <CompassIcon />,
  },
  {
    title: "Visibility & Reputation",
    description:
      "Learn how to be recognized for the value you already bring to the table.",
    icon: <EyeIcon />,
  },
  {
    title: "Career Growth Planning",
    description:
      "Map out the next steps to advance your career with intention.",
    icon: <PathIcon />,
  },
];

const whatYoullLeaveWith: IconCardItem[] = [
  { title: "Continuing Education Credit", icon: <CapIcon /> },
  { title: "Career-Ready Communication Skills", icon: <MessageIcon /> },
  { title: "Portfolio-Ready Work", icon: <FolderIcon /> },
  { title: "Actionable Branding Strategies", icon: <SparkIcon /> },
  { title: "Greater Confidence", icon: <CompassIcon /> },
  { title: "Practical Tools You Can Apply Immediately", icon: <ToolIcon /> },
];

const whyChoose = [
  {
    title: "Practical",
    description: "Learn strategies you can immediately apply in your career.",
  },
  {
    title: "Industry-Led",
    description:
      "Gain insights from real-world communications and branding experience.",
  },
  {
    title: "Career-Focused",
    description:
      "Develop skills that help you stand out in today's competitive workplace.",
  },
];

const faqs: FaqItem[] = [
  {
    question: "Who should take this course?",
    answer:
      "Professionals looking to strengthen their communication skills, personal brand, and professional visibility.",
  },
  {
    question: "Do I receive Continuing Education credit?",
    answer:
      "Yes. This certificate is offered through Central Piedmont Community College Continuing Education.",
  },
  {
    question: "Is this course in person or virtual?",
    answer:
      "Both. There are options available for both online and in-person students.",
  },
  {
    question: "How long is the program?",
    answer:
      "The program runs for 8 weeks, an accelerated pace for professionals or students looking to further their career.",
  },
  {
    question: "Do I need prior experience?",
    answer:
      "No. The course is designed for professionals at all career stages.",
  },
];

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

function iconWrapperProps() {
  return "h-6 w-6 text-gold";
}

function BriefcaseIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 7h18v12H3V7zm5 0V5a2 2 0 012-2h4a2 2 0 012 2v2"
      />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"
      />
    </svg>
  );
}
function StorefrontIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M4 9l1-5h14l1 5M4 9v10h16V9M4 9h16M9 19v-6h6v6"
      />
    </svg>
  );
}
function PathIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M5 19c4-8 10-2 14-10"
      />
      <circle cx="5" cy="19" r="1.5" strokeWidth={1.75} />
      <circle cx="19" cy="9" r="1.5" strokeWidth={1.75} />
    </svg>
  );
}
function CapIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 4L2 9l10 5 10-5-10-5zM6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"
      />
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" strokeWidth={1.75} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M15 9l-2 6-6 2 2-6 6-2z"
      />
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M4 4h16v12H8l-4 4V4z"
      />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" strokeWidth={1.75} />
      <circle cx="12" cy="12" r="4" strokeWidth={1.75} />
      <circle cx="12" cy="12" r="0.5" strokeWidth={1.75} />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
      />
      <circle cx="12" cy="12" r="3" strokeWidth={1.75} />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 7h6l2 2h10v10H3V7z"
      />
    </svg>
  );
}
function ToolIcon() {
  return (
    <svg
      className={iconWrapperProps()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.3 2.3-2-2 2.3-2.3z"
      />
    </svg>
  );
}
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 flex-shrink-0 text-gold transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function IconCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 transition-colors duration-300 group-hover:bg-gold/10">
        {icon}
      </div>
      <h3 className="font-heading text-base font-bold text-navy">{title}</h3>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}

function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-heading text-base font-bold text-navy md:text-lg">
          {item.question}
        </span>
        <ChevronIcon open={open} />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          open
            ? "grid-rows-[1fr] pb-5 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <p className="text-body text-gray-600">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

function StickyRegisterCard() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 rounded-2xl border border-navy/10 bg-white p-7 shadow-xl">
        <h3 className="font-heading text-xl font-bold text-navy">
          Ready to Advance Your Career?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          The Applied Communications &amp; Branding Certificate gives you
          practical communication and branding skills you can apply immediately.
        </p>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-gold">
          You&apos;ll Gain
        </p>
        <div className="mt-3 space-y-2">
          {[
            "Continuing Education Credit",
            "Portfolio-Ready Skills",
            "Personal Branding Frameworks",
            "Career-Ready Communications",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full rounded-lg bg-gold px-6 py-3 text-center text-sm font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-[#e5c256] hover:shadow-xl"
        >
          Register Today
        </a>
      </div>
    </aside>
  );
}

export default function Cpcc() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#064e73]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Central Piedmont Community College · Continuing Education
            </p>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Applied Communications &amp; Branding Certificate
            </h1>
            <p className="mt-5 max-w-xl text-body leading-relaxed text-white/80">
              Strengthen your personal brand, communicate with confidence, and
              increase your professional visibility through Central Piedmont
              Community College&apos;s Continuing Education Certificate.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
              >
                Register Today
              </a>
              <NavLink
                href="#why-this-certificate"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60"
              >
                Learn More
              </NavLink>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {heroValuePoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-2 text-sm text-white/85"
                >
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-white/5 p-3 shadow-xl backdrop-blur-sm">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
              <Image
                src={"/logos/Website_Pop_Up_Banner.png"}
                alt="Brittney Bogues, Founder & Chief Innovation Officer, The Bogues Group"
                fill
                priority
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_320px]">
          <div>
            {/* Why This Certificate */}
            <section id="why-this-certificate">
              <SectionEyebrow>The Opportunity</SectionEyebrow>
              <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl lg:text-left">
                Why This Certificate?
              </h2>
              <div className="mt-6 max-w-2xl text-center lg:text-left">
                <p className="text-body leading-relaxed text-navy">
                  Your expertise deserves to be seen. Success isn&apos;t just
                  about doing great work, it&apos;s about making sure people
                  recognize it.
                </p>
                <p className="mt-4 text-body leading-relaxed text-gray-600">
                  Whether you&apos;re building your career, changing industries,
                  leading a team, or growing a business, this certificate helps
                  you communicate your value with confidence and develop a
                  personal brand that creates new opportunities.
                </p>
              </div>
            </section>

            {/* Who It's For */}
            <section className="mt-16">
              <SectionEyebrow>Who It&apos;s For</SectionEyebrow>
              <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
                This Program Is Ideal For
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {whoItsFor.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 transition-colors duration-300 hover:border-gold/30"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy/5">
                      {item.icon}
                    </div>
                    <span className="font-heading text-sm font-bold text-navy">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* What You'll Learn */}
            <section className="mt-16">
              <SectionEyebrow>The Curriculum</SectionEyebrow>
              <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
                What You&apos;ll Learn
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {whatYoullLearn.map((item) => (
                  <IconCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
            </section>

            {/* What You'll Leave With */}
            <section className="mt-16">
              <SectionEyebrow>The Outcome</SectionEyebrow>
              <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
                What You&apos;ll Leave With
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {whatYoullLeaveWith.map((item) => (
                  <IconCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                  />
                ))}
              </div>
            </section>

            {/* Meet Your Instructor */}
            <section className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <SectionEyebrow>Meet Your Instructor</SectionEyebrow>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={brittneyImage}
                    alt="Brittney Bogues"
                    fill
                    sizes="128px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-heading text-xl font-bold text-navy">
                    Brittney Bogues
                  </h3>
                  <p className="mt-1 font-semibold text-[#075E8B]">
                    Founder &amp; Chief Innovation Officer, The Bogues Group
                  </p>
                  <p className="mt-4 text-body leading-relaxed text-gray-600">
                    Brittney Bogues is an award-winning communications
                    strategist and founder of The Bogues Group. She has helped
                    professionals, entrepreneurs, athletes, and organizations
                    strengthen their brands, communicate their value, and create
                    meaningful career opportunities through strategic
                    communications and personal branding.
                  </p>
                </div>
              </div>
            </section>

            {/* Why Choose This Program */}
            <section className="mt-16">
              <SectionEyebrow>Why This Program</SectionEyebrow>
              <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
                Why Choose This Program
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {whyChoose.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg"
                  >
                    <h3 className="font-heading text-lg font-bold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="mt-16">
              <SectionEyebrow>Questions</SectionEyebrow>
              <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
                Frequently Asked Questions
              </h2>
              <div className="mt-8">
                {faqs.map((item) => (
                  <FaqAccordionItem key={item.question} item={item} />
                ))}
              </div>
            </section>
          </div>

          {/* Sticky sidebar (desktop only) */}
          <StickyRegisterCard />
        </div>
      </div>

      {/* Final CTA Banner */}
      <section className="relative overflow-hidden bg-navy px-6 py-16 text-center text-white md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#064e73]" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            Ready to Invest in Your Professional Growth?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/80">
            Strengthen your communication. Build your personal brand. Advance
            your career.
          </p>
          <div className="mt-8">
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
            >
              Register Today
            </a>
          </div>
        </div>
      </section>

      {/* Mobile sticky register bar (since sidebar is desktop-only) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden">
        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-lg bg-gold px-6 py-3 text-center text-sm font-bold text-[#021f2e] shadow-lg"
        >
          Register Today
        </a>
      </div>
    </>
  );
}
