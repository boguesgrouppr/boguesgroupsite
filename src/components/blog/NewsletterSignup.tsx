"use client";

import { useState } from "react";
import { isValidEmail, normalizeEmail } from "@/lib/email";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = normalizeEmail(email);
    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center">
        <p className="font-heading text-xl font-bold text-navy">
          You&apos;re subscribed!
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Thanks for joining our newsletter. Watch your inbox for more insights
          from Bogues Group.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8">
      <h2 className="font-heading text-2xl font-bold text-navy">
        Subscribe to our newsletter
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Enter your email below for more insights.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
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
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-navy placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
