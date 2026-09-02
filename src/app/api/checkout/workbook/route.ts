import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key, {
    apiVersion: '2026-08-26.dahlia',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

const TIER_CONFIG = {
  digital: {
    priceId: process.env.STRIPE_PRICE_DIGITAL!,
    requiresShipping: false,
    allowBulk: false,
  },
  printed: {
    priceId: process.env.STRIPE_PRICE_PRINTED!,
    requiresShipping: true,
    allowBulk: true,
  },
  bundle: {
    priceId: process.env.STRIPE_PRICE_BUNDLE!,
    requiresShipping: true,
    allowBulk: true,
  },
} as const;

type Tier = keyof typeof TIER_CONFIG;

const MAX_BULK_QUANTITY = 500;

interface CheckoutRequestBody {
  tier: Tier;
  email?: string;
  quantity?: number;
}

function isValidQuantity(qty: unknown): qty is number {
  return typeof qty === 'number' && Number.isInteger(qty) && qty >= 1 && qty <= MAX_BULK_QUANTITY;
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripeClient();

    const body: CheckoutRequestBody = await req.json();
    const { tier, email, quantity } = body;

    if (!tier || !(tier in TIER_CONFIG)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const config = TIER_CONFIG[tier];

    if (!config.priceId) {
      console.error(`[checkout/workbook] Missing Stripe Price ID env var for tier: ${tier}`);
      return NextResponse.json({ error: 'Checkout not configured' }, { status: 500 });
    }

    const requestedQty = quantity ?? 1;

    if (!isValidQuantity(requestedQty)) {
      return NextResponse.json(
        { error: `Quantity must be an integer between 1 and ${MAX_BULK_QUANTITY}` },
        { status: 400 }
      );
    }

    if (requestedQty > 1 && !config.allowBulk) {
      return NextResponse.json(
        { error: `Bulk quantity is not available for the "${tier}" tier` },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') ?? 'https://boguesgroup.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      phone_number_collection: { enabled: tier === "printed" || tier === "bundle" },
      shipping_address_collection: config.requiresShipping
        ? { allowed_countries: ['US'] }
        : undefined,
      line_items: [
        {
          price: config.priceId,
          quantity: requestedQty,
        },
      ],
      metadata: { tier, quantity: String(requestedQty) },
      success_url: `${origin}/brand-builder-hub/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/brand-builder-hub?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout/workbook] error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}