"use client";

import { useState } from "react";

interface WorkbookDownloadButtonProps {
  sessionId: string;
}

export default function WorkbookDownloadButton({
  sessionId,
}: WorkbookDownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleDownload() {
    if (status === "loading") return;

    setStatus("loading");

    try {
      const response = await fetch("/api/workbook/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        setStatus("error");
        return;
      }

      window.open(data.url, "_blank", "noopener,noreferrer");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#e5c256] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Preparing your download..." : "Download Your Workbook"}
      </button>
      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">
          Something went wrong. Please contact support.
        </p>
      )}
    </div>
  );
}