import NavLink from "@/components/NavLink";
import Hero from "@/components/Hero";

export const metadata = {
  title: "Services - Bogues Group",
  description:
    "Explore PR, marketing, crisis management, media relations, and branding services from Bogues Group, North Carolina's premier firm.",
  openGraph: {
    title: "Services - Bogues Group",
    description:
      "Explore PR, marketing, crisis management, media relations, and branding services from Bogues Group.",
    type: "website",
    siteName: "Bogues Group",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services - Bogues Group",
    description:
      "Explore PR, marketing, crisis management, media relations, and branding services from Bogues Group.",
  },
};

const services = [
  {
    title: "Public Relations",
    slug: "public-relations",
    description:
      "Strategic communications that build credibility, shape narratives, and earn media coverage.",
  },
  {
    title: "Marketing",
    slug: "marketing",
    description:
      "Integrated campaigns that connect your brand with the right audiences at the right time.",
  },
  {
    title: "Crisis Management",
    slug: "crisis-management",
    description:
      "Rapid-response planning and execution to protect your reputation when it matters most.",
  },
  {
    title: "Media Relations",
    slug: "media-relations",
    description:
      "Press outreach, media training, and relationship building with top-tier journalists.",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "SEO, social media, content strategy, and paid campaigns that drive measurable results.",
  },
  {
    title: "Strategy & Planning",
    slug: "strategy-planning",
    description:
      "Research-backed communications strategies aligned with your business objectives.",
  },
  {
    title: "Branding & Website Design",
    slug: "branding-and-website-design",
    description:
      "Visual identity, messaging frameworks, and web experiences that set you apart.",
  },
  {
    title: "Experiential Marketing & Events",
    slug: "experiential-marketing-and-events",
    description:
      "Memorable activations and events that create lasting impressions and deepen engagement.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Hero
        title="Our Services"
        subtitle="Full-spectrum communications and marketing solutions"
        compact
      />
      <section className="px-6 py-24" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <NavLink
              key={service.title}
              href={`/services/${service.slug}`}
              className="rounded-2xl p-8 border border-gray-200 transition-all duration-300 hover:-translate-y-1 block"
              style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
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
        </div>
      </section>
    </>
  );
}
