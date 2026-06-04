import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// ---------- Types ----------

interface PostViewCount {
  id: number;
  title: string;
  slug: string;
  view_count: number;
}

interface DailyViewRow {
  date: string;
  count: number;
}

interface ViewStats {
  totalViews: number;
  dailyViews: DailyViewRow[];
  topPosts: PostViewCount[];
  topReferrers: { referrer: string; count: number }[];
}

// ---------- Helpers ----------

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

// ---------- Hooks ----------

/**
 * Fetches view_count for all published posts.
 * Used in the admin PostsTable.
 */
export function usePostViewCounts() {
  return useQuery<PostViewCount[]>({
    queryKey: ["postViewCounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, view_count")
        .eq("status", "publish")
        .order("view_count", { ascending: false });

      if (error) throw error;
      return (data ?? []) as PostViewCount[];
    },
  });
}

/**
 * Aggregated view stats for the admin dashboard.
 * Supports timeframes: 7d, 30d, or all.
 */
export function useViewStats(timeframe: "7d" | "30d" | "all" = "30d") {
  return useQuery<ViewStats>({
    queryKey: ["viewStats", timeframe],
    queryFn: async () => {
      const since =
        timeframe === "7d"
          ? daysAgo(7)
          : timeframe === "30d"
            ? daysAgo(30)
            : null;

      // --- Total views ---
      let totalQuery = supabase
        .from("page_views")
        .select("id", { count: "exact", head: true });
      if (since) totalQuery = totalQuery.gte("created_at", since);
      const { count: totalViews, error: totalErr } = await totalQuery;
      if (totalErr) throw totalErr;

      // --- Daily views ---
      let dailyQuery = supabase
        .from("page_views")
        .select("created_at");
      if (since) dailyQuery = dailyQuery.gte("created_at", since);
      const { data: dailyRaw, error: dailyErr } = await dailyQuery;
      if (dailyErr) throw dailyErr;

      const dayCounts: Record<string, number> = {};
      for (const row of dailyRaw ?? []) {
        const day = new Date(row.created_at).toISOString().slice(0, 10);
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }
      const dailyViews: DailyViewRow[] = Object.entries(dayCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // --- Top posts ---
      const { data: topPostsData, error: topPostsErr } = await supabase
        .from("blog_posts")
        .select("id, title, slug, view_count")
        .eq("status", "publish")
        .order("view_count", { ascending: false })
        .limit(10);
      if (topPostsErr) throw topPostsErr;
      const topPosts = (topPostsData ?? []) as PostViewCount[];

      // --- Top referrers ---
      let refQuery = supabase
        .from("page_views")
        .select("referrer");
      if (since) refQuery = refQuery.gte("created_at", since);
      const { data: refRaw, error: refErr } = await refQuery;
      if (refErr) throw refErr;

      const refCounts: Record<string, number> = {};
      for (const row of refRaw ?? []) {
        const ref = row.referrer || "(direct)";
        refCounts[ref] = (refCounts[ref] || 0) + 1;
      }
      const topReferrers = Object.entries(refCounts)
        .map(([referrer, count]) => ({ referrer, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalViews: totalViews ?? 0,
        dailyViews,
        topPosts,
        topReferrers,
      };
    },
  });
}

/**
 * Fetches daily view counts for the last N days.
 * Good for a simple line/bar chart.
 */
export function useDailyViews(days: number = 30) {
  return useQuery<DailyViewRow[]>({
    queryKey: ["dailyViews", days],
    queryFn: async () => {
      const since = daysAgo(days);

      const { data, error } = await supabase
        .from("page_views")
        .select("created_at")
        .gte("created_at", since);

      if (error) throw error;

      const dayCounts: Record<string, number> = {};

      // Pre-fill every day in the range so the chart has no gaps
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dayCounts[d.toISOString().slice(0, 10)] = 0;
      }

      for (const row of data ?? []) {
        const day = new Date(row.created_at).toISOString().slice(0, 10);
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }

      return Object.entries(dayCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
  });
}
