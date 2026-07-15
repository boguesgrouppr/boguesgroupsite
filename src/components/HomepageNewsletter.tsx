"use client";

import { useState, FormEvent } from "react";

export default function HomepageNewsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/homepage-newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <div className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-[#021f2e] placeholder:text-gray-400 focus:border-[#D4AF38] focus:outline-none focus:ring-2 focus:ring-[#D4AF38]/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#D4AF38] px-6 py-3 text-sm font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:bg-[#e5c256] hover:shadow-xl hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-3 text-sm font-medium text-green-600">Thanks for subscribing!</p>}
    </form>
  );
}
