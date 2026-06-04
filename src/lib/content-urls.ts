// URL rewriting and text helpers — no large JSON imports (safe for client bundles).

import {
  getMediaBaseUrl,
  stripScaledSuffix,
  stripWpSizeSuffix,
  toMediaPath,
  toMediaUrl,
} from "./media-url";

export { stripScaledSuffix, stripWpSizeSuffix, toMediaPath, toMediaUrl } from "./media-url";

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

export function stripHtml(html: string): string {
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
