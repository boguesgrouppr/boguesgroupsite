import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase-server";

function getLuluApiBase(): string {
  return process.env.LULU_ENV === "production"
    ? "https://api.lulu.com"
    : "https://api.sandbox.lulu.com";
}

interface LuluConfig {
  apiBase: string;
  authUrl: string;
  internalSecret: string;
  podPackageId: string;
  coverPdfUrl: string;
  interiorPdfUrl: string;
}

function getLuluConfig(): LuluConfig {
  const apiBase = getLuluApiBase();
  return {
    apiBase,
    authUrl: `${apiBase}/auth/realms/glasstree/protocol/openid-connect/token`,
    internalSecret: process.env.INTERNAL_API_SECRET ?? "",
    podPackageId: process.env.LULU_POD_PACKAGE_ID ?? "",
    coverPdfUrl: process.env.LULU_COVER_PDF_URL ?? "",
    interiorPdfUrl: process.env.LULU_INTERIOR_PDF_URL ?? "",
  };
}


interface FulfillRequestBody {
  orderId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  quantity: number;
}

interface LuluTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface LuluLineItem {
  external_id: string;
  title: string;
  cover_source_url: string;
  interior_source_url: string;
  pod_package_id: string;
  quantity: number;
}

interface LuluPrintJobPayload {
  contact_email: string;
  line_items: LuluLineItem[];
  shipping_address: {
    name: string;
    street1: string;
    street2: string;
    city: string;
    state_code: string;
    postcode: string;
    country_code: string;
    phone_number: string;
  };
  shipping_level: string;
  external_id: string;
}

interface LuluPrintJobResponse {
  id: string;
  state: string;
  [key: string]: unknown;
}

async function getLuluAccessToken(authUrl: string): Promise<string> {
  const clientKey = process.env.LULU_CLIENT_KEY;
  const clientSecret = process.env.LULU_CLIENT_SECRET;

  if (!clientKey || !clientSecret) {
    throw new Error("LULU_CLIENT_KEY or LULU_CLIENT_SECRET is not set");
  }

  const credentials = Buffer.from(`${clientKey}:${clientSecret}`).toString(
    "base64"
  );
  const body = new URLSearchParams();
  body.set("grant_type", "client_credentials");

  const res = await fetch(authUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Lulu token request failed (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as LuluTokenResponse;

  if (!data.access_token) {
    throw new Error("Lulu token response missing access_token");
  }

  return data.access_token;
}

async function createLuluPrintJob(
  apiBase: string,
  accessToken: string,
  payload: LuluPrintJobPayload,
): Promise<LuluPrintJobResponse> {
  const res = await fetch(`${apiBase}/print-jobs/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const bodyText = await res.text();

  if (!res.ok) {
    throw new Error(
      `Lulu print job creation failed (${res.status}): ${bodyText}`
    );
  }

  let data: LuluPrintJobResponse;
  try {
    data = JSON.parse(bodyText) as LuluPrintJobResponse;
  } catch {
    throw new Error(
      `Lulu print job creation returned invalid JSON: ${bodyText}`
    );
  }

  if (!data.id) {
    throw new Error(`Lulu print job response missing id: ${bodyText}`);
  }

  return data;
}

export async function POST(request: Request) {
  const config = getLuluConfig();

  if (!config.internalSecret) {
    console.error(
      "[lulu/fulfill] INTERNAL_API_SECRET is not set — endpoint disabled"
    );
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  if (request.headers.get("x-internal-secret") !== config.internalSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: FulfillRequestBody;

  try {
    body = (await request.json()) as FulfillRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (
    !body.orderId ||
    !body.customerName ||
    !body.customerEmail ||
    !body.shippingAddress?.line1 ||
    !body.shippingAddress?.city ||
    !body.shippingAddress?.postal_code ||
    !body.shippingAddress?.country ||
    !body.quantity
  ) {
    return NextResponse.json(
      { error: "Missing required fields (orderId, customerName, shippingAddress, quantity)" },
      { status: 400 }
    );
  }

  if (!config.podPackageId || !config.coverPdfUrl || !config.interiorPdfUrl) {
    console.error(
      "[lulu/fulfill] Missing env vars: LULU_POD_PACKAGE_ID / LULU_COVER_PDF_URL / LULU_INTERIOR_PDF_URL"
    );
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let accessToken: string;
  try {
    accessToken = await getLuluAccessToken(config.authUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[lulu/fulfill] Token fetch failed:", message);
    return NextResponse.json(
      { error: "Failed to authenticate with Lulu" },
      { status: 502 }
    );
  }

  const payload: LuluPrintJobPayload = {
    contact_email: body.customerEmail,
    line_items: [
      {
        external_id: body.orderId,
        title: "The Complete Brand Builder Workbook",
        cover_source_url: config.coverPdfUrl,
        interior_source_url: config.interiorPdfUrl,
        pod_package_id: config.podPackageId,
        quantity: body.quantity,
      },
    ],
    shipping_address: {
      name: body.customerName,
      street1: body.shippingAddress.line1,
      street2: body.shippingAddress.line2 ?? "",
      city: body.shippingAddress.city,
      state_code: body.shippingAddress.state,
      postcode: body.shippingAddress.postal_code,
      country_code: body.shippingAddress.country,
      phone_number: "",
    },
    shipping_level: "GROUND",
    external_id: body.orderId,
  };

  let printJob: LuluPrintJobResponse;
  try {
    printJob = await createLuluPrintJob(config.apiBase, accessToken, payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[lulu/fulfill] Print job creation failed:", message);
    return NextResponse.json(
      { error: "Failed to create Lulu print job" },
      { status: 502 }
    );
  }

  try {
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase
      .from("workbook_orders")
      .update({
        lulu_print_job_id: printJob.id,
        status: "fulfillment_in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.orderId);

    if (error) {
      throw new Error(error.message);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      "[lulu/fulfill] Supabase update failed for order",
      body.orderId,
      ":",
      message
    );
    return NextResponse.json(
      { error: "Print job created but failed to update order", printJobId: printJob.id },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    printJobId: printJob.id,
    state: printJob.state,
  });
}