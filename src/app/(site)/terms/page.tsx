// app/terms/page.tsx
import type { Metadata } from "next";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "Terms of Use | Bogues Group",
  description: "Terms of Use for The Bogues Group website.",
  robots: { index: true, follow: true },
};

interface TermsSection {
  title: string;
  body: string[];
  lists?: {
    label?: string;
    items: string[];
  }[];
}

const sections: TermsSection[] = [
  {
    title: "1. Use of the Site",
    body: [
      "The Site is provided for informational, marketing, and business purposes only. Nothing on this Site constitutes legal or medical advice.",
      "You agree to use the Site only for lawful purposes and in accordance with these Terms.",
    ],
  },
  {
    title: "2. Services Disclaimer",
    body: [
      "Descriptions of services, case studies, and campaign work (including public health initiatives such as Narcan distribution) are provided for illustrative purposes only and do not guarantee similar outcomes.",
    ],
  },
  {
    title: "3. No Medical Advice",
    body: [
      "Any content related to Narcan (naloxone), overdose prevention, or public health initiatives is provided for general informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.",
    ],
  },
  {
    title: "4. Intellectual Property",
    body: [
      "All content on this Site—including text, graphics, branding, case studies, and design—is owned by or licensed to The Bogues Group and is protected by applicable intellectual property laws.",
    ],
    lists: [
      { label: "You may:", items: ["Access and use content for personal or internal business review"] },
      {
        label: "You may not:",
        items: [
          "Reproduce, distribute, modify, or create derivative works",
          "Use branding, logos, or materials without prior written consent",
        ],
      },
    ],
  },
  {
    title: "5. Prohibited Use",
    body: ["You agree not to:"],
    lists: [
      {
        items: [
          "Use the Site for unlawful or fraudulent purposes",
          "Attempt to gain unauthorized access to the Site or its systems",
          "Interfere with the Site's functionality or security",
          "Use automated means (e.g., bots, scraping) without permission",
        ],
      },
    ],
  },
  {
    title: "6. Third-Party Links",
    body: ["This Site may contain links to third-party websites. We are not responsible for their content, policies, or practices."],
  },
  {
    title: "7. Disclaimer of Warranties",
    body: [
      'The Site is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the Site\'s accuracy, reliability, or availability.',
    ],
  },
  {
    title: "8. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, The Bogues Group shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Site.",
    ],
  },
  {
    title: "9. Indemnification",
    body: ["You agree to indemnify and hold harmless The Bogues Group from any claims arising out of your use of the Site or violation of these Terms."],
  },
  {
    title: "10. Modifications",
    body: ["We reserve the right to update or modify these Terms at any time. Continued use of the Site constitutes acceptance of any changes."],
  },
  {
    title: "11. Governing Law",
    body: ["These Terms are governed by the laws of North Carolina."],
  },
];
export default function TermsPage() {
  return (
    <>
      <Hero title="Terms of Use" subtitle="Effective Date: June 20, 2026" />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="leading-relaxed text-body">
            This website (the &ldquo;Site&rdquo;) is operated by The Bogues Group (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
            or &ldquo;our&rdquo;). By accessing or using this Site, you agree to be bound by these Terms of Use
            (&ldquo;Terms&rdquo;). If you do not agree, you must not use the Site.
          </p>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-heading text-xl font-bold text-navy">{section.title}</h2>
                {section.body.map((paragraph, i) => (
                  <p key={i} className="mt-3 leading-relaxed text-gray-600">
                    {paragraph}
                  </p>
                ))}
                {section.lists?.map((list, i) => (
                  <div key={i} className="mt-3">
                    {list.label && <p className="font-medium text-navy">{list.label}</p>}
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-gray-600">
                      {list.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}

            <div>
              <h2 className="font-heading text-xl font-bold text-navy">12. Contact</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                For questions regarding these Terms, please contact:{" "}
                <a href="mailto:info@boguesgroup.com" className="font-medium text-[#075E8B] hover:text-gold hover:underline">
                  info@boguesgroup.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}