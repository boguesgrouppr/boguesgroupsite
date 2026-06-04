// URL rewriting and text helpers — no large JSON imports (safe for client bundles).

export function rewriteContentUrls(html: string): string {
  return html
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/wp-content\/uploads\/([^"'\s<>]+)/g,
      (_match, filePath: string) => {
        const cleanPath = stripWpSizeSuffix("/media/" + filePath);
        return cleanPath;
      }
    )
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/register\/[^"'\s<>]*/g,
      "/contact?inquiry=workbook"
    )
    .replace(
      /https?:\/\/(?:www\.)?boguesgroup\.com\/my-account\/[^"'\s<>]*/g,
      "/contact?inquiry=account"
    );
}

function stripWpSizeSuffix(url: string): string {
  return url.replace(/-\d+x\d+(\.\w+)$/, "$1");
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
