import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServiceClient } from "@/lib/supabase-server";

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key, {
    apiVersion: "2026-07-29.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

type Tier = "digital" | "printed" | "bundle";

const VALID_TIERS: ReadonlySet<string> = new Set([
  "digital",
  "printed",
  "bundle",
]);

interface ShippingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const okResponse = () => NextResponse.json({ received: true });

function toShippingAddress(
  address: Stripe.Address | null | undefined
): ShippingAddress | null {
  if (!address) {
    return null;
  }
  return {
    line1: address.line1 ?? "",
    line2: address.line2 ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    postal_code: address.postal_code ?? "",
    country: address.country ?? "",
  };
}

function hasCompleteShipping(
  address: ShippingAddress | null
): address is ShippingAddress {
  return !!(
    address &&
    address.line1 &&
    address.city &&
    address.postal_code &&
    address.country
  );
}

function extractTier(metadata: Stripe.Metadata | null | undefined): Tier | null {
  const raw = metadata?.tier;
  if (!raw || !VALID_TIERS.has(raw)) {
    return null;
  }
  return raw as Tier;
}

function extractQuantity(metadata: Stripe.Metadata | null | undefined): number {
  const parsed = Number(metadata?.quantity);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
}

async function recordOrder(
  session: Stripe.Checkout.Session,
  tier: Tier,
  quantity: number,
  shippingAddress: ShippingAddress | null
): Promise<{ ok: boolean; orderId?: string }> {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

      const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from("workbook_orders")
    .upsert(
      {
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        customer_email: session.customer_email ?? session.customer_details?.email ?? null,
        customer_name: session.customer_details?.name ?? null,
        tier,
        amount_cents: session.amount_total ?? null,
        status: "paid",
        quantity,
        shipping_address: shippingAddress,
      },
      { onConflict: "stripe_session_id" }
    )
    .select("id")
    .single();

  if (error) {
    console.error(
      "[webhooks/stripe] Failed to upsert workbook_orders for session",
      session.id,
      ":",
      error.message
    );
    return { ok: false };
  }

  return { ok: true, orderId: data?.id };
}

async function triggerFulfillment(
  orderId: string,
  customerName: string | null | undefined,
  shippingAddress: ShippingAddress,
  quantity: number
): Promise<void> {
  const internalSecret = process.env.INTERNAL_API_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!internalSecret) {
    console.error(
      "[webhooks/stripe] INTERNAL_API_SECRET is not set — skipping Lulu fulfillment for order",
      orderId
    );
    return;
  }

  if (!siteUrl) {
    console.error(
      "[webhooks/stripe] NEXT_PUBLIC_SITE_URL is not set — skipping Lulu fulfillment for order",
      orderId
    );
    return;
  }

  try {
    const res = await fetch(`${siteUrl}/api/lulu/fulfill`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": internalSecret,
      },
      body: JSON.stringify({
        orderId,
        customerName: customerName ?? "",
        shippingAddress,
        quantity,
      }),
    });

    if (!res.ok) {
      const bodyText = await res.text();
      console.error(
        "[webhooks/stripe] Lulu fulfillment failed for order",
        orderId,
        "status=",
        res.status,
        "body=",
        bodyText
      );
    } else {
      console.log(
        "[webhooks/stripe] Lulu fulfillment submitted for order",
        orderId
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      "[webhooks/stripe] Lulu fulfillment request threw for order",
      orderId,
      ":",
      message
    );
  }
}

export async function POST(req: NextRequest) {
  const payload = await req.text();

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("[webhooks/stripe] Missing stripe-signature header");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhooks/stripe] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[webhooks/stripe] Signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    console.log("[webhooks/stripe] Unhandled event type:", event.type);
    return okResponse();
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const tier = extractTier(session.metadata);
  if (!tier) {
    console.error(
      "[webhooks/stripe] Missing or invalid tier metadata for session",
      session.id
    );
    return okResponse();
  }

  const quantity = extractQuantity(session.metadata);

  let sessionFull: Stripe.Checkout.Session;
  try {
    const stripe = getStripeClient();
    sessionFull = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      "[webhooks/stripe] Failed to expand session",
      session.id,
      ":",
      message
    );
    sessionFull = session;
  }

  const shippingAddress = toShippingAddress(
    sessionFull.collected_information?.shipping_details?.address ??
      sessionFull.customer_details?.address
  );

  const recorded = await recordOrder(
    sessionFull,
    tier,
    quantity,
    shippingAddress
  );

  if (!recorded.ok || !recorded.orderId) {
    console.error(
      "[webhooks/stripe] Order not recorded — returning 500 so Stripe retries. Session:",
      session.id
    );
    return NextResponse.json({ error: "Failed to record order" }, { status: 500 });
  }

  if (tier === "printed" || tier === "bundle") {
    if (!hasCompleteShipping(shippingAddress)) {
      console.error(
        "[webhooks/stripe] Order recorded but shipping address is incomplete — skipping Lulu fulfillment. Order:",
        recorded.orderId
      );
      return okResponse();
    }

    try {
      await triggerFulfillment(
        recorded.orderId,
        sessionFull.customer_details?.name,
        shippingAddress,
        quantity
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        "[webhooks/stripe] Lulu fulfillment threw for order",
        recorded.orderId,
        ":",
        message
      );
    }
  } else {
    console.log(
      "[webhooks/stripe] Digital order — no Lulu fulfillment needed. Order:",
      recorded.orderId
    );
  }

  return okResponse();
}