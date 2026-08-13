"use client";

import { useState, useEffect } from "react";

type WorkbookTier = "digital" | "printed" | "bundle";

const MAX_BULK_QUANTITY = 500;

interface WorkbookCheckoutButtonProps {
  tier: WorkbookTier;
  label?: string;
  className?: string;
}

export default function WorkbookCheckoutButton({
  tier,
  label = "Buy Now",
  className = "",
}: WorkbookCheckoutButtonProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">(
    "idle",
  );
  const [quantityInput, setQuantityInput] = useState("1");

  const showQuantity = tier === "printed" || tier === "bundle";

  const parsedQuantity = Number(quantityInput);
  const quantityValid =
    Number.isInteger(parsedQuantity) &&
    parsedQuantity >= 1 &&
    parsedQuantity <= MAX_BULK_QUANTITY;

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setStatus("idle");
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function handleCheckout() {
    if (status === "submitting") return;
    if (showQuantity && !quantityValid) return;

    setStatus("submitting");

    const body: { tier: WorkbookTier; quantity?: number } = { tier };
    if (showQuantity && parsedQuantity > 1) {
      body.quantity = parsedQuantity;
    }

    try {
      const response = await fetch("/api/checkout/workbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        setStatus("error");
        return;
      }

      window.location.href = data.url;
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {showQuantity && (
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span>Qty</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_BULK_QUANTITY}
            step={1}
            value={quantityInput}
            onChange={(e) => setQuantityInput(e.target.value)}
            aria-label={`Quantity for ${tier} tier`}
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm text-navy placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          {quantityValid && (
            <span className="text-xs text-gray-400">x {parsedQuantity}</span>
          )}
        </label>
      )}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={status === "submitting" || (showQuantity && !quantityValid)}
        className={className}
      >
        {status === "submitting" ? "Processing..." : label}
      </button>
      {status === "error" && (
        <span className="mt-2 block text-sm text-red-600">
          Something went wrong. Please try again.
        </span>
      )}
    </div>
  );
}
