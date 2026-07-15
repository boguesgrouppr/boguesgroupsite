import { NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { subscribeWithTags } from "@/lib/mailchimp";
import { getRuntimeEnv } from "@/lib/runtime-env";

export const dynamic = "force-dynamic";

interface RequestBody {
  email?: string;
}

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? "");

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const tagName =
    (await getRuntimeEnv("MAILCHIMP_HOMEPAGE_NEWSLETTER_TAG_NAME")) ?? "homepage-newsletter";

  const mailchimpResult = await subscribeWithTags(email, [tagName]);

  if (!mailchimpResult.ok) {
    return NextResponse.json(
      { error: mailchimpResult.message },
      { status: mailchimpResult.status }
    );
  }

  return NextResponse.json({ success: true });
}
