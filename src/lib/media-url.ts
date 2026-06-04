/**
 * All site images use a static CDN/origin + `/media/...` path.
 * Default: https://bogues-group.pages.dev/media/2024/11/example.jpg
 */

const DEFAULT_MEDIA_BASE = "https://bogues-group.pages.dev";

const MEDIA_HOSTS = new Set([
  "boguesgroup.com",
  "www.boguesgroup.com",
  "bogues-group.pages.dev",
]);

export function getMediaBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ||
    DEFAULT_MEDIA_BASE
  );
}

export function stripWpSizeSuffix(path: string): string {
  return path.replace(/-\d+x\d+(\.[^./?]+)(?:\?.*)?$/i, "$1");
}

export function stripScaledSuffix(path: string): string {
  return path.replace(/-scaled(\.[^./?]+)$/i, "$1");
}

/** Normalize any input to `/media/year/month/file.ext`. */
export function toMediaPath(url: string): string {
  if (!url?.trim()) return url;

  let path = url.trim();

  if (path.startsWith("//")) {
    path = `https:${path}`;
  }

  if (/^https?:\/\//i.test(path)) {
    try {
      const parsed = new URL(path);
      const host = parsed.hostname.replace(/^www\./, "");
      if (MEDIA_HOSTS.has(host) || host.endsWith(".pages.dev")) {
        if (parsed.pathname.startsWith("/wp-content/uploads/")) {
          path = `/media/${parsed.pathname.slice("/wp-content/uploads/".length)}`;
        } else if (parsed.pathname.startsWith("/media/")) {
          path = parsed.pathname;
        } else {
          return path;
        }
      } else {
        return path;
      }
    } catch {
      return path;
    }
  } else if (!path.startsWith("/")) {
    path = path.startsWith("media/") ? `/${path}` : `/${path}`;
  }

  path = stripWpSizeSuffix(path);
  path = stripScaledSuffix(path);
  return path;
}

/** Full image URL for <img src>, cards, featured images, etc. */
export function toMediaUrl(url: string): string {
  if (!url?.trim()) return url;
  const path = toMediaPath(url);
  if (/^https?:\/\//i.test(path)) return path;
  return `${getMediaBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** @deprecated Use toMediaPath — kept for imports that only need the path segment. */
export const toLocalMediaPath = toMediaPath;

export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    return "https://boguesgroup.com";
  }
  return "http://localhost:3000";
}

/** Absolute URL for Open Graph / Twitter metadata. */
export function toAbsoluteMediaUrl(url: string): string | null {
  if (!url) return null;
  return toMediaUrl(url);
}
