"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import PostsTable from "@/components/admin/PostsTable";
import { supabase } from "@/lib/supabase";

interface PostStats {
  total: number;
  published: number;
  drafts: number;
  totalViews: number;
}

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<PostStats>({
    total: 0,
    published: 0,
    drafts: 0,
    totalViews: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: posts } = await supabase
          .from("blog_posts")
          .select("status, view_count");

        if (posts) {
          const published = posts.filter((p) => p.status === "publish").length;
          const drafts = posts.filter((p) => p.status === "draft").length;
          const totalViews = posts.reduce(
            (sum, p) => sum + (p.view_count || 0),
            0
          );
          setStats({
            total: posts.length,
            published,
            drafts,
            totalViews,
          });
        }
      } catch {
        // Stats are non-critical
      } finally {
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Admin";

  const statCards = [
    { label: "Total Posts", value: stats.total, color: "bg-[#075E8B]" },
    { label: "Published", value: stats.published, color: "bg-emerald-600" },
    { label: "Drafts", value: stats.drafts, color: "bg-amber-500" },
    { label: "Total Views", value: stats.totalViews, color: "bg-purple-600" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#075E8B]">Dashboard</h1>
        <p className="mt-1 text-gray-500">Welcome back, {displayName}</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex items-center gap-4 p-5">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${card.color}`}
              >
                <span className="text-sm font-bold text-white">
                  {card.label[0]}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {card.label}
                </p>
                {statsLoading ? (
                  <div className="mt-1 h-7 w-12 animate-pulse rounded bg-gray-200" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Posts Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Posts</h2>
        <PostsTable />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
