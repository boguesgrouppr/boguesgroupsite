"use client";

import ContactForm from "@/components/ContactForm";
import Hero from "@/components/Hero";
import { Suspense } from "react";

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
      <div className="font-heading text-3xl font-bold text-gold md:text-4xl">{number}</div>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{label}</div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow duration-300 open:shadow-md">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
        {question}
        <svg
          className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300 group-open:rotate-180 group-open:text-gold"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="mt-4 text-gray-600 leading-relaxed">{answer}</div>
    </details>
  );
}

function HelpItem({ children }: { children: string }) {
  return (
    <div className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-md">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 transition-colors duration-300 group-hover:bg-gold/20">
        <CheckIcon className="h-4 w-4 text-gold" />
      </div>
      <span className="pt-0.5 text-body text-gray-700">{children}</span>
    </div>
  );
}

export default function ContactContent() {
  const helpItems = [
    "Public Relations & Media Relations",
    "Marketing Strategy & Campaigns",
    "Branding & Website Design",
    "Digital Marketing",
    "Experiential Marketing & Events",
    "Crisis Communications",
    "Strategic Communications Planning",
    "Community Engagement",
    "Executive Communications",
    "Sponsorship & Partnership Activation",
  ];

  const steps = [
    {
      number: "01",
      title: "Tell us about your project",
      description: "Complete the form with as much detail as possible so we can better understand your goals.",
    },
    {
      number: "02",
      title: "We'll review your inquiry",
      description: "A member of our team will review your submission and determine how we can best support your organization.",
    },
    {
      number: "03",
      title: "Let's connect",
      description: "If we're a good fit, we'll schedule a discovery call to discuss your goals, timeline, and next steps.",
    },
  ];

  const faqs = [
    {
      question: "What types of organizations do you work with?",
      answer:
        "We partner with businesses, nonprofits, government agencies, sports organizations, entrepreneurs, and corporations seeking strategic communications, marketing, and public relations support.",
    },
    {
      question: "Do you work outside of Charlotte?",
      answer:
        "Yes. While Bogues Group is headquartered in Charlotte, North Carolina, we proudly service clients throughout the United States.",
    },
    {
      question: "What happens after I submit the form?",
      answer:
        "A member of our team will review your inquiry and reach out to discuss your goals, timeline, and how we can best support your organization.",
    },
    {
      question: "Do you offer customized services?",
      answer: "Absolutely. Every engagement is tailored to your organization's goals, challenges, and budget.",
    },
  ];

  const industries = [
    "Sports & Entertainment",
    "Nonprofits",
    "Healthcare",
    "Education",
    "Government",
    "Consumer Brands",
    "Hospitality & Tourism",
    "Small Businesses",
    "Corporate Organizations",
  ];

  return (
    <div>
      <Hero
        title="Let's Start the Conversation"
        subtitle="Whether you're launching a new brand, planning an event, navigating a communications challenge, or looking to grow your organization's visibility, we're here to help."
      />

      {/* Intro + Direct Contact Card */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-lg leading-relaxed text-body">
              Every organization is different, which is why we take the time to understand your goals before
              recommending a strategy. Tell us about your project, and our team will be in touch to discuss how we
              can help bring your vision to life.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-navy">
              <span className="rounded-full bg-gold/15 px-4 py-2">Strategic guidance</span>
              <span className="rounded-full bg-gray-100 px-4 py-2">White-glove service</span>
            </div>
          </div>
          <aside className="relative overflow-hidden rounded-2xl bg-navy p-7 text-white shadow-xl transition-shadow duration-300 hover:shadow-2xl">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
            <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-gold">Direct contact</p>
            <h2 className="relative mt-3 font-heading text-2xl font-bold text-gold">Start with a conversation.</h2>
            <a
              href="tel:+19106340054"
              className="relative mt-6 block text-lg font-semibold transition-colors duration-300 hover:text-gold"
            >
              (910) 634-0054
            </a>
            <a
              href="mailto:info@boguesgroup.com"
              className="relative mt-2 block text-white/75 transition-colors duration-300 hover:text-gold"
            >
              info@boguesgroup.com
            </a>
            <p className="relative mt-6 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/70">
              8022 Providence Rd, STE 500-178
              <br />
              Charlotte, NC 28277
            </p>
          </aside>
        </div>
      </section>

      {/* How We Can Help */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionEyebrow>Our Expertise</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">How We Can Help</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">We partner with organizations on:</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {helpItems.map((item) => (
              <HelpItem key={item}>{item}</HelpItem>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionEyebrow>The Process</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">What Happens Next?</h2>
          <div className="mt-10 space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="group flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 transition-colors duration-300 group-hover:bg-gold/20">
                  <span className="font-heading text-xl font-bold text-gold">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Bogues Group */}
      <section className="relative overflow-hidden bg-navy px-6 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#064e73]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Why Bogues Group</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="text-center font-heading text-2xl font-bold text-white md:text-3xl">
            Why Work With Bogues Group?
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            <StatCard number="15+" label="Years strategic communications experience" />
            <StatCard number="250+" label="Events and brand activations" />
            <StatCard number="Award-Winning" label="Public relations and marketing agency" />
            <StatCard number="National Reach" label="Supporting organizations across the United States" />
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionEyebrow>Who We Serve</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">Industries We Serve</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
            We proudly partner with organizations across a variety of industries, including:
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {industries.map((industry) => (
              <span
                key={industry}
                className="inline-flex cursor-default rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-navy transition-colors duration-300 hover:bg-gold/15"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionEyebrow>Common Questions</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <SectionEyebrow>Get In Touch</SectionEyebrow>
          <div className="mb-10 space-y-1 text-center text-gray-600">
            <p>We&apos;d love to hear from you. Fill out the form below and we&apos;ll be in touch.</p>
            <p className="text-sm">
              <a href="tel:+19106340054" className="text-navy transition-colors hover:text-gold hover:underline">
                (910) 634-0054
              </a>{" "}
              &middot;{" "}
              <a
                href="mailto:info@boguesgroup.com"
                className="text-navy transition-colors hover:text-gold hover:underline"
              >
                info@boguesgroup.com
              </a>
            </p>
            <p className="text-sm">8022 Providence Rd, STE 500-178, Charlotte, NC 28277</p>
          </div>
          <Suspense fallback={<p className="text-center text-gray-500">Loading form...</p>}>
            <ContactForm />
          </Suspense>

          <section className="mt-14 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center transition-shadow duration-300 hover:shadow-md">
            <h2 className="font-heading text-2xl font-bold text-navy">Join the Team</h2>
            <p className="mt-3 text-gray-700">
              Interested in working with Bogues Group? Start your onboarding process here.
            </p>
            <a
              href="https://portal.boguesgroup.com/public/form/view/64bf1d7aa83f93003a8f2578"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:shadow-lg"
            >
              New Hire Onboarding Form
            </a>
          </section>
        </div>
      </section>
    </div>
  );
}