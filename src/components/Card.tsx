"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CardProps {
  title: string;
  excerpt: string;
  slug: string;
  href: string;
  imageUrl?: string | null;
  imageAlt?: string;
  date?: string;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

function CardImage({ imageUrl, imageAlt }: { imageUrl: string; imageAlt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="relative w-full h-48 overflow-hidden bg-[#075E8B]/10 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Bogues Group"
          className="h-12 w-auto opacity-40"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 overflow-hidden bg-gray-100">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        unoptimized
        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function Card({
  title,
  excerpt,
  href,
  imageUrl,
  imageAlt = "",
  date,
}: CardProps) {
  return (
    <Link href={href} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 transition-all duration-300 group-hover:-translate-y-1"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        {imageUrl ? (
          <CardImage imageUrl={imageUrl} imageAlt={imageAlt} />
        ) : (
          <div className="relative w-full h-48 overflow-hidden bg-[#075E8B]/10 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Bogues Group"
              className="h-12 w-auto opacity-40"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          {date && (
            <time className="mb-3 block text-xs font-medium uppercase tracking-wider text-gray-400">
              {date}
            </time>
          )}
          <h3 className="mb-3 text-lg font-bold leading-snug text-[#075E8B] font-heading transition-all duration-300 group-hover:scale-[1.02] group-hover:drop-shadow-[0_0_6px_rgba(212,175,56,0.5)]" style={{ transformOrigin: 'left center' }}>
            {decodeHtmlEntities(title)}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
            {excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
