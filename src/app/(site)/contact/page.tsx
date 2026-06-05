import ContactForm from "@/components/ContactForm";
import Hero from "@/components/Hero";
import { Suspense } from "react";

export const dynamic = "force-static";

export default function ContactPage() {
  return (
    <div>
      <Hero
        title="Contact Us"
        subtitle="Let's start a conversation about your brand"
      />
      <section className="flex justify-center py-16 px-6">
        <div className="w-full max-w-2xl">
          <div className="mb-10 text-center text-gray-600 space-y-1">
            <p>We'd love to hear from you. Fill out the form below and we'll be in touch.</p>
            <p className="text-sm">
              <a href="tel:+19106340054" className="text-navy hover:underline">
                (910) 634-0054
              </a>
              {" "}&middot;{" "}
              <a href="mailto:info@boguesgroup.com" className="text-navy hover:underline">
                info@boguesgroup.com
              </a>
            </p>
            <p className="text-sm">8022 Providence Rd, STE 500-178, Charlotte, NC 28277</p>
          </div>
          <Suspense fallback={<p className="text-center text-gray-500">Loading form...</p>}>
            <ContactForm />
          </Suspense>

          <section className="mt-14 rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 text-center">
            <h2 className="text-2xl font-bold text-navy">Join the Team</h2>
            <p className="mt-3 text-gray-700">
              Interested in working with Bogues Group? Start your onboarding process here.
            </p>
            <a
              href="https://portal.boguesgroup.com/public/form/view/64bf1d7aa83f93003a8f2578"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-lg bg-navy px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-light"
            >
              New Hire Onboarding Form
            </a>
          </section>
        </div>
      </section>
    </div>
  );
}
