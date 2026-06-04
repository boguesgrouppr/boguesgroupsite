import { Metadata } from "next";
import {
  getPressPosts,
  getMediaUrl,
  getMediaAlt,
  stripHtml,
  formatDate,
} from "@/lib/content";
import Hero from "@/components/Hero";
import PressGrid from "./PressGrid";

export const metadata: Metadata = {
  title: "Press Room - Bogues Group",
  description:
    "Media coverage and press mentions for Bogues Group and our clients.",
  openGraph: {
    title: "Press Room - Bogues Group",
    description:
      "Media coverage and press mentions for Bogues Group and our clients.",
    type: "website",
    siteName: "Bogues Group",
    url: "/press-room",
  },
  twitter: {
    card: "summary_large_image",
    title: "Press Room - Bogues Group",
    description:
      "Media coverage and press mentions for Bogues Group and our clients.",
  },
};

type PressCategory =
  | "corporate-responsibility"
  | "crisis-communication"
  | "regulated-business"
  | "hospitality"
  | "sports";

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function classifyArticle(slug: string, title: string, excerpt: string): PressCategory {
  const haystack = `${slug} ${title} ${excerpt}`.toLowerCase();

  if (
    includesAny(haystack, [
      "nba",
      "nfl",
      "hornets",
      "basketball",
      "muggsy",
      "brandon miller",
      "celebrity golf",
      "sports",
    ])
  ) {
    return "sports";
  }

  if (
    includesAny(haystack, [
      "abc",
      "regulated",
      "narcan",
      "opioid",
      "tequila",
      "alcohol",
      "store hours",
      "grantee",
    ])
  ) {
    return "regulated-business";
  }

  if (
    includesAny(haystack, [
      "crisis",
      "fentanyl",
      "mental health",
      "jail",
      "sheriff",
      "disaster",
      "emergency",
      "public safety",
    ])
  ) {
    return "crisis-communication";
  }

  if (
    includesAny(haystack, [
      "hospitality",
      "restaurant",
      "hotel",
      "tourism",
      "fundraiser",
      "soiree",
      "event",
      "whiskey",
    ])
  ) {
    return "hospitality";
  }

  return "corporate-responsibility";
}

export default async function PressRoomPage() {
  const posts = await getPressPosts();

  const articles = posts
    .map((post) => {
      const cleanExcerpt = stripHtml(post.excerpt.rendered);
      return {
        id: post.id,
        slug: post.slug,
        title: post.title.rendered,
        excerpt: cleanExcerpt,
        imageUrl: post._featuredImage || getMediaUrl(post.featured_media),
        imageAlt: getMediaAlt(post.featured_media),
        date: formatDate(post.date),
        category: classifyArticle(post.slug, post.title.rendered, cleanExcerpt),
      };
    });

  return (
    <div>
      <Hero
        title="Press Room"
        subtitle="Media coverage and press mentions for Bogues Group and our clients"
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <PressGrid articles={articles} />
      </section>
    </div>
  );
}
