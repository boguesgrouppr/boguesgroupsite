"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

function getSessionId(): string {
  const key = "bg_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

function shouldTrack(path: string): boolean {
  const key = "bg_last_view";
  const now = Date.now();
  const last = sessionStorage.getItem(key);

  if (last) {
    try {
      const { path: lastPath, ts } = JSON.parse(last);
      if (lastPath === path && now - ts < 30_000) {
        return false;
      }
    } catch {
      // Corrupted data, allow tracking
    }
  }

  sessionStorage.setItem(key, JSON.stringify({ path, ts: now }));
  return true;
}

interface PageViewTrackerProps {
  postId: number;
  path: string;
}

export default function PageViewTracker({ postId, path }: PageViewTrackerProps) {
  useEffect(() => {
    if (path.startsWith("/admin")) return;
    if (!shouldTrack(path)) return;

    const sessionId = getSessionId();

    // Insert page view row
    supabase
      .from("page_views")
      .insert({
        post_id: postId,
        path,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        session_id: sessionId,
      })
      .then(({ error }) => {
        if (error) console.error("Failed to record page view:", error);
      });

    // Increment the cached view_count on blog_posts
    supabase
      .rpc("increment_view_count", { p_post_id: postId })
      .then(({ error }) => {
        if (error) console.error("Failed to increment view count:", error);
      });
  }, [postId, path]);

  return null;
}
