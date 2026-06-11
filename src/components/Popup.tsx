"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NavLink from "@/components/NavLink";

export default function Popup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("popup-dismissed")) return;
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem("popup-dismissed", "1");
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white/80 transition-colors hover:bg-black/60"
          aria-label="Close popup"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Banner image */}
        <NavLink href="/brand-builder-hub" onClick={dismiss}>
          <Image
            src="/popup-banner.png"
            alt="Grow your brand with Bogues Group"
            width={1024}
            height={683}
            className="w-full h-auto"
            unoptimized
          />
        </NavLink>

        {/* CTA bar */}
        <div className="bg-[#075E8B] px-8 py-8 text-center">
          <p className="text-white text-lg mb-5 font-medium">
            Expert PR tips and resources to build your brand
          </p>

          {/* Subtle animated border button */}
          <NavLink
            href="/brand-builder-hub"
            onClick={dismiss}
            className="popup-cta relative inline-block rounded-lg bg-[#D4AF38] px-8 py-4 text-base font-bold text-[#021f2e] transition-all hover:bg-[#e5c256] hover:scale-[1.02]"
          >
            Explore the Brand Builder Hub
          </NavLink>
        </div>

        <style jsx>{`
          .popup-cta {
            box-shadow: 0 0 0 0 rgba(212, 175, 56, 0.6);
            animation: ring-pulse 2s ease-in-out infinite;
          }
          @keyframes ring-pulse {
            0% { box-shadow: 0 0 0 0 rgba(212, 175, 56, 0.5); }
            50% { box-shadow: 0 0 0 6px rgba(212, 175, 56, 0); }
            100% { box-shadow: 0 0 0 0 rgba(212, 175, 56, 0); }
          }
        `}</style>
      </div>
    </div>
  );
}
