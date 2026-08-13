import { Metadata } from "next";
import Image from "next/image";
import Stripe from "stripe";
import NavLink from "@/components/NavLink";
import WorkbookDownloadButton from "@/components/WorkbookDownloadButton";

export const metadata: Metadata = {
  title: "Order Confirmed - Bogues Group",
  description:
    "Thank you! Your Brand Builder Workbook order is confirmed. Bogues Group.",
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

type OrderState =
  | "unverified"
  | "paid-digital"
  | "paid-print"
  | "error";

interface BrandBuilderSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function resolveOrderState(
  sessionId: string | null,
): Promise<OrderState> {
  if (!sessionId) {
    return "unverified";
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return "error";
    }

    const tier = session.metadata?.tier;
    if (tier === "digital") {
      return "paid-digital";
    }
    if (tier === "printed" || tier === "bundle") {
      return "paid-print";
    }

    return "unverified";
  } catch {
    return "error";
  }
}

export default async function BrandBuilderSuccessPage({
  searchParams,
}: BrandBuilderSuccessPageProps) {
  const checklistImage = "/logos/Brand_Builder_cover_page.png";
  const resolvedParams = await searchParams;
  const sessionId =
    typeof resolvedParams.session_id === "string"
      ? resolvedParams.session_id
      : null;

  const orderState = await resolveOrderState(sessionId);

  return (
    <div className="bg-gray-50 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
            <svg
              className="h-8 w-8 text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mt-6 font-heading text-2xl font-bold text-navy md:text-3xl">
            {orderState === "error"
              ? "We couldn&apos;t verify your order"
              : "Thank you for your purchase!"}
          </h1>

          <div className="mt-8 inline-block overflow-hidden rounded-xl bg-navy p-3 shadow-lg">
            <div className="relative aspect-[768/501] w-64 overflow-hidden rounded-lg">
              <Image
                src={checklistImage}
                alt="Brand Builder planning checklist"
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          </div>

          {orderState === "error" && (
            <p className="mt-4 leading-relaxed text-body">
              We couldn&apos;t verify this order. If you believe this is a
              mistake, please contact our support team.
            </p>
          )}

          {orderState === "paid-digital" && (
            <>
              <p className="mt-4 leading-relaxed text-body">
                Your payment is confirmed. Download your workbook below using
                the button &mdash; it will open in a new tab.
              </p>
              {sessionId && (
                <div className="mt-8">
                  <WorkbookDownloadButton sessionId={sessionId} />
                </div>
              )}
            </>
          )}

          {orderState === "paid-print" && (
            <p className="mt-4 leading-relaxed text-body">
              Your printed workbook is being prepared for shipment. You&apos;ll
              receive a confirmation email once it&apos;s on its way.
            </p>
          )}

          {(orderState === "unverified" ||
            orderState === "paid-print") && (
            <p className="mt-4 leading-relaxed text-body">
              A receipt has been sent to your email. Digital orders will be
              available to download shortly, and printed orders will ship to
              your billing address.
            </p>
          )}

          {(orderState === "unverified" || orderState === "error") && (
            <div className="mt-8">
              <NavLink
                href="/brand-builder-hub"
                className="inline-flex items-center justify-center rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
              >
                Back to Brand Builder Hub
              </NavLink>
            </div>
          )}

          {(orderState === "paid-digital" ||
            orderState === "paid-print") && (
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <NavLink
                href="/brand-builder-hub"
                className="inline-flex items-center justify-center rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl"
              >
                Back to Brand Builder Hub
              </NavLink>
              <NavLink
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-navy px-8 py-4 text-base font-semibold text-navy transition-colors duration-300 hover:bg-navy hover:text-white"
              >
                Contact Support
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}