"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  title: string;
  avatar?: string;
  image?: string;
}

// TODO: replace with real client testimonials (or fetch from Supabase table)
const testimonials: Testimonial[] = [
   {
    quote:
      "Having BG be a part of the event planning and communication made a difference. Working alongside our new executive director, the Bogues Group helped elevate our event and reach our fundraising goals.",
    name: "Muggsy Bogues",
    title: "Muggsy Bogues Family Foundation",
    role: "Founder/President",
    image: "/logos/bogues-foundation.jpg",
  },
  {
    quote:
      "The group was very creative and responsive to our needs. Patient, insightful listeners. The group opened new avenues of exposure and business opportunities.",
    name: "Bob Johnson",
    title: "RP3 Strategies",
    role: "",
    image: "/logos/robert-johnson.jpg",
  },
  {
    quote:
      "I can't thank you enough for all of the work you put into our OFI event, both leading up to the event and yesterday. I am SO happy with the results and the overall turnout. You all stepped in from day one and took on any and every task that needed to be done in order to make the event a success.",
    name: "Mike Blackwelder",
    title: "Smart Start of Mecklenburg County",
    role: "Executive Director",
    image: "/logos/smart-start.png",
  },
  {
    quote:
      "I am used to playing the supportive role as a mom, educator and partner but working with Bogues Group I stepped into my own with promoting my book, creating a live series and securing speaking engagements. I leaned in and followed my purpose and appreciated working with the BG team to accomplish that goal.",
    name: "Sonya Curry",
    title: "Author & Personality, Entrepreneur, Speaker, NBA Mom",
    role: "",
    image: "/logos/sonya-curry.jpg",
  },
];
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

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % testimonials.length);
  }, []);

  const prev = () => {
    setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const t = testimonials[active];

  return (
    <section
      className="relative overflow-hidden bg-[#075E8B] px-6 py-20 md:py-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#075E8B] via-[#075E8B] to-[#064e73]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <SectionEyebrow>What Clients Say</SectionEyebrow>
        <h2 className="font-heading text-2xl font-bold text-white md:text-4xl">
          Trusted by Leaders Across Industries
        </h2>

        <div className="relative mt-14">
          <Quote
            className="mx-auto h-10 w-10 text-[#D4AF38]/60"
            strokeWidth={1.5}
          />

          <div className="mt-6 min-h-[160px] transition-opacity duration-500 md:min-h-[120px]">
            <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-white md:text-xl">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              {t.image ? (
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[#D4AF38]/50"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF38] font-heading text-lg font-bold text-[#075E8B]">
                  {t.name.charAt(0)}
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-white/60">
                  {t.title}
                  {t.role ? ` -- ${t.role}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-[#D4AF38] hover:bg-[#D4AF38] hover:text-[#075E8B]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-6 bg-[#D4AF38]" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-[#D4AF38] hover:bg-[#D4AF38] hover:text-[#075E8B]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}