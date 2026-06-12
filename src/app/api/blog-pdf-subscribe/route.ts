import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { getBlogDownloadTagName, subscribePdfDownload } from "@/lib/mailchimp";

interface RequestBody {
  email?: string;
  slug?: string;
}

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

  const { data, error } = await supabase
    .from("blog_posts")
    .select("pdf_url, title")
    .eq("slug", slug)
    .eq("status", "publish")
    .single();

  if (error || !data?.pdf_url) {
    return NextResponse.json(
      { error: "PDF not found for this blog post" },
      { status: 404 }
    );
  }

  const title = data.title?.trim() || slug;

  const mailchimpResult = await subscribePdfDownload(
    email,
    getBlogDownloadTagName(),
    {
      contentType: "blog",
      slug,
      title,
    }
  );

  if (!mailchimpResult.ok) {
    return NextResponse.json(
      { error: mailchimpResult.message },
      { status: mailchimpResult.status }
    );
  }

  return NextResponse.json({
    pdf_url: data.pdf_url,
    slug,
    title,
    content_type: "blog",
  });
}
