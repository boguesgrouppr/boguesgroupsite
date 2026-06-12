import { createHash } from "crypto";
import { normalizeEmail } from "@/lib/email";
import { getRuntimeEnv } from "@/lib/runtime-env";

export { isValidEmail } from "@/lib/email";

export interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
  listId: string;
}

const REQUIRED_MAILCHIMP_VARS = [
  "MAILCHIMP_API_KEY",
  "MAILCHIMP_SERVER_PREFIX",
  "MAILCHIMP_LIST_ID",
] as const;

async function getMissingMailchimpEnvVars(): Promise<string[]> {
  const missing: string[] = [];

  for (const name of REQUIRED_MAILCHIMP_VARS) {
    if (!(await getRuntimeEnv(name))) {
      missing.push(name);
    }
  }

  return missing;
}

export async function getMailchimpConfig(): Promise<MailchimpConfig | null> {
  const apiKey = await getRuntimeEnv("MAILCHIMP_API_KEY");
  const serverPrefix = await getRuntimeEnv("MAILCHIMP_SERVER_PREFIX");
  const listId = await getRuntimeEnv("MAILCHIMP_LIST_ID");

  if (!apiKey || !serverPrefix || !listId) {
    return null;
  }

  return { apiKey, serverPrefix, listId };
}

export async function getMailchimpConfigError(): Promise<string> {
  const missing = await getMissingMailchimpEnvVars();
  if (missing.length === 0) {
    return "Mailchimp is not configured";
  }
  return `Mailchimp is not configured. In Cloudflare → Workers & Pages → boguesgroupsite → Settings → Variables and Secrets, add: ${missing.join(", ")}. Set MAILCHIMP_API_KEY as a Secret. Then redeploy.`;
}

export async function getCaseStudyDownloadTagName(): Promise<string> {
  return (await getRuntimeEnv("MAILCHIMP_CASE_STUDY_DOWNLOAD_TAG_NAME")) ?? "case-study-download";
}

export async function getBlogDownloadTagName(): Promise<string> {
  return (await getRuntimeEnv("MAILCHIMP_BLOG_DOWNLOAD_TAG_NAME")) ?? "blog-download";
}

export function md5EmailHash(email: string): string {
  return createHash("md5").update(normalizeEmail(email)).digest("hex");
}

function getAuthHeader(apiKey: string): string {
  return `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`;
}

function getMemberUrl(config: MailchimpConfig, emailHash: string): string {
  return `https://${config.serverPrefix}.api.mailchimp.com/3.0/lists/${config.listId}/members/${emailHash}`;
}

export type PdfDownloadContentType = "case_study" | "blog";

export interface PdfDownloadContext {
  contentType: PdfDownloadContentType;
  slug: string;
  title: string;
}

async function shouldUseDownloadMergeFields(): Promise<boolean> {
  return (await getRuntimeEnv("MAILCHIMP_DOWNLOAD_MERGE_FIELDS")) !== "false";
}

async function buildDownloadMergeFields(
  context: PdfDownloadContext
): Promise<Record<string, string> | undefined> {
  if (!(await shouldUseDownloadMergeFields())) {
    return undefined;
  }

  const slugTag = (await getRuntimeEnv("MAILCHIMP_DOWNLOAD_SLUG_MERGE_TAG")) ?? "DL_SLUG";
  const titleTag = (await getRuntimeEnv("MAILCHIMP_DOWNLOAD_TITLE_MERGE_TAG")) ?? "DL_TITLE";
  const typeTag = (await getRuntimeEnv("MAILCHIMP_DOWNLOAD_TYPE_MERGE_TAG")) ?? "DL_TYPE";

  return {
    [slugTag]: context.slug.slice(0, 255),
    [titleTag]: context.title.slice(0, 255),
    [typeTag]: context.contentType,
  };
}

function formatMailchimpError(
  body: { detail?: string; title?: string } | null,
  fallback: string
): string {
  const message = body?.detail || body?.title || fallback;
  if (message.toLowerCase().includes("merge field")) {
    return "Mailchimp merge fields are not configured. Create DL_SLUG, DL_TITLE, and DL_TYPE in your audience, or set MAILCHIMP_DOWNLOAD_MERGE_FIELDS=false.";
  }
  return message;
}

export async function upsertMailchimpMember(
  config: MailchimpConfig,
  email: string,
  mergeFields?: Record<string, string>
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const emailHash = md5EmailHash(email);
  const response = await fetch(getMemberUrl(config, emailHash), {
    method: "PUT",
    headers: {
      Authorization: getAuthHeader(config.apiKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: normalizeEmail(email),
      status_if_new: "subscribed",
      status: "subscribed",
      ...(mergeFields && Object.keys(mergeFields).length > 0
        ? { merge_fields: mergeFields }
        : {}),
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      detail?: string;
      title?: string;
    } | null;
    return {
      ok: false,
      status: response.status,
      message: formatMailchimpError(body, "Mailchimp subscription failed"),
    };
  }

  return { ok: true };
}

export async function applyMailchimpTags(
  config: MailchimpConfig,
  email: string,
  tagNames: string[]
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const emailHash = md5EmailHash(email);
  const response = await fetch(`${getMemberUrl(config, emailHash)}/tags`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(config.apiKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tags: tagNames.map((name) => ({ name, status: "active" as const })),
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      detail?: string;
      title?: string;
    } | null;
    return {
      ok: false,
      status: response.status,
      message: formatMailchimpError(body, "Mailchimp tagging failed"),
    };
  }

  return { ok: true };
}

export async function subscribeWithTags(
  email: string,
  tagNames: string[],
  mergeFields?: Record<string, string>
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const config = await getMailchimpConfig();
  if (!config) {
    return {
      ok: false,
      status: 500,
      message: await getMailchimpConfigError(),
    };
  }

  const subscribeResult = await upsertMailchimpMember(config, email, mergeFields);
  if (!subscribeResult.ok) {
    return subscribeResult;
  }

  if (tagNames.length === 0) {
    return { ok: true };
  }

  return applyMailchimpTags(config, email, tagNames);
}

export async function subscribePdfDownload(
  email: string,
  tagName: string,
  context: PdfDownloadContext
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  return subscribeWithTags(email, [tagName], await buildDownloadMergeFields(context));
}
