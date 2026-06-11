"use client";

import { useState } from "react";
import NavLink from "@/components/NavLink";
import {
  getCategoryTabLabel,
  type CaseStudy,
} from "@/lib/case-studies-shared";

interface CaseStudyCardProps {
  study: CaseStudy;
}

function CaseStudyCardImage({
  imageUrl,
  title,
}: {
  imageUrl: string;
  title: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-[#075E8B]/10">
        <img
          src="/logo.png"
          alt="Bogues Group"
          className="h-12 w-auto opacity-40"
        />
      </div>
    );
  }

  return (
    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function CaseStudyCard({ study }: CaseStudyCardProps) {
  return (
    <NavLink href={`/case-studies/${study.slug}`} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        {study.cover_image_url ? (
          <CaseStudyCardImage
            imageUrl={study.cover_image_url}
            title={study.title}
          />
        ) : (
          <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-[#075E8B]/10">
            <img
              src="/logo.png"
              alt="Bogues Group"
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
