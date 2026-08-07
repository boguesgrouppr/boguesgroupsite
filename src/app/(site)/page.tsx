import { Metadata } from "next";
import NavLink from "@/components/NavLink";
import Hero from "@/components/Hero";
import HomepageNewsletter from "@/components/HomepageNewsletter";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { supabase } from "@/lib/supabase";
import { getAllCaseStudies } from "@/lib/case-studies";
import { toMediaUrl } from "@/lib/media-url";
import { stripHtml } from "@/lib/content-urls";
import { isPriorityImage } from "@/lib/image-priority";
import type { CaseStudy, CaseStudyCategory } from "@/lib/case-studies-shared";
import { getCategoryTabLabel } from "@/lib/case-studies-shared";
import {
  TrendingUp,
  CalendarDays,
  Award,
  MapPinned,
  ArrowRight,
  FileDown,
} from "lucide-react";
import Image from "next/image";

export const dynamic = "force-static";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Bogues Group - North Carolina's Premier PR Firm",
  description:
    "Strategic public relations, marketing, and branding that elevate your brand and deliver results. Bogues Group is North Carolina's premier PR firm.",
  openGraph: {
    title: "Bogues Group - North Carolina's Premier PR Firm",
    description:
      "Strategic public relations, marketing, and branding that elevate your brand and deliver results.",
    type: "website",
    siteName: "Bogues Group",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bogues Group - North Carolina's Premier PR Firm",
    description:
      "Strategic public relations, marketing, and branding that elevate your brand and deliver results.",
  },
};

const stats = [
  {
    icon: TrendingUp,
    number: "15+",
    label: "Years Strategic communications experience",
  },
  { icon: CalendarDays, number: "250+", label: "Events and brand activations" },
  {
    icon: Award,
    number: "Award-Winning",
    label: "Public relations and marketing agency",
  },
  {
    icon: MapPinned,
    number: "National Reach",
    label: "Supporting organizations across the United States",
  },
];

const linkCards = [
  {
    title: "Who We Are",
    href: "/about",
    teaser:
      "A strategic communications and marketing agency helping organizations build credibility, strengthen relationships, and create lasting impact.",
  },
  {
    title: "What We Do",
    href: "/services",
    teaser:
      "Public relations, marketing, branding, experiential events, and strategic communications — full-service solutions tailored to your goals.",
  },
];

const services = [
  {
    title: "Public Relations",
    description:
      "Strategic communications that build credibility, shape narratives, and position your brand as an industry leader.",
  },
  {
    title: "Marketing",
    description:
      "Data-driven campaigns that connect with your audience and deliver measurable results for your business.",
  },
  {
    title: "Crisis Management",
    description:
      "Rapid response planning and reputation protection when it matters most, keeping your brand resilient.",
  },
  {
    title: "Media Relations",
    description:
      "Building strong relationships with journalists and outlets to earn the coverage your story deserves.",
  },
  {
    title: "Digital Marketing",
    description:
      "Social media, SEO, and content strategies that amplify your reach and engage audiences online.",
  },
  {
    title: "Strategy & Planning",
    description:
      "Comprehensive brand strategy and communications planning that aligns with your long-term vision.",
  },
];

type ClientLogo = {
  src: string;
  alt: string;
  href?: string;
  width: number;
  height: number;
};

const clients: ClientLogo[] = [
  {
    src: "/logos/yelp-logo.png",
    alt: "Yelp",
    href: "/case-studies/yelp-crown-town-neighborhood-showdown",
    width: 1200,
    height: 484,
  },
  {
    src: "/logos/muggsy.png",
    alt: "Muggsy Bogues",
    href: "/case-studies/muggsy-bogues-family-foundation",
    width: 500,
    height: 108,
  },
  {
    src: "/logos/microsoft.png",
    alt: "Microsoft",
    href: "/case-studies/microsoft-youthspark-ai",
    width: 216,
    height: 46,
  },
  {
    src: "/logos/abc-board.png",
    alt: "Mecklenburg County ABC Board",
    href: "/case-studies/mecklenburg-county-abc-board",
    width: 458,
    height: 350,
  },
  {
    src: "/logos/frankies.png",
    alt: "Frankie's Fun Park",
    href: "/case-studies/frankies-amusement-park",
    width: 200,
    height: 200,
  },
  {
    src: "/logos/communities-in-schools.png",
    alt: "Communities In Schools",
    href: "/case-studies/communities-in-schools-charlotte-mecklenburg",
    width: 200,
    height: 200,
  },
  { src: "/logos/Kraft.PNG", alt: "Kraft", href: "/case-studies/kraft", width: 3840, height: 2160 },
  { src: "/logos/american_express.PNG", alt: "American Express", width: 225, height: 224 },
  { src: "/logos/capital_one.PNG", alt: "Capital One", width: 4096, height: 4096 },
  { src: "/logos/charlotte_crown.PNG", alt: "Charlotte Crown", width: 319, height: 313 },
  { src: "/logos/charlotte_hornets.JPG", alt: "Charlotte Hornets", width: 228, height: 221 },
  { src: "/logos/crva.PNG", alt: "CRVA", width: 512, height: 266 },
  { src: "/logos/toronto_raptors.PNG", alt: "Toronto Raptors", width: 225, height: 225 },
];

interface NewsFeedItem {
  type: "case-study" | "blog";
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  date: string;
  categories?: CaseStudyCategory[];
  client?: string;
}

const CAMPAIGN_TAG = ""; 

interface SocialLink {
  label: string;
  href: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  // { label: "Instagram", href: "https://instagram.com/boguesgroup" },
  // { label: "LinkedIn", href: "https://linkedin.com/company/boguesgroup" },
  // { label: "Facebook", href: "https://facebook.com/boguesgroup" },
];

interface DownloadResource {
  title: string;
  href: string;
  coverImage: string;
}

const RESOURCES: DownloadResource[] = [
  // {
  //   title: "Bogues Group Capabilities Deck",
  //   href: "/downloads/bogues-group-capabilities.pdf",
  //   coverImage: "/downloads/capabilities-cover.jpg",
  // },
];

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-[#D4AF38]" />
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF38]">
        {children}
      </span>
      <span className="h-px w-8 bg-[#D4AF38]" />
    </div>
  );
}

function StatCard({
  icon: Icon,
  number,
  label,
}: {
  icon: typeof TrendingUp;
  number: string;
  label: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#D4AF38] transition-transform duration-300 group-hover:scale-x-100" />
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#075E8B]/8">
        <Icon className="h-6 w-6 text-[#075E8B]" strokeWidth={1.75} />
      </div>
      <div className="font-heading text-3xl font-bold text-[#075E8B] md:text-4xl">
        {number}
      </div>
      <div className="mt-2 text-sm leading-relaxed text-gray-500">{label}</div>
    </div>
  );
}

function CaseStudyHighlightCard({
  study,
  priority = false,
}: {
  study: CaseStudy;
  priority?: boolean;
}) {
  const coverAlt = study.client
    ? `${study.client} — ${study.title}`
    : study.title;

  return (
    <NavLink
      href={`/case-studies/${study.slug}`}
      className="group block h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {study.cover_image_url ? (
          <Image
            src={study.cover_image_url}
            alt={coverAlt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#075E8B] to-[#064e73]" />
        )}
        {study.categories && study.categories.length > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-[#D4AF38] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#075E8B] shadow-sm">
            {getCategoryTabLabel(study.categories[0])}
          </span>
        )}
      </div>
      <div className="p-6">
        {study.client && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#D4AF38]">
            {study.client}
          </p>
        )}
        <h3 className="font-heading text-lg font-bold leading-snug text-[#075E8B] transition-colors duration-300 group-hover:text-[#D4AF38]">
          {decodeHtmlEntities(study.title)}
        </h3>
        {study.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {stripHtml(study.short_description)}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#075E8B] transition-all duration-300 group-hover:gap-2 group-hover:text-[#D4AF38]">
          Read case study
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </NavLink>
  );
}


function FeaturedFeedCard({ item }: { item: NewsFeedItem }) {
  const href =
    item.type === "case-study"
      ? `/case-studies/${item.slug}`
      : `/blog/${item.slug}`;
  return (
    <NavLink href={href} className="group block h-full">
      <article className="relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl">
        {item.image ? (
          <Image
            src={item.image}
            alt={
              item.type === "case-study" && item.client
                ? `${item.client} — ${item.title}`
                : item.title
            }
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#075E8B] to-[#064e73]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        <span className="absolute left-6 top-6 rounded-full bg-[#D4AF38] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#075E8B] shadow-sm">
          {item.type === "case-study" ? "Case Study" : "Blog"}
        </span>

        <div className="relative flex flex-col p-7 md:p-8">
          {item.categories && item.categories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {item.categories.slice(0, 2).map((cat) => (
                <span
                  key={cat}
                  className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  {getCategoryTabLabel(cat)}
                </span>
              ))}
            </div>
          )}
          {item.client && (
            <p className="mb-1 text-sm font-medium text-white/70">
              {item.client}
            </p>
          )}
          <h3 className="mb-3 max-w-xl font-heading text-2xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#D4AF38] md:text-3xl">
            {decodeHtmlEntities(item.title)}
          </h3>
          {item.excerpt && (
            <p className="line-clamp-2 max-w-lg text-sm leading-relaxed text-white/80">
              {item.excerpt}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#D4AF38]">
            Read more
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </NavLink>
  );
}

function CompactFeedCard({ item }: { item: NewsFeedItem }) {
  const href =
    item.type === "case-study"
      ? `/case-studies/${item.slug}`
      : `/blog/${item.slug}`;
  return (
    <NavLink href={href} className="group block">
      <article className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {item.image ? (
            <Image
              src={item.image}
              alt={
                item.type === "case-study" && item.client
                  ? `${item.client} — ${item.title}`
                  : item.title
              }
              fill
              sizes="96px"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#075E8B]/10 to-[#D4AF38]/10">
              <Image
                src="/logo.png"
                alt="Bogues Group"
                width={125}
                height={118}
                className="h-6 w-auto opacity-40"
              />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-[#D4AF38]">
            {item.type === "case-study" ? "Case Study" : "Blog"}
          </span>
          <h3 className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-snug text-[#075E8B] transition-colors duration-300 group-hover:text-[#D4AF38]">
            {decodeHtmlEntities(item.title)}
          </h3>
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF38]" />
      </article>
    </NavLink>
  );
}

async function getNewsFeed(): Promise<NewsFeedItem[]> {
  const supabaseClient = supabase;

  const [{ data: rawPosts }, caseStudies] = await Promise.all([
    supabaseClient
      .from("blog_posts")
      .select("id, slug, title, excerpt, featured_image, date")
      .eq("status", "publish")
      .order("date", { ascending: false })
      .limit(4),
    getAllCaseStudies(),
  ]);

  const blogItems: NewsFeedItem[] = (rawPosts ?? []).map((p) => ({
    type: "blog" as const,
    title: p.title,
    slug: p.slug,
    excerpt: stripHtml(p.excerpt),
    image: p.featured_image ? toMediaUrl(p.featured_image) : null,
    date: p.date ?? "",
  }));

  const caseStudyItems: NewsFeedItem[] = caseStudies.map((cs: CaseStudy) => ({
    type: "case-study" as const,
    title: cs.title,
    slug: cs.slug,
    excerpt: stripHtml(cs.short_description),
    image: cs.cover_image_url,
    date: cs.created_at,
    categories: cs.categories,
    client: cs.client,
  }));

  const combined = [...blogItems, ...caseStudyItems];
  combined.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return combined.slice(0, 5);
}

export default async function Home() {
  const feed = await getNewsFeed();
  const [featured, ...rest] = feed;

  // Reuse the same case-studies data source for the new highlight grid
  const caseStudies = (await getAllCaseStudies()).slice(0, 3);

  return (
    <>
      {/* 1. HERO */}
      <Hero
        title="North Carolina's Premier PR Firm"
        subtitle="Strategic public relations, marketing, and branding that elevate your brand, amplify your voice, and deliver results. The Bogues Group partners with organizations and leaders to tell stories that move people."
        ctaText="Get in Touch"
        ctaHref="/contact"
      />

      {/* 2. STAT BAR — overlaps hero bottom edge for a modern layered feel */}
      <section className="relative bg-white px-6 pb-16 pt-10 md:pb-20 md:pt-4">
        <div className="mx-auto -mt-16 max-w-5xl md:-mt-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.number} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRUSTED LEADER / DUAL LINK-CARDS */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionEyebrow>Trusted Communications Partner</SectionEyebrow>
          <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-gray-600 md:text-xl">
            Bogues Group is a strategic communications and marketing agency that
            helps organizations build credibility, strengthen relationships, and
            create lasting impact through public relations, marketing, branding,
            and strategic communications.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {linkCards.map((card) => (
              <NavLink
                key={card.title}
                href={card.href}
                className="group relative block overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-[#D4AF38] transition-all duration-300 group-hover:w-16" />
                <h3 className="font-heading text-xl font-bold text-[#075E8B]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {card.teaser}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#D4AF38] transition-all duration-300 group-hover:gap-2">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICES OVERVIEW (new) */}
      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <SectionEyebrow>What We Do</SectionEyebrow>
            <h2 className="font-heading text-2xl font-bold text-[#075E8B] md:text-4xl">
              Full-Service PR &amp; Marketing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Full-service public relations and marketing solutions tailored to
              your goals.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <NavLink
                key={service.title}
                href="/services"
                className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-[#D4AF38] transition-all duration-300 group-hover:w-16" />
                <h3 className="mb-3 font-heading text-xl font-bold text-[#075E8B] transition-colors duration-300 group-hover:text-[#D4AF38]">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {service.description}
                </p>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR CLIENTS / BRANDS LOGO GRID */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionEyebrow>Who We Work With</SectionEyebrow>
          <h2 className="text-center font-heading text-2xl font-bold text-[#075E8B] md:text-3xl">
            Our Clients
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
            We partner with leading organizations across industries to deliver
            measurable results.
          </p>
          <div className="mt-12 grid grid-cols-2 items-center gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {clients.map((client) => {
              const img = (
                <Image
                  src={client.src}
                  alt={client.alt}
                  width={client.width}
                  height={client.height}
                  className="h-14 w-full object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  loading="lazy"
                />
              );
              return client.href ? (
                <NavLink
                  key={client.alt}
                  href={client.href}
                  className="flex h-28 items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF38]/40 hover:shadow-md"
                >
                  {img}
                </NavLink>
              ) : (
                <div
                  key={client.alt}
                  className="flex h-28 items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  {img}
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <NavLink
              href="/case-studies"
              className="inline-flex items-center gap-2 rounded-lg bg-[#075E8B] px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#064e73] hover:shadow-lg"
            >
              View Case Studies
              <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* 6. CLIENT TESTIMONIALS (new, redesigned) */}
      <TestimonialCarousel />

      {/* 7. CASE STUDIES HIGHLIGHT GRID (new design, same data source) */}
      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <SectionEyebrow>Proven Results</SectionEyebrow>
              <h2 className="font-heading text-2xl font-bold text-[#075E8B] md:text-3xl">
                Case Studies
              </h2>
              <p className="mt-4 max-w-md text-gray-500">
                See how we deliver measurable results for our clients.
              </p>
            </div>
            <NavLink
              href="/case-studies"
              className="hidden items-center gap-1 whitespace-nowrap text-sm font-semibold text-[#075E8B] transition-colors hover:text-[#D4AF38] sm:inline-flex"
            >
              View All <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>

          {caseStudies.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((study, index) => (
                <CaseStudyHighlightCard
                  key={study.id}
                  study={study}
                  priority={isPriorityImage(index)}
                />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-gray-400">
              No case studies yet. Check back soon.
            </p>
          )}

          <div className="mt-8 text-center sm:hidden">
            <NavLink
              href="/case-studies"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#075E8B] transition-colors hover:text-[#D4AF38]"
            >
              View All Case Studies <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* 8. NEWS & RESOURCES — CRVA-style featured layout: 1 large lead
          story + up to 2 compact list rows stacked beside it */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#D4AF38]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF38]">
                  Latest Stories
                </span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-[#075E8B] md:text-3xl">
                News &amp; Resources
              </h2>
              <p className="mt-4 max-w-md text-gray-500">
                The latest insights, case studies, and updates from Bogues
                Group.
              </p>
            </div>
            <NavLink
              href="/case-studies"
              className="hidden items-center gap-1 whitespace-nowrap text-sm font-semibold text-[#075E8B] transition-colors hover:text-[#D4AF38] sm:inline-flex"
            >
              See All <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>

          {featured ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <FeaturedFeedCard item={featured} />
              </div>
              <div className="flex flex-col gap-4">
                {rest.length > 0 ? (
                  rest.map((item) => (
                    <CompactFeedCard
                      key={`${item.type}-${item.slug}`}
                      item={item}
                    />
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
                    More stories coming soon.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="col-span-full py-12 text-center text-gray-400">
              No stories yet. Check back soon.
            </p>
          )}

          <div className="mt-8 text-center sm:hidden">
            <NavLink
              href="/case-studies"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#075E8B] transition-colors hover:text-[#D4AF38]"
            >
              See All <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* 8.5 SOCIAL SHARE CTA — CRVA-style hashtag block. No-op until
          CAMPAIGN_TAG is set above; blocked on Britney/Monet for copy + URLs. */}
      {CAMPAIGN_TAG && (
        <section className="bg-white px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#D4AF38]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF38]">
                Share Your Experience
              </span>
              <span className="h-px w-8 bg-[#D4AF38]" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#075E8B] md:text-3xl">
              {CAMPAIGN_TAG}
            </h2>
            {SOCIAL_LINKS.length > 0 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-sm font-bold text-[#075E8B] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF38] hover:bg-[#D4AF38] hover:text-white"
                  >
                    {label[0]}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 9. NEWSLETTER SIGNUP */}
      <section className="relative overflow-hidden bg-[#075E8B] px-6 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#075E8B] via-[#075E8B] to-[#064e73]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF38]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF38]">
              Stay In The Loop
            </span>
            <span className="h-px w-8 bg-[#D4AF38]" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            Stay Connected
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Get the latest insights, case studies, and news delivered to your
            inbox.
          </p>
          <div className="mt-8">
            <HomepageNewsletter />
          </div>
        </div>
      </section>


      {RESOURCES.length > 0 && (
        <section className="bg-gray-50 px-6 py-14 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-2">
              {RESOURCES.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={resource.coverImage}
                      alt={resource.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-sm font-bold leading-snug text-[#075E8B] transition-colors duration-300 group-hover:text-[#D4AF38]">
                      {resource.title}
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                      <FileDown className="h-3.5 w-3.5" />
                      Download
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. CLOSING CTA (new) */}
      <section
        className="px-5 py-20 sm:px-6 sm:py-28 md:py-32"
        style={{
          background:
            "linear-gradient(165deg, #021f2e 0%, #042f45 30%, #075E8B 70%, #1a82b5 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-[#D4AF38] sm:mb-8" />
          <h2 className="font-heading text-2xl font-bold leading-[1.1] text-white sm:text-3xl md:text-5xl lg:text-6xl">
            Ready to Elevate Your Brand?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:mt-8 sm:text-lg">
            Let us craft a strategy that amplifies your story and drives real
            impact.
          </p>
          <div className="mt-8 sm:mt-12">
            <NavLink
              href="/contact"
              className="inline-block whitespace-nowrap rounded-lg bg-[#D4AF38] px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl sm:px-10 sm:py-5 sm:text-lg"
            >
              Start a Conversation
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}