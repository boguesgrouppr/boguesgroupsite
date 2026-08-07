"use client";

import { useState } from "react";
import Image from "next/image";
import NavLink from "@/components/NavLink";
import {
  getCategoryTabLabel,
  type CaseStudy,
} from "@/lib/case-studies-shared";

interface CaseStudyCardProps {
  study: CaseStudy;
  priority?: boolean;
}

function CaseStudyCardImage({
  imageUrl,
  alt,
  priority = false,
}: {
  imageUrl: string;
  alt: string;
  priority?: boolean;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-[#075E8B]/10">
        <Image
          src="/logo.png"
          alt="Bogues Group"
          width={125}
          height={118}
          className="h-12 w-auto opacity-40"
        />
      </div>
    );
  }

  return (
    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function CaseStudyCard({ study, priority = false }: CaseStudyCardProps) {
  const coverAlt = study.client
    ? `${study.client} — ${study.title}`
    : study.title;

  return (
    <NavLink href={`/case-studies/${study.slug}`} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        {study.cover_image_url ? (
          <CaseStudyCardImage
            imageUrl={study.cover_image_url}
            alt={coverAlt}
            priority={priority}
          />
        ) : (
          <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-[#075E8B]/10">
            <Image
              src="/logo.png"
              alt="Bogues Group"
              width={125}
              height={118}
              className="h-12 w-auto opacity-40"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          {study.categories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {study.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex rounded-full bg-[#075E8B]/10 px-3 py-1 text-xs font-semibold text-[#075E8B]"
                >
                  {getCategoryTabLabel(category)}
                </span>
              ))}
            </div>
          )}
          <p className="mb-1 text-sm font-medium text-gray-500">{study.client}</p>
          <h3 className="mb-3 font-heading text-lg font-bold leading-snug text-[#075E8B] transition-all duration-300 group-hover:text-[#D4AF38]">
            {study.title}
          </h3>
          {study.short_description && (
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
              {study.short_description}
            </p>
          )}
        </div>
      </article>
    </NavLink>
  );
}