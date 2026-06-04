"use client";

import { useState, useEffect, useCallback } from "react";

const testimonials = [
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

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 12000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[active];

  return (
    <section
      className="py-24 px-6"
      style={{
        background: "linear-gradient(165deg, #042f45 0%, #075E8B 50%, #1a82b5 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-10">
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[#D4AF38]" />
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            Client Successes & Wins
          </h2>
        </div>

        {/* Quote -- fixed height to prevent layout shift */}
        <div className="relative h-[320px] sm:h-[280px] md:h-[260px] flex items-center justify-center">
          <div key={active} className="testimonial-fade">
            {/* Quote mark */}
            <div className="text-[#D4AF38] text-6xl font-serif leading-none mb-4">&ldquo;</div>

            <blockquote className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto italic">
              {t.quote}
            </blockquote>

            {/* Author */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <img
                src={t.image}
                alt={t.name}
                className="h-14 w-14 rounded-full object-cover border-2 border-[#D4AF38]"
              />
              <div className="text-left">
                <div className="text-white font-bold text-base">{t.name}</div>
                <div className="text-white/60 text-sm">
                  {t.title}
                  {t.role ? ` -- ${t.role}` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-[#D4AF38] hover:text-[#D4AF38]"
            aria-label="Previous testimonial"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-[#D4AF38]" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-[#D4AF38] hover:text-[#D4AF38]"
            aria-label="Next testimonial"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .testimonial-fade {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
