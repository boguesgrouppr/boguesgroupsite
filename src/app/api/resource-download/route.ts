import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { subscribeWithTags } from "@/lib/mailchimp";

interface RequestBody {
  email?: string;
  slug?: string;
}

const resourceMap: Record<string, { title: string; fileUrl: string }> = {
  "workbook-sample": {
    title: "Brand Builder Workbook Sample",
    fileUrl: "/pdfs/brand-builder-workbook-sample.pdf",
  },
  "discovery-worksheet": {
    title: "Brand Discovery Worksheet",
    fileUrl: "/pdfs/brand-discovery-worksheet.pdf",
  },
  "audit-checklist": {
    title: "Brand Audit Checklist",
    fileUrl: "/pdfs/brand-audit-checklist.pdf",
  },
  "marketing-template": {
    title: "Marketing Planning Template",
    fileUrl: "/pdfs/marketing-planning-template.pdf",
  },
};

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? "");
  const slug = body.slug?.trim() ?? "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const resource = resourceMap[slug];
  if (!resource) {
    return NextResponse.json(
      { error: "Resource not found" },
      { status: 404 }
    );
  }

  // Subscribe to Mailchimp with tags
  const mailchimpResult = await subscribeWithTags(
    email,
    ["resource-download"],
    {
      contentType: "free_resource",
      slug,
      title: resource.title,
    }
  );

  if (!mailchimpResult.ok) {
    return NextResponse.json(
      { error: mailchimpResult.message },
      { status: mailchimpResult.status }
    );
  }

  // Also log to Supabase for tracking
  await supabase.from("resource_downloads").insert({
    email,
    slug,
    title: resource.title,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({
    pdf_url: resource.fileUrl,
    slug,
    title: resource.title,
    content_type: "free_resource",
  });
}