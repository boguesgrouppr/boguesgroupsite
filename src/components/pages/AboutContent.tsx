"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Hero from "@/components/Hero";
import NavLink from "@/components/NavLink";
import { toMediaUrl } from "@/lib/media-url";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  highlights?: string[];
  image?: string;
  featured?: boolean;
  showViewFullBio?: boolean;
}

interface Advisor {
  name: string;
  title: string;
  description: string;
  image?: string;
}

const brittneyImage = toMediaUrl(
  "/media/2025/08/Brittney-Bogues-Founder-CIO-of-Bogues-Group-1-1-696x464-1.webp",
);

const teamMembers: TeamMember[] = [
  {
    name: "Brittney Bogues",
    title: "Founder & Chief Innovation Officer",
    bio: "A strategic communications leader with more than 15 years of experience in public relations, marketing, nonprofit leadership, and brand strategy. Brittney has helped organizations secure national media coverage, execute hundreds of successful events, and build meaningful connections that drive lasting impact.",
    highlights: [
      "15+ years of communications & marketing leadership",
      "250+ event activations",
      "National media placements including ESPN, TIME, Forbes, CNN & USA Today",
      "PRSA Award Recipient",
      "Master's Degree in Communications",
    ],
    showViewFullBio: true,
    image: brittneyImage,
    featured: true,
  },
  {
    name: "Monet Holliday",
    title: "Office Manager",
    image: "/logos/MonetHolliday.jpg",
    bio: "Monet keeps Bogues Group running behind the scenes, bringing more than a decade of operational experience supporting businesses across multiple industries. Her passion for organization, client service, and helping small businesses thrive makes her an integral part of the team.",
    highlights: [
      "10+ years of operational experience",
      "Multi-industry business support expertise",
      "Client service & organization specialist",
    ],
  },
  {
    name: "Harleigh Roach",
    title: "Account Manager",
    image: "/logos/Harleigh.png",
    bio: "Harleigh supports clients through strategic marketing, branding, and campaign management. Her experience in creative storytelling and audience engagement helps organizations build stronger brands and lasting connections.",
    highlights: [
      "Strategic marketing & campaign management",
      "Creative storytelling & audience engagement",
      "Brand building & client relationship management",
    ],
  },
  {
    name: "Sameer",
    title: "Web Developer & Designer",
    image: "/logos/Sameer.jpeg",
    bio: "Sameer leads the technical development of the Bogues Group digital platform, building a fast, scalable website that reflects the brand's strategic, results-driven approach. His work spans full-stack development, database architecture, and integrations that keep client-facing tools running smoothly behind the scenes.",
    highlights: [
      "Full-stack web development & architecture",
      "Custom integrations & workflow automation",
      "Performance, security & scalability focus",
    ],
  },
];

const advisors: Advisor[] = [
  {
    name: "Don Anderson",
    title: "Operating Advisor",
    image: "/logos/DonAnderson.JPG",
    description:
      "Operating Advisor with extensive experience in sustainability, operational strategy, and global business development.",
  },
  {
    name: "Michelle Diamandis",
    title: "Communications Executive",
    image: "/logos/MichelleDiamandis.jpg",
    description:
      "Communications executive specializing in consumer brands, beverage, cannabis, and strategic storytelling.",
  },
  {
    name: "David Eyl",
    title: "Sports Marketing Executive",
    image: "/logos/DavidEyl.jpeg",
    description:
      "Sports marketing executive with leadership experience across professional sports, entertainment, and fan engagement.",
  },
  {
    name: "Rita Scott",
    title: "Broadcasting Executive",
    image: "/logos/RitaScott.jpg",
    description:
      "Award-winning broadcasting executive and former television station general manager with decades of media leadership.",
  },
  {
    name: "Michelle Thomas",
    title: "Corporate Affairs & Communications Executive",
    image: "/logos/MichelleThomas.jpg",
    description:
      "Corporate affairs and communications executive specializing in government relations, philanthropy, and brand strategy.",
  },
];

const values = [
  {
    title: "Integrity",
    description: "We lead with honesty, transparency, and accountability.",
  },
  {
    title: "Momentum Mindset",
    description: "We embrace challenges, continuous learning, and growth.",
  },
  {
    title: "Passion",
    description: "We bring energy, creativity, and purpose to every project.",
  },
  {
    title: "Accountability",
    description: "We own our work, our commitments, and our results.",
  },
  {
    title: "Commitment to Excellence",
    description: "We strive for exceptional quality and meaningful impact.",
  },
  {
    title: "Teamwork & Individual Initiative",
    description:
      "We value collaboration while empowering every team member to lead.",
  },
];

const whyBoguesGroup = [
  {
    title: "Strategic. Creative. Connected.",
    description:
      "We believe successful partnerships are built on more than great ideas. They require thoughtful strategy, trusted relationships, and an unwavering commitment to exceptional service. Every project is approached with intention, collaboration, and a focus on delivering meaningful results for our clients and the communities they serve.",
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

function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg">
      <div className="mb-3 h-1 w-8 rounded-full bg-gold transition-all duration-300 group-hover:w-12" />
      <h3 className="font-heading text-lg font-bold text-navy">{title}</h3>
      <p className="mt-3 text-body text-gray-600">{description}</p>
    </div>
  );
}

function InitialsPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="flex h-60 items-center justify-center bg-gradient-to-br from-navy to-[#075E8B]">
      <span className="font-heading text-5xl font-bold text-white/20">
        {initials}
      </span>
    </div>
  );
}

function TeamCard({
  member,
  priority = false,
}: {
  member: TeamMember;
  priority?: boolean;
}) {
  const imagePanel = member.image ? (
    <div
      className={
        member.featured
          ? "relative h-full min-h-[400px] w-full overflow-hidden"
          : "relative h-[300px] w-full overflow-hidden"
      }
    >
      <Image
        src={member.image}
        alt={`${member.name}, ${member.title}`}
        fill
        priority={priority}
        sizes={
          member.featured
            ? "(max-width: 768px) 100vw, 40vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        className={
          member.featured
            ? "object-cover object-top"
            : "object-cover object-top transition-transform duration-500 group-hover:scale-105"
        }
      />
      {!member.featured && (
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </div>
  ) : (
    <InitialsPlaceholder name={member.name} />
  );

  if (member.featured) {
    return (
      <article className="grid overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-xl md:grid-cols-[0.7fr_1.3fr]">
        <div className="relative bg-navy p-3">
          {imagePanel}
          <div className="absolute bottom-6 left-6 rounded-lg bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
              Bogues Group
            </p>
            <p className="mt-0.5 font-heading text-sm font-bold text-navy">
              Founder &amp; CIO
            </p>
          </div>
        </div>
        <div className="flex flex-col p-7 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Leadership
          </p>
          <h3 className="mt-3 font-heading text-3xl font-bold text-navy">
            {member.name}
          </h3>
          <p className="mt-1 font-semibold text-[#075E8B]">{member.title}</p>
          <p className="mt-6 text-body leading-relaxed text-gray-600">
            {member.bio}
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {member.highlights?.map((highlight) => (
              <div
                key={highlight}
                className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-700 ring-1 ring-gray-100 transition-colors duration-300 hover:bg-gold/5 hover:ring-gold/20"
              >
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
          {member.showViewFullBio && (
            <div className="mt-8 flex items-center gap-4">
              <NavLink
                href="/meet-the-founder"
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#075E8B] hover:shadow-lg"
              >
                View Full Bio
                <svg
                  className="h-4 w-4"
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
              </NavLink>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl">
      <div className="h-1 w-full bg-gradient-to-r from-gold to-gold/40" />
      {imagePanel}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-bold text-navy">
          {member.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-[#075E8B]">
          {member.title}
        </p>
        {member.bio && (
          <p className="mt-4 flex-1 text-body leading-relaxed text-gray-600">
            {member.bio}
          </p>
        )}
        {member.highlights && member.highlights.length > 0 && (
          <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
            {member.highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function AdvisorCard({ advisor }: { advisor: Advisor }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg">
      <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-100 transition-colors duration-300 group-hover:bg-gold/10">
        {advisor.image ? (
          <Image
            src={advisor.image}
            alt={advisor.name}
            fill
            sizes="96px"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <h3 className="font-heading text-lg font-bold text-navy">
        {advisor.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{advisor.title}</p>
      <p className="mt-3 text-sm text-gray-600">{advisor.description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
      <div className="font-heading text-3xl font-bold text-gold md:text-4xl">
        {number}
      </div>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{label}</div>
    </div>
  );
}

function IndustryTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex cursor-default items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-navy transition-colors duration-300 hover:bg-gold/15">
      {children}
    </span>
  );
}

export default function AboutContent() {
  return (
    <>
      <Hero
        title="About Us"
        subtitle="North Carolina's Premier Strategic Communications & Marketing Agency"
      />

      {/* Intro */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="prose prose-lg max-w-none text-body">
          <p className="lead text-navy">
            We create meaningful connections that move organizations forward.
          </p>
          <p>
            Bogues Group is a strategic communications and marketing agency that
            helps organizations build credibility, strengthen relationships, and
            create lasting impact. Through public relations, marketing,
            branding, experiential events, and strategic communications, we
            partner with clients to tell compelling stories, engage the right
            audiences, and achieve measurable results.
          </p>
          <p>
            From Fortune 500 companies and nonprofits to sports organizations
            and government agencies, our team delivers thoughtful strategy,
            creative execution, and white-glove service tailored to every
            client.
          </p>
          <NavLink
            href="/contact"
            className="not-prose mt-4 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#075E8B] hover:shadow-lg"
          >
            Work with our team
          </NavLink>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-navy p-3 shadow-xl">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
            <Image
              src={brittneyImage}
              alt="Brittney Bogues, founder of Bogues Group"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-top"
            />
          </div>
          <div className="absolute bottom-7 left-7 rounded-lg bg-white px-4 py-3 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
              Bogues Group
            </p>
            <p className="mt-1 font-heading text-sm font-bold text-navy">
              Strategy with purpose
            </p>
          </div>
        </div>
      </section>

      {/* Why Bogues Group */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionEyebrow>Our Philosophy</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
            Why Bogues Group?
          </h2>
          <div className="mt-8 flex justify-center">
            {whyBoguesGroup.map((item, index) => (
              <div
                key={index}
                className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center transition-shadow duration-300 hover:shadow-lg"
              >
                <h3 className="font-heading text-lg font-bold text-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-body text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionEyebrow>What Drives Us</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
            Our Values
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
            At Bogues Group, our values guide every decision we make and every
            partnership we build.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <ValueCard
                key={value.title}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionEyebrow>The People Behind It</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
            Meet Our Team
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
            A dedicated group of communications professionals committed to your
            success.
          </p>
          <div className="mt-10">
            {teamMembers
              .filter((m) => m.featured)
              .map((member) => (
                <TeamCard key={member.name} member={member} priority />
              ))}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers
              .filter((m) => !m.featured)
              .map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
          </div>
        </div>
      </section>

      {/* Board of Advisors */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionEyebrow>Strategic Guidance</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
            Board of Advisors
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-gray-500">
            Experienced leaders providing strategic guidance and industry
            expertise.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advisors.map((advisor) => (
              <AdvisorCard key={advisor.name} advisor={advisor} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Bogues Group - Stats */}
      <section className="relative overflow-hidden bg-navy px-6 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#064e73]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Why Bogues Group
            </span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="text-center font-heading text-2xl font-bold text-white md:text-3xl">
            Why Work With Bogues Group?
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            <StatCard
              number="15+"
              label="Years of strategic communications experience"
            />
            <StatCard number="250+" label="Events and brand activations" />
            <StatCard
              number="Award-Winning"
              label="Public relations and marketing agency"
            />
            <StatCard
              number="National Reach"
              label="Supporting organizations across the United States"
            />
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionEyebrow>Who We Serve</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
            Industries We Serve
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
            We proudly partner with organizations across a variety of
            industries, including:
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <IndustryTag key={industry}>{industry}</IndustryTag>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-gray-50 px-6 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
            Let&apos;s Build Something Meaningful Together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-body">
            Whether you&apos;re launching a brand, planning an event, navigating
            a communications challenge, or looking to grow your
            organization&apos;s visibility, we&apos;re ready to help.
          </p>
          <div className="mt-8">
            <NavLink
              href="/contact"
              className="inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
            >
              Schedule a Consultation
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}
