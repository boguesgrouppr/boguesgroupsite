"use client";

import { useState } from "react";
import Lightbox from "./Lightbox";

interface ContentImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ContentImage({ src, alt, className = "" }: ContentImageProps) {
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (error) {
    // Hide broken images entirely rather than showing a placeholder inline
    return null;
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-pointer`}
        onError={() => setError(true)}
        onClick={() => setLightboxOpen(true)}
        loading="lazy"
      />
      {lightboxOpen && (
        <Lightbox src={src} alt={alt} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
