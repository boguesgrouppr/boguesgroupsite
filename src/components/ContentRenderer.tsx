"use client";

import parse, {
  HTMLReactParserOptions,
  Element,
  Text,
  domToReact,
} from "html-react-parser";
import { resolveFullImageSrc, rewriteContentUrls } from "@/lib/content-urls";
import ContentImage from "./ContentImage";

interface ContentRendererProps {
  html: string;
}

/**
 * Check if an anchor element contains an img child (image link).
 */
function isImageLink(domNode: Element): boolean {
  if (domNode.name !== "a") return false;
  return domNode.children.some(
    (child) => child instanceof Element && child.name === "img"
  );
}

/**
 * Check if an anchor element's visible text is a long URL (80+ chars).
 * If so, we render it as a styled button instead of showing the raw URL.
 */
function isLongUrlLink(domNode: Element): boolean {
  if (domNode.name !== "a") return false;
  // Get the text content of the link
  const textContent = domNode.children
    .filter((child): child is Text => child.type === "text")
    .map((child) => child.data)
    .join("");
  // Check if the visible text looks like a long URL (80+ chars)
  if (textContent.length < 80) return false;
  try {
    new URL(textContent.trim());
    return true;
  } catch {
    return false;
  }
}

export default function ContentRenderer({ html }: ContentRendererProps) {
  const localizedHtml = rewriteContentUrls(html);

  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (domNode instanceof Element && domNode.name === "img") {
        const src = resolveFullImageSrc(domNode.attribs.src || "");
        const alt = domNode.attribs.alt || "";
        const className = domNode.attribs.class || "";

        // If the image is inside an <a> tag, preserve the link instead of lightbox.
        // Render a plain <img> so the parent <a> handles the click naturally.
        const parent = domNode.parent;
        if (parent && parent instanceof Element && parent.name === "a") {
          return (
            <img
              src={src}
              alt={alt}
              className={className}
              loading="lazy"
            />
          );
        }

        // Standalone images get lightbox + error handling
        return <ContentImage src={src} alt={alt} className={className} />;
      }

      // If an <a> tag wraps an image, ensure it opens in a new tab
      if (domNode instanceof Element && isImageLink(domNode)) {
        const href = domNode.attribs.href || "";
        const rel = domNode.attribs.rel || "noopener noreferrer";
        return (
          <a href={href} target="_blank" rel={rel}>
            {domToReact(domNode.children as import("html-react-parser").DOMNode[], options)}
          </a>
        );
      }

      // Style long URL links as buttons instead of showing raw URLs
      if (domNode instanceof Element && isLongUrlLink(domNode)) {
        const href = domNode.attribs.href || "";
        const target = domNode.attribs.target || "_blank";
        const rel = domNode.attribs.rel || "noopener noreferrer";
        return (
          <a
            href={href}
            target={target}
            rel={rel}
            className="not-prose inline-flex items-center gap-2 rounded bg-navy px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-navy/80 hover:text-gold"
          >
            Read the full article
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        );
      }
    },
  };

  return (
    <div className="wp-content prose prose-lg max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-navy prose-blockquote:border-l-gold prose-strong:text-navy prose-img:rounded-lg prose-img:shadow-md prose-p:text-body prose-a:text-navy prose-a:underline hover:prose-a:text-gold prose-a:transition-colors prose-a:duration-150">
      {parse(localizedHtml, options)}
    </div>
  );
}
