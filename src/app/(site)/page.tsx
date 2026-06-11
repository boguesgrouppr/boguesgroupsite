import { Metadata } from "next";
import NavLink from "@/components/NavLink";
import Hero from "@/components/Hero";
import Card from "@/components/Card";
import CaseStudyCard from "@/components/case-studies/CaseStudyCard";
import HomeBlogPosts from "@/components/HomeBlogPosts";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { getAllCaseStudies } from "@/lib/case-studies";
import { createServerActionClient } from "@/lib/supabase/server";
import { toMediaUrl } from "@/lib/media-url";
import { formatDate } from "@/lib/content-urls";

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

export default async function Home() {
  const caseStudies = (await getAllCaseStudies()).slice(0, 3);

  const supabase = await createServerActionClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, featured_image, date")
    .eq("status", "publish")
    .order("date", { ascending: false })
    .limit(3);

  const blogPosts = (posts ?? []).map((p) => ({
    ...p,
    featured_image: p.featured_image ? toMediaUrl(p.featured_image) : null,
    date: formatDate(p.date),
  }));

  return (
    <>
      <Hero
        title="North Carolina's Premier PR Firm"
        subtitle="Strategic public relations, marketing, and branding that elevate your brand, amplify your voice, and deliver results. The Bogues Group partners with organizations and leaders to tell stories that move people."
        ctaText="Get in Touch"
        ctaHref="/contact"
      />

      {/* We Hear Our Clients */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-5xl text-center mb-12">
          <div className="inline-flex items-center gap-4 rounded-full bg-[#075E8B] px-8 py-3 sm:px-12 sm:py-5 md:px-16 md:py-6">
            <span className="text-white font-heading text-xl font-bold sm:text-2xl md:text-4xl lg:text-5xl">We</span>
            <img
              src="/logos/hear-icon.png"
              alt="heart"
              className="h-8 w-auto object-contain sm:h-10 md:h-14 lg:h-16"
            />
            <span className="text-white font-heading text-xl font-bold sm:text-2xl md:text-4xl lg:text-5xl">Our Clients!</span>
          </div>
        </div>
        <LogoCarousel />
      </section>

      {/* Client Testimonials */}
      <TestimonialCarousel />

      {/* Services Overview */}
      <section className="py-28 px-6 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[#D4AF38]" />
            <h2 className="font-heading text-2xl font-bold text-[#075E8B] sm:text-3xl md:text-4xl lg:text-5xl">
              What We Do
            </h2>
            <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto">
              Full-service public relations and marketing solutions tailored to
              your goals.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <NavLink
                key={service.title}
                href="/services"
                className="group block rounded-2xl p-8 border border-gray-200 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-[#D4AF38] transition-all duration-300 group-hover:w-16" />
                <h3 className="text-xl font-bold text-[#075E8B] mb-3 font-heading transition-all duration-300 group-hover:scale-[1.02] group-hover:drop-shadow-[0_0_6px_rgba(212,175,56,0.5)]">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-28 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="mb-4 h-1 w-12 rounded-full bg-[#D4AF38]" />
              <h2 className="font-heading text-2xl font-bold text-[#075E8B] sm:text-3xl md:text-4xl lg:text-5xl">
                Case Studies
              </h2>
              <p className="mt-5 text-lg text-gray-500">
                See how we deliver results for our clients.
              </p>
            </div>
            <NavLink
              href="/case-studies"
              className="hidden sm:inline-block text-[#075E8B] font-semibold hover:text-[#D4AF38] transition-colors duration-200"
            >
              View All &rarr;
            </NavLink>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <NavLink
              href="/case-studies"
              className="text-[#075E8B] font-semibold hover:text-[#D4AF38] transition-colors duration-200"
            >
              View All Case Studies &rarr;
            </NavLink>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-28 px-6 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="mb-4 h-1 w-12 rounded-full bg-[#D4AF38]" />
              <h2 className="font-heading text-2xl font-bold text-[#075E8B] sm:text-3xl md:text-4xl lg:text-5xl">
                Latest from the Blog
              </h2>
              <p className="mt-5 text-lg text-gray-500">
                News, insights, and updates from The Bogues Group.
              </p>
            </div>
            <NavLink
              href="/blog"
              className="hidden sm:inline-block text-[#075E8B] font-semibold hover:text-[#D4AF38] transition-colors duration-200"
            >
              View All &rarr;
            </NavLink>
          </div>
          <HomeBlogPosts posts={blogPosts} />
          <div className="mt-10 text-center sm:hidden">
            <NavLink
              href="/blog"
              className="text-[#075E8B] font-semibold hover:text-[#D4AF38] transition-colors duration-200"
            >
              View All Posts &rarr;
            </NavLink>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-5 sm:py-28 md:py-32 sm:px-6"
        style={{
          background:
            "linear-gradient(165deg, #021f2e 0%, #042f45 30%, #075E8B 70%, #1a82b5 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-[#D4AF38] sm:mb-8" />
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl md:text-5xl lg:text-6xl leading-[1.1]">
            Ready to Elevate Your Brand?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:mt-8 sm:text-lg">
            Let us craft a strategy that amplifies your story and drives real
            impact.
          </p>
          <div className="mt-8 sm:mt-12">
            <NavLink
              href="/contact"
              className="inline-block rounded-lg bg-[#D4AF38] px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:bg-[#e5c256] hover:shadow-xl hover:scale-[1.03] sm:px-10 sm:py-5 sm:text-lg whitespace-nowrap"
            >
              Start a Conversation
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}
