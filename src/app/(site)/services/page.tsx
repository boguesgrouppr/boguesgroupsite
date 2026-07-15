"use client";

import { useDeferredValue, useState, ChangeEvent } from "react";
import Hero from "@/components/Hero";
import NavLink from "@/components/NavLink";

interface Service {
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
}

const services: Service[] = [
  {
    title: "Public Relations",
    slug: "public-relations",
    description:
      "Strategic communications that elevate your reputation, shape your story, and earn trusted media coverage.",
  },
  {
    title: "Marketing",
    slug: "marketing",
    description:
      "Strategic marketing that connects your brand with the audiences who matter most.",
  },
  {
    title: "Crisis Management",
    slug: "crisis-management",
    description:
      "Strategic communications and rapid-response planning to help organizations prepare for, respond to, and recover from crises with confidence.",
  },
  {
    title: "Media Relations",
    slug: "media-relations",
    description:
      "Building credibility through strategic media outreach that builds relationships, earns meaningful coverage, and elevates your brand.",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Data-driven digital strategies that increase visibility, generate leads, and deliver measurable growth.",
  },
  {
    title: "Strategy & Planning",
    slug: "strategy-planning",
    description:
      "Strategic communications plans that align your message with your business goals and target audiences.",
  },
  {
    title: "Branding & Website Design",
    slug: "branding-and-website-design",
    description:
      "Strategic branding, visual identity, and website design that brings your story to life.",
  },
  {
    title: "Experiential Marketing & Events",
    slug: "experiential-marketing-and-events",
    description:
      "Strategic brand experiences and events that inspire engagement, build connections, and leave lasting impressions while impacting your bottomline.",
  },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(normalizedQuery),
  );

  return (
    <>
      <Hero
        title="Our Services"
        subtitle="Full-spectrum communications and marketing solutions"
        compact
      />
      <section className="px-6 py-16" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-12 max-w-2xl mx-auto">
            <label htmlFor="service-search" className="sr-only">
              Search services
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                id="service-search"
                type="search"
                placeholder="Search service titles..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full py-4 pl-12 pr-20 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent shadow-sm"
                aria-describedby="search-hint"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-navy"
                  aria-label="Clear service search"
                >
                  Clear
                </button>
              )}
            </div>
            <p
              id="search-hint"
              className="mt-2 text-sm text-gray-500 text-center"
            >
              {normalizedQuery
                ? `${filteredServices.length} matching service${filteredServices.length === 1 ? "" : "s"}`
                : `${services.length} services available`}
            </p>
          </div>

          {/* Service Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <NavLink
                key={service.title}
                href={`/services/${service.slug}`}
                className="rounded-2xl p-8 border border-gray-200 transition-all duration-300 hover:-translate-y-1 block"
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-[#D4AF38]" />
                <h3 className="text-xl font-bold text-[#075E8B] mb-3 font-heading">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </NavLink>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No services match your search. Try a different keyword.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
