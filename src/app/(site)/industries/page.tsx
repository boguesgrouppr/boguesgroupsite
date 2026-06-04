import Hero from "@/components/Hero";
import Link from "next/link";

export const metadata = {
  title: "Industries We Serve - Bogues Group",
  description:
    "Bogues Group serves clients across sports, hospitality, wellness, nonprofits, and more with tailored PR and marketing strategies.",
  openGraph: {
    title: "Industries We Serve - Bogues Group",
    description:
      "Bogues Group serves clients across sports, hospitality, wellness, nonprofits, and more with tailored PR strategies.",
    type: "website",
    siteName: "Bogues Group",
    url: "/industries",
  },
  twitter: {
    card: "summary_large_image",
    title: "Industries We Serve - Bogues Group",
    description:
      "Bogues Group serves clients across sports, hospitality, wellness, nonprofits, and more with tailored PR strategies.",
  },
};

const industries = [
  {
    title: "Sports & Entertainment",
    description:
      "From athlete branding to franchise communications, we understand the pace and stakes of sports and entertainment PR.",
    icon: "🏆",
    href: "/industries/sports-and-entertainment",
  },
  {
    title: "Hospitality",
    description:
      "Hotels, restaurants, and travel brands trust us to craft compelling stories that drive bookings and loyalty.",
    icon: "🏨",
    href: "/industries/hospitality",
  },
  {
    title: "Wellness & Recovery",
    description:
      "Thoughtful messaging for health, wellness, and recovery brands that need sensitivity and authority.",
    icon: "🌿",
    href: "/industries/wellness-and-recovery",
  },
  {
    title: "NGOs / Nonprofits",
    description:
      "Mission-driven communications that amplify impact, attract donors, and engage communities.",
    icon: "🤝",
    href: "/industries/ngos-nonprofits",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <Hero
        title="Industries We Serve"
        subtitle="Deep expertise across the sectors that matter most"
      />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((industry) => (
            <Link
              key={industry.title}
              href={industry.href}
              className="group block rounded-xl border-t-4 border-gold bg-white p-8 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="text-5xl mb-5">{industry.icon}</div>
              <h3 className="text-xl font-bold text-navy mb-3">{industry.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {industry.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
