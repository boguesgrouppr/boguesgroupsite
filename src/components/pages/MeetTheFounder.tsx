"use client";

import Image from "next/image";
import Link from "next/link";

const THEME_DARK = "#075E8B";
const THEME_PURPLE = "#075E8B";
const THEME_GOLD = "#D4AF38";
const THEME_SURFACE = "#F8FAFC";


const achievements = [
  "Produced 250+ event activations across NYC, DC, Charlotte, and New Orleans",
  "Raised $100,000+ annually for nonprofit organizations",
  "Secured placements in TIME, ESPN, Forbes, CNN, GQ, USA Today, and Slam",
  "Published op-ed in The Huffington Post",
  "Elevate Lifestyle 30 Under 30",
  "Charlotte Agenda 30 Under 30",
  "Featured on the cover of South Park Magazine",
  "PRSA Award Recipient",
  "Political campaign communications experience",
  "Juvenile Crime Prevention Council Member",
  "CPCC Ruth G Shaw Mentor Leadership Program",
];


function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p
      className="uppercase tracking-[0.22em] text-sm font-semibold mb-5"
      style={{ color: THEME_GOLD }}
    >
      {children}
    </p>
  );
}


export default function MeetTheFounder() {
  return (
    <div className="bg-white text-gray-900 overflow-hidden">

      <section
        className="relative py-28 lg:py-36"
        style={{
          background:
            "linear-gradient(165deg, #021f2e 0%, #042f45 30%, #075E8B 70%, #1a82b5 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,white,transparent_60%)]" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">

          <SectionLabel>Leadership & Vision</SectionLabel>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
            Meet The Founder
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-8 max-w-3xl mx-auto">
            Strategic communicator, entrepreneur, and founder behind Bogues
            Group — building meaningful impact through branding, storytelling,
            PR, and community-driven leadership.
          </p>

        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">

              <Image
                src="/media/2024/03/BoguesDec2021-9.jpg"
                alt="Brittney Bogues"
                width={2048}
                height={1365}
                className="w-full h-auto object-cover"
              />

            </div>

            <div>

              <SectionLabel>Founder / CIO</SectionLabel>

              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                Brittney Bogues
              </h2>

              <p
                className="text-lg font-semibold mb-8"
                style={{ color: THEME_PURPLE }}
              >
                Founder & Chief Innovation Officer
              </p>

              <div className="space-y-6 text-gray-600 leading-8 text-lg">

                <p>
                  Brittney Bogues is a serial entrepreneur with a Master’s
                  Degree in communications and a strong background in event
                  production for public figures, entrepreneurs, corporations,
                  and nonprofit organizations.
                </p>

                <p>
                  Through Bogues Group, Brittney has built a reputation for
                  white-glove client service, strategic communications,
                  relationship-driven marketing, and impactful storytelling
                  designed to elevate brands and organizations.
                </p>

                <p>
                  With more than 13 years of experience across communications,
                  business, and nonprofit leadership, she focuses on delivering
                  customized, creative, and results-driven solutions tailored to
                  each client’s goals.
                </p>

                <p>
                  Outside of work, Brittney is passionate about advocacy for
                  underserved communities and individuals impacted by domestic
                  violence.
                </p>

              </div>

              <div className="mt-10 flex flex-wrap gap-4">

                <Link
                  href="http://www.business-champs.com"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-xl px-7 py-4 text-white font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    background: THEME_PURPLE,
                  }}
                >
                  Visit Podcast
                </Link>

                <Link
                  href="/media/2024/03/BG-4-Year-Flyer-FINAL.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-xl px-7 py-4 font-semibold border transition-all hover:scale-[1.02]"
                  style={{
                    borderColor: THEME_PURPLE,
                    color: THEME_PURPLE,
                  }}
                >
                  Download Profile
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

      <section
        className="py-24"
        style={{ background: THEME_SURFACE }}
      >
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">

              <Image
                src="/media/2024/03/BoguesDec2021-72.jpg"
                alt="Brittney Bogues Event"
                width={2048}
                height={1365}
                className="w-full h-auto object-cover"
              />

            </div>

            <div>

              <SectionLabel>Track Record</SectionLabel>

              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-10">
                Strategic Leadership Backed By Real Results
              </h2>

              <div className="space-y-5">

                {achievements.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm"
                  >

                    <div
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white font-bold"
                      style={{
                        background: THEME_PURPLE,
                      }}
                    >
                      ✓
                    </div>

                    <p className="text-gray-700 leading-7">
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <SectionLabel>Featured Webinar</SectionLabel>

          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8">
            Explore Brittney’s Featured Sessions
          </h2>

          <p className="text-lg text-gray-600 leading-8 max-w-3xl mx-auto mb-14">
            Insights on branding, communications, leadership, entrepreneurship,
            and building meaningful audience engagement through strategic PR and
            storytelling.
          </p>

          <div className="overflow-hidden rounded-[2rem] shadow-2xl aspect-video mb-12">

            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/GD-tqj4v_78"
              title="Featured Webinar"
              allowFullScreen
            />

          </div>

          <Link
            href="/webinars"
            className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-white font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: THEME_PURPLE,
            }}
          >
            View More Webinars
          </Link>

        </div>
      </section>

      <section
        className="py-24"
        style={{
          background:
            "linear-gradient(165deg, #021f2e 0%, #042f45 30%, #075E8B 70%, #1a82b5 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">

          <SectionLabel>Work With Bogues Group</SectionLabel>

          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
            Build Your Brand With Purpose & Strategy
          </h2>

          <p className="text-lg text-gray-300 leading-8 mb-12">
            From strategic communications and public relations to experiential
            marketing and executive visibility, Bogues Group helps brands create
            long-term impact through meaningful storytelling.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-white font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: THEME_PURPLE,
            }}
          >
            Start a Conversation
          </Link>

        </div>
      </section>

    </div>
  );
}