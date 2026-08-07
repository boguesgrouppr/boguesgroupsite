"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { isPriorityImage } from "@/lib/image-priority";

interface PressArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  imageAlt: string;
  date: string;
  category: string;
}

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Corporate Responsibility", value: "corporate-responsibility" },
  { label: "Crisis Communication", value: "crisis-communication" },
  { label: "Regulated Business", value: "regulated-business" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Sports", value: "sports" },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]["value"];

export default function PressGrid({ articles }: { articles: PressArticle[] }) {
  const [active, setActive] = useState<CategoryValue>("all");

  const filtered =
    active === "all"
      ? articles
      : articles.filter((a) => a.category === active);

  return (
    <>
      {/* Filter tabs */}
      <div className="mb-10 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#075E8B] text-white shadow-md"
                  : "bg-white text-[#075E8B] border border-[#075E8B]/20 hover:bg-[#075E8B]/5"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p className="mb-8 text-sm text-gray-500">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article, index) => (
          <Card
            key={article.id}
            title={article.title}
            excerpt={article.excerpt}
            slug={article.slug}
            href={`/blog/${article.slug}`}
            imageUrl={article.imageUrl}
            imageAlt={article.imageAlt}
            date={article.date}
            priority={isPriorityImage(index)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-gray-400">
          No articles in this category yet.
        </p>
      )}
    </>
  );
}
