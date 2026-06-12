"use client";

import { useState } from "react";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import PdfDownloadModal from "@/components/shared/PdfDownloadModal";

interface BlogPostFooterProps {
  slug: string;
  hasPdf: boolean;
}

export default function BlogPostFooter({ slug, hasPdf }: BlogPostFooterProps) {
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  return (
    <>
      {hasPdf && (
        <section className="mt-12">
          <button
            type="button"
            onClick={() => setPdfModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-navy px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </button>
        </section>
      )}

      <NewsletterSignup />

      {hasPdf && (
        <PdfDownloadModal
          isOpen={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          slug={slug}
          endpoint="/api/blog-pdf-subscribe"
        />
      )}
    </>
  );
}
