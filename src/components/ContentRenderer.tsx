"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import parse, {
  HTMLReactParserOptions,
  Element,
  Text,
  domToReact,
} from "html-react-parser";
import {
  prepareContentHtml,
  resolveFullImageSrc,
  splitContentSegments,
  type ContentSegment,
} from "@/lib/content-urls";
import ContentImage from "./ContentImage";

interface ContentRendererProps {
  html: string;
}

const WRAPPER_CLASS =
  "wp-content prose prose-lg max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-navy prose-blockquote:border-l-gold prose-strong:text-navy prose-img:rounded-lg prose-img:shadow-md prose-p:text-body prose-a:text-navy prose-a:underline hover:prose-a:text-gold prose-a:transition-colors prose-a:duration-150";

/**
 * Check if an anchor element contains an img child (image link).
 */
function isImageLink(domNode: Element): boolean {
  if (domNode.name !== "a") return false;
  return domNode.children.some(
    (child) => child instanceof Element && child.name === "img"
  );
}


function isLongUrlLink(domNode: Element): boolean {
  if (domNode.name !== "a") return false;
  const textContent = domNode.children
    .filter((child): child is Text => child.type === "text")
    .map((child) => child.data)
    .join("");
  if (textContent.length < 80) return false;
  try {
    new URL(textContent.trim());
    return true;
  } catch {
    return false;
  }
}

function createParserOptions(): HTMLReactParserOptions {
  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (domNode instanceof Element) {
        if (domNode.name === "script") {
          return <></>;
        }

        if (domNode.name === "img") {
          const src = resolveFullImageSrc(domNode.attribs.src || "");
          const alt = domNode.attribs.alt || "";
          const className = domNode.attribs.class || "";

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

          return <ContentImage src={src} alt={alt} className={className} />;
        }

        if (isImageLink(domNode)) {
          const href = domNode.attribs.href || "";
          const rel = domNode.attribs.rel || "noopener noreferrer";
          return (
            <a href={href} target="_blank" rel={rel}>
              {domToReact(
                domNode.children as import("html-react-parser").DOMNode[],
                options
              )}
            </a>
          );
        }

        if (isLongUrlLink(domNode)) {
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
      }
    },
  };

  return options;
}

function MailchimpEmbed({ html }: { html: string }) {
  return (
    <div
      className="mailchimp-embed not-prose my-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function HtmlSegment({ html }: { html: string }) {
  const [parsedContent, setParsedContent] = useState<ReactNode | null>(null);

  useEffect(() => {
    setParsedContent(parse(html, createParserOptions()));
  }, [html]);

  if (parsedContent === null) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    );
  }

  return <>{parsedContent}</>;
}

function ContentSegmentBlock({ segment }: { segment: ContentSegment }) {
  if (segment.type === "embed") {
    return <MailchimpEmbed html={segment.content} />;
  }

  return <HtmlSegment html={segment.content} />;
}

export default function ContentRenderer({ html }: ContentRendererProps) {
  const preparedHtml = useMemo(() => prepareContentHtml(html), [html]);
  const segments = useMemo(
    () => splitContentSegments(preparedHtml),
    [preparedHtml]
  );
  const hasEmbed = segments.some((segment) => segment.type === "embed");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR + hydration: one HTML blob so server and client trees always match.
  if (!mounted) {
    return (
      <div
        className={WRAPPER_CLASS}
        dangerouslySetInnerHTML={{ __html: preparedHtml }}
        suppressHydrationWarning
      />
    );
  }

  if (!hasEmbed) {
    return (
      <div className={WRAPPER_CLASS}>
        <HtmlSegment html={preparedHtml} />
      </div>
    );
  }

  return (
    <div className={WRAPPER_CLASS}>
      {segments.map((segment, index) => (
        <ContentSegmentBlock key={index} segment={segment} />
      ))}
    </div>
  );
}
