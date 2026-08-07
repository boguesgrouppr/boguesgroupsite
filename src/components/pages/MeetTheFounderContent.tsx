"use client";

import Hero from "@/components/Hero";
import NavLink from "@/components/NavLink";
import { toMediaUrl } from "@/lib/media-url";
import Image from "next/image";

const brittneyImage = toMediaUrl(
  "/media/2025/08/Brittney-Bogues-Founder-CIO-of-Bogues-Group-1-1-696x464-1.webp",
);

interface FounderBio {
  title: string;
  subtitle: string;
  intro: string;
  leadershipPhilosophy: string;
  careerHighlights: string[];
  beyondBoguesGroup: string;
  featuredIn: { src: string; name: string }[];
}

const founderBio: FounderBio = {
  title: "Brittney Bogues",
  subtitle: "Founder & Chief Innovation Officer",
  intro: `Building brands. Creating connections. Driving impact.

Bogues Group was founded on the belief that meaningful relationships are the foundation of every successful brand. As Founder and Chief Innovation Officer, Brittney Bogues partners with organizations, entrepreneurs, nonprofits, and public figures to develop strategic communications, marketing initiatives, and experiential campaigns that strengthen reputations, inspire engagement, and deliver measurable results.

With more than 15 years of experience in communications, public relations, marketing, event strategy, and nonprofit leadership, Brittney has built a reputation for helping clients navigate complex challenges while creating opportunities for long-term growth. Her collaborative approach, strategic mindset, and commitment to excellence have earned the trust of organizations across industries.`,
  leadershipPhilosophy: `Strategy first. Relationships always.

At Bogues Group, every partnership begins with listening. Brittney believes the strongest communications strategies are built on understanding an organization's mission, audience, and goals before developing thoughtful, customized solutions.

Her leadership philosophy is simple: combine strategic thinking with authentic relationships, deliver exceptional service, and create work that leaves a lasting impact.`,
  careerHighlights: [
    "250+ event activations produced across Charlotte, New York City, Washington, D.C., and New Orleans",
    "National media placements in TIME, USA Today, ESPN, CNN, Forbes, GQ, and other regional and national outlets",
    "Raised more than $100,000 annually in support of nonprofit organizations",
    "PRSA Award Recipient",
    "Published contributor to The Huffington Post",
    "Recognized by Elevate Lifestyle's 30 Under 30",
    "Featured in SouthPark Magazine's '9 Entrepreneurs You Should Know'",
    "Recognized by Charlotte Magazine and Charlotte Agenda",
    "Communications strategist for political campaigns, nonprofit organizations, entrepreneurs, and nationally recognized brands",
  ],
  beyondBoguesGroup: `Outside of the office, Brittney is passionate about mentoring entrepreneurs, supporting underserved communities, and advocating for individuals impacted by domestic violence. She believes businesses have the power to create meaningful change, and she carries that philosophy into both her professional work and community involvement.

When she's not working with clients, you'll likely find her reading, traveling, working out, discovering new music, or spending time with friends and family.`,
  featuredIn: [
    { src: "/logos/time.png", name: "TIME" },
    { src: "/logos/forbes.jpeg", name: "Forbes" },
    { src: "/logos/espn.png", name: "ESPN" },
    { src: "/logos/cnn.png", name: "CNN" },
    { src: "/logos/USA_today.png", name: "USA Today" },
    { src: "/logos/gq.png", name: "GQ" },
    { src: "/logos/huffington.jpeg", name: "The Huffington Post" },
  ],
};

function StarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function HeartIcon({ className = "h-6 w-6" }: { className?: string }) {
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
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function BookOpenIcon({ className = "h-6 w-6" }: { className?: string }) {
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
        d="M4 19.5A2.5 2.5 0 016.5 17H20"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
      />
    </svg>
  );
}

function FeaturedLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex items-center justify-center h-24 w-full rounded-xl border border-gray-200 bg-white">
      <div className="relative mx-[10px] w-[160px] h-[50px]">
        <Image
          src={logo}
          alt={`Featured in ${name}`}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 120px, 160px"
        />
      </div>
    </div>
  );
}

export default function MeetTheFounderContent() {
  return (
    <>
      <Hero
        title="Meet the Founder"
        subtitle="Brittney Bogues, Founder & Chief Innovation Officer"
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        {/* Intro */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="relative overflow-hidden rounded-2xl bg-navy p-3 shadow-xl">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
              <Image
                src={brittneyImage}
                alt="Brittney Bogues, Founder and Chief Innovation Officer of Bogues Group"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute bottom-7 left-7 rounded-xl bg-white px-6 py-5 shadow-lg">
              <Image src="/logo.png" alt="Bogues Group" width={125} height={118} className="h-14 w-auto" />
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-body">
            <p className="lead text-navy">
              {founderBio.intro.split("\n\n")[0]}
            </p>
            <p>{founderBio.intro.split("\n\n")[1]}</p>
            <p>{founderBio.intro.split("\n\n")[2]}</p>
            <div className="not-prose mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-gold/15 px-4 py-2 text-sm font-bold text-navy">
                15+ years of leadership
              </span>
              <span className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white">
                250+ activations
              </span>
            </div>
          </div>
        </div>

        {/* Leadership Philosophy */}
        <div className="mt-16 rounded-2xl border border-gold/20 bg-[#f8f6f0] p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 opacity-[0.06]">
            <Image
              src="/logo.png"
              alt=""
              width={125}
              height={118}
              className="h-40 w-auto"
              aria-hidden="true"
            />
          </div>
          <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
            Leadership Philosophy
          </h2>
          <p className="mt-4 leading-relaxed text-body">
            {founderBio.leadershipPhilosophy}
          </p>
        </div>

        {/* Experience & Recognition */}
        <div className="mt-16">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
              Experience & Recognition
            </h2>
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5">
              <Image
                src="/logo.png"
                alt=""
                width={125}
                height={118}
                className="h-4 w-auto opacity-60"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
                Bogues Group
              </span>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Career Highlights */}
            <div className="p-6 bg-white border border-gray-200 rounded-2xl">
              <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
                <BookOpenIcon className="h-6 w-6 text-gold" />
                Career Highlights
              </h3>
              <ul className="mt-4 space-y-3">
                {founderBio.careerHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3 text-body">
                    <StarIcon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Beyond Bogues Group */}
            <div className="p-6 bg-white border border-gray-200 rounded-2xl">
              <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
                <HeartIcon className="h-6 w-6 text-gold" />
                Beyond Bogues Group
              </h3>
              <p className="mt-4 leading-relaxed text-body">
                {founderBio.beyondBoguesGroup}
              </p>
            </div>
          </div>
        </div>

        {/* Featured In */}
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl text-center">
            Featured In
          </h2>
          <p className="mt-2 text-center text-gray-500">
            {/* Note: GC in source doc treated as likely typo for GQ per earlier PR mentions */}
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {founderBio.featuredIn.map((pub) => (
              <FeaturedLogo key={pub.src} name={pub.name} logo={pub.src} />
            ))}
          </div>
        </div>

        {/* Book Brittney for Speaking */}
        <div className="mt-16 p-8 bg-navy text-white rounded-2xl">
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl text-center">
            Want to book Brittney for your next event?
          </h2>
          <p className="mt-4 text-center text-white/75 max-w-2xl mx-auto">
            Book Brittney Bogues for your next panel, fireside chat, or
            conference and bring a high-impact, results-driven voice to the
            stage. As a sought-after speaker and founder of a premier boutique
            PR and branding firm, Brittney delivers engaging, actionable
            insights on leadership, brand building, and strategic
            growth—grounded in real-world experience.
          </p>
          <p className="mt-4 text-center text-white/75 max-w-2xl mx-auto">
            Looking for additional perspectives? Brittney also represents a
            curated roster of dynamic speakers, ensuring the right voice to
            elevate your event and create a memorable audience experience.
          </p>
          <div className="mt-8 text-center">
            <NavLink
              href="/speaker-roster"
              className="inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:bg-[#e5c256] hover:shadow-xl hover:scale-[1.03]"
            >
              Meet Brittney and our other speakers →
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}
