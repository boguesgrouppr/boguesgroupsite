/**
 * One-time / idempotent seed script — creates Stripe Products + Prices
 * for the Brand Builder Workbook checkout tiers.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_xxx npx tsx scripts/seed-stripe-products.ts
 *
 * Safe to re-run: checks for existing products by lookup_key before creating,
 * so it will never duplicate products/prices on repeat runs.
 *
 * Swap the key for sk_live_xxx once Britney confirms the correct Stripe
 * account — no code changes needed, just the env var.
 */

import Stripe from 'stripe';
import { config } from 'dotenv';
import path from 'path';

// Load STRIPE_SECRET_KEY from .env.local, same file your Next.js app already uses
config({ path: path.resolve(process.cwd(), '.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia',
  httpClient: Stripe.createFetchHttpClient()
});

interface TierDefinition {
  tier: 'digital' | 'printed' | 'bundle';
  name: string;
  description: string;
  priceCents: number;
  lookupKey: string;
}

interface SeedResult {
  tier: string;
  priceId: string;
  status: 'created' | 'exists';
}

const TIERS: TierDefinition[] = [
  {
    tier: 'digital',
    name: 'Brand Builder Workbook — Digital',
    description: 'Instant digital download of The Complete Brand Builder Workbook (PDF).',
    priceCents: 9900,
    lookupKey: 'workbook_digital',
  },
  {
    tier: 'printed',
    name: 'Brand Builder Workbook — Printed',
    description: 'Printed copy of The Complete Brand Builder Workbook, shipped to you.',
    priceCents: 14900,
    lookupKey: 'workbook_printed',
  },
  {
    tier: 'bundle',
    name: 'Brand Builder Workbook — Bundle',
    description: 'Digital download + printed copy of The Complete Brand Builder Workbook.',
    priceCents: 24900,
    lookupKey: 'workbook_bundle',
  },
];

async function findExistingPrice(lookupKey: string): Promise<Stripe.Price | null> {
  const result = await stripe.prices.list({
    lookup_keys: [lookupKey],
    limit: 1,
    active: true,
  });
  return result.data[0] ?? null;
}

async function seedTier(def: TierDefinition): Promise<SeedResult> {
  const existing = await findExistingPrice(def.lookupKey);

  if (existing) {
    return { tier: def.tier, priceId: existing.id, status: 'exists' };
  }

  const product = await stripe.products.create({
    name: def.name,
    description: def.description,
    metadata: { tier: def.tier },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: def.priceCents,
    currency: 'usd',
    lookup_key: def.lookupKey,
    metadata: { tier: def.tier },
  });

  return { tier: def.tier, priceId: price.id, status: 'created' };
}

async function main(): Promise<void> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY env var is required.');
    process.exit(1);
  }

  const account = await stripe.accounts.retrieve(null);
  console.log(`Seeding into Stripe account: ${account.id} (${account.email ?? 'no email on file'})`);
  console.log(`Mode: ${process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'LIVE' : 'TEST'}\n`);

  const results: SeedResult[] = [];
  for (const def of TIERS) {
    const result = await seedTier(def);
    results.push(result);
    console.log(`[${result.status.toUpperCase()}] ${result.tier} → ${result.priceId}`);
  }

  console.log('\nDone. Copy these Price IDs into your checkout route env config:\n');
  for (const r of results) {
    console.log(`STRIPE_PRICE_${r.tier.toUpperCase()}=${r.priceId}`);
  }
}

main().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});