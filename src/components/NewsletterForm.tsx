"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "duplicate" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("submitting");

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, source: "footer" });

    if (error) {
      if (error.code === "23505") {
        setStatus("duplicate");
      } else {
        setStatus("error");
      }
      return;
    }

    // Send email notification (fire and forget)
    fetch("https://bogues-contact-notify.thatllcthatllc.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "newsletter" }),
    }).catch(() => {});

    setStatus("success");
    setEmail("");
  }

  if (status === "success") {
    return (
      <p className="text-green-400 text-sm font-medium">Subscribed!</p>
    );
  }

  if (status === "duplicate") {
    return (
      <p className="text-gold text-sm font-medium">Already subscribed.</p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-gold hover:bg-gold-light text-navy font-semibold text-sm px-4 py-2 rounded transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "..." : "Join"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-1">
          Something went wrong. Please try again.
        </p>
      )}
    </>
  );
}
