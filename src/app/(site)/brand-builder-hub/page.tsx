import type { Metadata } from "next";
import Image from "next/image";
import NavLink from "@/components/NavLink";
import Hero from "@/components/Hero";
import NewsletterForm from "@/components/NewsletterForm";
import VimeoEmbed from "@/components/case-studies/VimeoEmbed";
import { toMediaUrl } from "@/lib/media-url";

const COURSE_URL =
  "https://boguesgroup.com/register/bogues-group-workbook-course-bundle/";

const reviews = [
  {
    title: "New Gym and Needed Branding Foundation",
    quote:
      "Got the branding workbook and it's been a lifesaver. It really has helped me and my partner map out our elevator pitch and begin building the branding blocks we need to grow our business.",
    author: "Randy",
  },
  {
    title: "Love It!",
    quote:
      "I like Brittney's solution and my company could benefit from a tool like this.",
    author: "CT Anderson",
  },
  {
    title: "If you have been struggling to establish your brand, this book is for YOU!",
    quote:
      "It helped me look at my brand from a different perspective and gave me new tools and templates to use like PR checklists, calendars and more. I like this workbook because it grows with me and my brand.",
    author: "Natania",
  },
  {
    title: "All your branding needs in one BOOK!",
    quote:
      "It breaks down branding, marketing, and more in a step-by-step guide, checklists and fill-in-the-blank questions. It helped me level up my brand without the hassle of figuring it all out on my own.",
    author: "Imani",
  },
  {
    title: "Just starting out — Brand Builder is for you",
    quote:
      "If you are a new brand starting up this is the book for you—it has all the tools, checklists, templates and more packed into one workbook to help your brand build, grow and THRIVE.",
    author: "Don",
  },
] as const;

export const metadata: Metadata = {
  title: "Brand Builder Hub - Bogues Group",
  description:
    "Resources, courses, and tools to build your brand, spread your story, and connect with customers. The Brand Builder Hub from Bogues Group.",
  openGraph: {
    title: "Brand Builder Hub - Bogues Group",
    description:
      "Build your brand with expert PR strategy, workbooks, courses, and tools from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/brand-builder-hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Builder Hub - Bogues Group",
    description:
      "Build your brand with expert PR strategy, workbooks, courses, and tools from Bogues Group.",
  },
};

function StarRating() {
  return (
    <div className="flex gap-0.5 text-gold" aria-label="Rated 5 out of 5">
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
  );
}

export default function BrandBuilderHubPage() {
  const webinarPoster = toMediaUrl(
    "/media/2025/01/AdobeStock_868771566_Preview-1-1.png"
  );
  const checklistImage = toMediaUrl("/media/2025/08/business-checklist-2.png");
  const seminarVideo = toMediaUrl("/media/2024/08/seminar_clip.mp4");

  return (
    <>
      <Hero
        title="Brand Builder Hub"
        subtitle="Build your brand, spread your story, connect with customers"
      />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-lg leading-relaxed text-body">
          As a business owner, your most valuable resource is your time. The Brand
          Builder Hub brings together courses, workbooks, and expert guidance to
          help you build your brand, spread your story, and connect with your
          customers—without the guesswork.
        </p>

        <div className="mt-12">
          <VimeoEmbed
            videoUrl="https://vimeo.com/1101607424"
            title="Brand Builder Hub introduction"
          />
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <StarRating />
            <p className="text-sm text-gray-500">
              <strong className="text-navy">5.0</strong> · 218 ratings · 3,000+
              students
            </p>
            <p className="text-sm italic text-gray-400">Last updated July 2025</p>
          </div>

          <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
            60 Hour Playbook for Building Your Brand &amp; Personal Marketing Plan
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Digital, video, and hardcopy options available
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
            <h3 className="font-heading text-xl font-bold text-navy">
              The Brand Builder Course
            </h3>
            <p className="mt-4 leading-relaxed text-body">
              <strong>Build a brand that stands out—and scales.</strong>
            </p>
            <p className="mt-3 leading-relaxed text-body">
              Our signature course combines expert PR strategy, proven templates,
              and hands-on guidance to help you craft a bold, memorable brand.
              Whether you&apos;re launching, leveling up, or rebranding, this
              course gives you the done-for-you blueprint to turn ideas into
              impact. Includes videos, workbooks, checklists, and real-world
              tools you can use immediately.
            </p>
            <a
              href={COURSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
            >
              Buy Now
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center font-heading text-2xl font-bold text-navy md:text-3xl">
          Sample Our Webinar
          <span className="mt-2 block text-xl text-navy/80 md:text-2xl">
            Amplify Your Event with Brittney Bogues
          </span>
        </h2>

        <div className="mt-10 overflow-hidden rounded-xl shadow-lg">
          <video
            className="aspect-video w-full bg-black object-cover"
            controls
            preload="metadata"
            poster={webinarPoster}
            playsInline
          >
            <source src={seminarVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <section className="bg-navy px-6 py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row">
          <div className="shrink-0">
            <Image
              src={checklistImage}
              alt="Business planning checklist"
              width={210}
              height={300}
              unoptimized
              className="rounded-lg shadow-xl"
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
              <NewsletterForm source="brand-builder-hub" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold text-navy md:text-3xl">
          Reviews from Brand Builders
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.author}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-navy">{review.title}</p>
              <div className="mt-3">
                <StarRating />
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <p className="mt-4 text-sm font-bold text-gold">{review.author}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
            Grow Your Brand Today
          </h2>
          <p className="mt-4 leading-relaxed text-body">
            Boost your business with expert PR tips and valuable resources. Sign
            up for our newsletter to get insider strategies on branding, media
            outreach, and more.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterForm theme="light" source="brand-builder-hub" />
          </div>
          <p className="mt-8 text-sm text-gray-500">
            Want hands-on support?{" "}
            <NavLink
              href="/contact"
              className="font-semibold text-navy underline transition-colors hover:text-gold"
            >
              Get in touch with our team
            </NavLink>
            .
          </p>
        </div>
      </section>
    </>
  );
}
