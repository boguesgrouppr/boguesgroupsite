"use client";

import { useState } from "react";

const AI_API_URL = "https://bogues-ai-writer.chase-c7a.workers.dev";
const AI_API_KEY = "bg-ai-2026-writer";

interface AiFillButtonProps {
  field: "title" | "slug" | "excerpt" | "content" | "metaTitle" | "metaDescription" | "h1Override" | "categories" | "tags";
  currentTitle?: string;
  currentContent?: string;
  currentExcerpt?: string;
  onFill: (value: string) => void;
}

const LOADING_HINTS = [
  "Thinking...",
  "Crafting your content...",
  "Working on it...",
  "Almost there...",
  "Generating...",
];

function buildPrompt(props: AiFillButtonProps): string {
  const { field, currentTitle = "", currentContent = "", currentExcerpt = "" } = props;
  const contentSnippet = currentContent.replace(/<[^>]*>/g, "").slice(0, 2000);

  switch (field) {
    case "title":
      return `Based on this content, suggest ONE compelling blog post title. Keep it under 70 characters. Output ONLY the title, nothing else.\n\nContent:\n${contentSnippet.slice(0, 1000)}`;
    case "slug":
      return `Generate a URL slug for this blog post title. Use only lowercase letters, numbers, and hyphens. Keep it short (3-6 words). Output ONLY the slug, nothing else.\n\nTitle: ${currentTitle}`;
    case "excerpt":
      return `Write a 2-3 sentence excerpt/summary for this blog post. Keep it concise and engaging, under 160 characters. Output ONLY the excerpt text, nothing else.\n\nTitle: ${currentTitle}\n\nContent:\n${contentSnippet}`;
    case "metaTitle":
      return `Write an SEO meta title for this blog post. Must be under 60 characters. Include relevant keywords. Output ONLY the meta title, nothing else.\n\nTitle: ${currentTitle}\n\nExcerpt: ${currentExcerpt}`;
    case "metaDescription":
      return `Write an SEO meta description for this blog post. Must be under 160 characters. Make it compelling for search results. Output ONLY the meta description, nothing else.\n\nTitle: ${currentTitle}\n\nContent:\n${contentSnippet.slice(0, 1000)}`;
    case "h1Override":
      return `Suggest an H1 heading for this blog post page. It can differ from the title for SEO purposes. Keep it under 70 characters. Output ONLY the H1 text, nothing else.\n\nTitle: ${currentTitle}\n\nExcerpt: ${currentExcerpt}`;
    case "categories":
      return `Based on this blog post, suggest 2-3 relevant category names separated by commas. Use categories common for a PR/communications firm (e.g., Media Relations, Brand Strategy, Community, Events, Crisis Management, Social Impact, Sports PR). Output ONLY the comma-separated categories, nothing else.\n\nTitle: ${currentTitle}\n\nContent:\n${contentSnippet.slice(0, 1000)}`;
    case "tags":
      return `Based on this blog post, suggest 4-6 relevant tags separated by commas. Use specific, lowercase, keyword-style tags (e.g., charlotte, nba, public-relations, brand-building). Output ONLY the comma-separated tags, nothing else.\n\nTitle: ${currentTitle}\n\nContent:\n${contentSnippet.slice(0, 1000)}`;
    case "content":
      return `Write a professional, engaging blog post about the following topic. Use HTML formatting (h2, h3, p, ul, li, strong, em tags). 400-600 words.\n\nTitle: ${currentTitle}`;
    default:
      return "";
  }
}

export default function AiFillButton(props: AiFillButtonProps) {
  const { onFill } = props;
  const [filling, setFilling] = useState(false);
  const [hint, setHint] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFill = async () => {
    setFilling(true);
    setProgress(0);

    // Cycle through hints
    const hintIndex = Math.floor(Math.random() * LOADING_HINTS.length);
    setHint(LOADING_HINTS[hintIndex]);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; // Cap at 90% until done
        return prev + Math.random() * 15;
      });
      // Cycle hints every 3 seconds
      setHint(LOADING_HINTS[Math.floor(Math.random() * LOADING_HINTS.length)]);
    }, 2000);

    const prompt = buildPrompt(props);

    try {
      const res = await fetch(AI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`AI request failed: ${res.status}`);
      }

      const data = await res.json();
      let text = (data.text || "").trim();

      // Remove wrapping quotes
      if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
        text = text.slice(1, -1);
      }

      setProgress(100);
      setTimeout(() => onFill(text), 200);
    } catch (err) {
      console.error("AI fill error:", err);
      setHint("Failed. Try again.");
      setTimeout(() => {
        setFilling(false);
        setHint("");
        setProgress(0);
      }, 2000);
      return;
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setFilling(false);
        setHint("");
        setProgress(0);
      }, 300);
    }
  };

  if (filling) {
    return (
      <div className="inline-flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#075E8B]/10 rounded-lg">
          {/* Animated dots */}
          <div className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-[#075E8B] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-[#075E8B] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-[#075E8B] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[10px] text-[#075E8B] font-medium">{hint}</span>
        </div>
        {/* Mini progress bar */}
        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF38] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleFill}
      className="group inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-[#075E8B]/10 text-[#075E8B] rounded hover:bg-[#075E8B]/20 transition-colors"
      title="Fill with AI (may take 10-30 seconds)"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      AI
      {/* Tooltip hint */}
      <span className="hidden group-hover:block absolute mt-8 top-full left-0 z-50 px-2 py-1 bg-gray-900 text-white text-[9px] rounded whitespace-nowrap shadow-lg">
        May take 10-30 seconds
      </span>
    </button>
  );
}
