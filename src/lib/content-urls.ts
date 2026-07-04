// URL rewriting and text helpers — no large JSON imports (safe for client bundles).

import { getMediaBaseUrl, toMediaUrl } from "./media-url";

function stripScriptTags(html: string): string {
  return html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
}

export function prepareContentHtml(html: string): string {
  return stripScriptTags(rewriteContentUrls(html));
}

export type ContentSegment =
  | { type: "html"; content: string }
  | { type: "embed"; content: string };

const MAILCHIMP_EMBED =
  /<div[^>]*id=["']mc_embed_signup[^"']*["'][^>]*>/i;

function extractDivBlock(html: string, divOpen: number): string | null {
  let depth = 0;
  let i = divOpen;
  while (i < html.length) {
    if (html.startsWith("<div", i)) {
      depth++;
      i += 4;
    } else if (html.startsWith("</div>", i)) {
      depth--;
      if (depth === 0) {
        return html.slice(divOpen, i + 6);
      }
      i += 6;
    } else {
      i++;
    }
  }
  return null;
}

export function splitContentSegments(html: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let cursor = 0;

  while (cursor < html.length) {
    const searchSlice = html.slice(cursor);
    const match = searchSlice.match(MAILCHIMP_EMBED);
    if (!match || match.index === undefined) {
      const tail = html.slice(cursor);
      if (tail.trim()) segments.push({ type: "html", content: tail });
      break;
    }

    const embedStart = cursor + match.index;
    const before = html.slice(cursor, embedStart);
    if (before.trim()) segments.push({ type: "html", content: before });

    const block = extractDivBlock(html, embedStart);
    if (!block) {
      segments.push({ type: "html", content: html.slice(cursor) });
      break;
    }

    segments.push({ type: "embed", content: block });
    cursor = embedStart + block.length;
  }

  return segments.length > 0 ? segments : [{ type: "html", content: html }];
}

export function rewriteContentUrls(html: string): string {
  return html
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/wp-content\/uploads\/([^"'\s<>]+)/gi,
      (_match, filePath: string) => toMediaUrl(`/media/${filePath}`)
    )
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/media\/([^"'\s<>]+)/gi,
      (_match, filePath: string) => toMediaUrl(`/media/${filePath}`)
    )
    .replace(
      /https?:\/\/[^/"'\s<>]+\.pages\.dev\/media\/([^"'\s<>]+)/gi,
      (_match, filePath: string) => toMediaUrl(`/media/${filePath}`)
    )
    .replace(/src="\/media\//g, `src="${getMediaBaseUrl()}/media/`)
    .replace(/src='\/media\//g, `src='${getMediaBaseUrl()}/media/`)
    .replace(/href="\/media\//g, `href="${getMediaBaseUrl()}/media/`)
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/register\/[^"'\s<>]*/g,
      "/contact?inquiry=workbook"
    )
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/my-account\/[^"'\s<>]*/g,
      "/contact?inquiry=account"
    );
}

/** Full CDN URL for content images (no thumbnails or -scaled). */
export function resolveFullImageSrc(url: string): string {
  if (!url) return url;
  return toMediaUrl(url);
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\[\.\.\.\]/g, "...")
    .trim();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
