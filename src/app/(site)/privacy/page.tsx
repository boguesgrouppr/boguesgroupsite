// app/privacy/page.tsx
import type { Metadata } from "next";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "Privacy Policy - Bogues Group",
  description:
    "Read the Bogues Group privacy policy to understand how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy - Bogues Group",
    description: "How Bogues Group collects, uses, and protects your personal information.",
    type: "website",
    siteName: "Bogues Group",
    url: "/privacy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - Bogues Group",
    description: "How Bogues Group collects, uses, and protects your personal information.",
  },
};

interface PrivacySection {
  title: string;
  body: string[];
  items?: string[];
}

const sections: PrivacySection[] = [
  {
    title: "1. Information We Collect",
    body: [
      "We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, mailing address, phone number, and payment information.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: ["We use the information we collect to:"],
    items: [
      "Process and fulfill your orders",
      "Send you order confirmations and updates",
      "Respond to your comments and questions",
      "Improve our website and services",
      "Send you marketing communications (with your consent)",
    ],
  },
  {
    title: "3. Information Sharing",
    body: [
      "We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and conducting our business, as long as those parties agree to keep this information confidential.",
    ],
  },
  {
    title: "4. Data Security",
    body: [
      "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
    ],
  },
  {
    title: "5. Your Rights",
    body: [
      "You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving marketing communications from us.",
    ],
  },
  {
    title: "6. Cookies",
    body: [
      "We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings, though this may affect the functionality of the site.",
    ],
  },
  {
    title: "7. Changes to This Policy",
    body: [
      "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Hero title="Privacy Policy" compact />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="leading-relaxed text-body">
          This privacy policy describes how we collect, use, and protect your personal information when you use
          our website and services.
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
              {section.items && (
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-gray-600">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div>
            <h2 className="font-heading text-xl font-bold text-navy">8. Contact Us</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:info@boguesgroup.com" className="font-medium text-[#075E8B] hover:text-gold hover:underline">
                info@boguesgroup.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}