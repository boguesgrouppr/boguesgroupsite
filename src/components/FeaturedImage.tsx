"use client";

import Image from "next/image";
import { useState } from "react";

interface FeaturedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function FeaturedImage({ src, alt, priority = false }: FeaturedImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative -mt-8 overflow-hidden rounded-lg shadow-xl bg-[#075E8B]/10 flex items-center justify-center py-12">
          <img
            src="/logo.png"
            alt="Bogues Group"
            className="h-16 w-auto opacity-40"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="relative -mt-8 overflow-hidden rounded-lg shadow-xl">
        <Image
          src={src}
          alt={alt}
          width={896}
          height={504}
          unoptimized
          className="w-full h-auto"
          sizes="(max-width: 896px) 100vw, 896px"
          priority={priority}
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
}
