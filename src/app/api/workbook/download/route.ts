import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key, {
    apiVersion: "2026-07-29.dahlia",
  });
}

const WORKBOOK_DOWNLOAD_URL = process.env.WORKBOOK_STORAGE_PATH;

interface RequestBody {
  session_id?: string;
}

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    console.error("[workbook/download] Invalid request body");
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const sessionId = body.session_id?.trim();

  if (!sessionId) {
    console.error("[workbook/download] Missing session_id in body");
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  if (!WORKBOOK_DOWNLOAD_URL) {
    console.error("[workbook/download] Missing WORKBOOK_DOWNLOAD_URL env var");
    return NextResponse.json(
      { error: "Download not configured" },
      { status: 500 }
    );
  }

  let tier: string | undefined;
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    tier = session.metadata?.tier;

    if (session.payment_status !== "paid" || tier !== "digital") {
      console.error(
        "[workbook/download] Verification failed: payment_status=",
        session.payment_status,
        "| tier=",
        tier
      );
      return NextResponse.json(
        { error: "Payment not verified" },
        { status: 403 }
      );
    }
  } catch (err) {
    console.error("[workbook/download] Stripe session lookup failed:", err);
    return NextResponse.json(
      { error: "Payment not verified" },
      { status: 403 }
    );
  }

  return NextResponse.json({ url: WORKBOOK_DOWNLOAD_URL });
}