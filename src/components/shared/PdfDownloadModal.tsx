"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { closePdfTab, navigatePdfTab, preparePdfTab } from "@/lib/open-pdf-tab";

interface PdfDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  endpoint: string;
  buttonLabel?: string;
}

export default function PdfDownloadModal({
  isOpen,
  onClose,
  slug,
  endpoint,
  buttonLabel = "Download PDF",
}: PdfDownloadModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const openPdfLinkRef = useRef<HTMLAnchorElement>(null);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [autoOpenFailed, setAutoOpenFailed] = useState(false);

  const resetForm = useCallback(() => {
    setEmail("");
    setLoading(false);
    setError(null);
    setSuccess(false);
    setPdfUrl(null);
    setAutoOpenFailed(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    emailInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const elements = Array.from(focusable).filter(
        (el) => !el.hasAttribute("disabled")
      );

      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [handleClose, isOpen]);

  useEffect(() => {
    if (!success || !pdfUrl) return;
    openPdfLinkRef.current?.focus();
  }, [pdfUrl, success]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = normalizeEmail(email);
    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const popup = preparePdfTab();

    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, slug }),
      });

      const data = (await response.json()) as {
        pdf_url?: string;
        error?: string;
      };

      if (!response.ok || !data.pdf_url) {
        closePdfTab(popup);
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const opened = navigatePdfTab(popup, data.pdf_url);

      setPdfUrl(data.pdf_url);
      setAutoOpenFailed(!opened);
      setSuccess(true);
      setLoading(false);
    } catch {
      closePdfTab(popup);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 id={titleId} className="font-heading text-2xl font-bold text-navy">
          {buttonLabel}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm text-gray-600">
          Enter your email to receive instant access to the PDF.
        </p>

        {success && pdfUrl ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {autoOpenFailed
                ? "Click the button below to open your PDF."
                : "Your PDF is opening in a new tab. If it did not open, click below."}
            </p>
            <a
              ref={openPdfLinkRef}
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-gold px-6 py-3 text-sm font-bold text-[#021f2e] transition-colors hover:bg-[#e5c256]"
            >
              Open PDF
            </a>
            <button
              type="button"
              onClick={handleClose}
              className="w-full text-center text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="pdf-email" className="sr-only">
                Email address
              </label>
              <input
                ref={emailInputRef}
                id="pdf-email"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-navy placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-60"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-[#021f2e] transition-colors hover:bg-[#e5c256] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {loading ? "Processing..." : buttonLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
