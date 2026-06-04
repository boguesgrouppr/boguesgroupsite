"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAllPosts, useDeletePost, useUpdatePost } from "@/hooks/usePosts";

type SortField = "date" | "view_count" | "title";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "publish" | "draft" | "hidden" | "scheduled" | "archived";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  publish: { label: "Published", bg: "bg-green-100", text: "text-green-700" },
  draft: { label: "Draft", bg: "bg-yellow-100", text: "text-yellow-700" },
  hidden: { label: "Hidden", bg: "bg-gray-100", text: "text-gray-600" },
  scheduled: { label: "Scheduled", bg: "bg-blue-100", text: "text-blue-700" },
  archived: { label: "Archived", bg: "bg-red-100", text: "text-red-600" },
};

function getStatusDisplay(status: string) {
  return STATUS_CONFIG[status] || { label: status, bg: "bg-gray-100", text: "text-gray-600" };
}

export default function PostsTable() {
  const router = useRouter();
  const { data: posts, isLoading, error } = useAllPosts();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusMenuId, setStatusMenuId] = useState<number | null>(null);

  const statusCounts = useMemo(() => {
    if (!posts) return { all: 0, publish: 0, draft: 0, hidden: 0, scheduled: 0, archived: 0 };
    const counts = { all: posts.length, publish: 0, draft: 0, hidden: 0, scheduled: 0, archived: 0 };
    posts.forEach((p) => {
      const s = p.status as keyof typeof counts;
      if (s in counts) counts[s]++;
      else counts.draft++; // treat unknown statuses as draft
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let result = posts;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortField === "title") {
        const titleA = (a.title || "").toLowerCase();
        const titleB = (b.title || "").toLowerCase();
        return sortDir === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      }
      if (sortField === "date") {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return sortDir === "asc" ? dateA - dateB : dateB - dateA;
      }
      const viewsA = a.view_count || 0;
      const viewsB = b.view_count || 0;
      return sortDir === "asc" ? viewsA - viewsB : viewsB - viewsA;
    });

    return result;
  }, [posts, search, statusFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost.mutateAsync(id);
      setDeletingId(null);
    } catch {
      // Error handled by react-query
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updatePost.mutateAsync({ id, status: newStatus } as any);
      setStatusMenuId(null);
    } catch {
      // Error handled by react-query
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <svg
      className={`w-3.5 h-3.5 inline-block ml-1 ${
        sortField === field ? "text-[#075E8B]" : "text-gray-400"
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={
          sortField === field && sortDir === "asc"
            ? "M5 15l7-7 7 7"
            : "M19 9l-7 7-7-7"
        }
      />
    </svg>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#075E8B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-2">Failed to load posts.</p>
        <p className="text-sm text-gray-400">Check the browser console for details.</p>
      </div>
    );
  }

  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: `All (${statusCounts.all})` },
    { key: "publish", label: `Published (${statusCounts.publish})` },
    { key: "draft", label: `Drafts (${statusCounts.draft})` },
    { key: "scheduled", label: `Scheduled (${statusCounts.scheduled})` },
    { key: "hidden", label: `Hidden (${statusCounts.hidden})` },
    { key: "archived", label: `Archived (${statusCounts.archived})` },
  ];

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200 pb-3">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              statusFilter === tab.key
                ? "bg-[#075E8B] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and new post */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none"
          />
        </div>

        <button
          onClick={() => router.push("/admin/posts/new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF38] text-white text-sm font-medium rounded-lg hover:bg-[#b8951f] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        Showing {filteredPosts.length} of {posts?.length || 0} posts
      </p>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th
                  className="text-left px-4 py-3 font-medium text-gray-700 cursor-pointer select-none hover:text-[#075E8B]"
                  onClick={() => toggleSort("title")}
                >
                  Title
                  <SortIcon field="title" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-32">
                  Status
                </th>
                <th
                  className="text-left px-4 py-3 font-medium text-gray-700 cursor-pointer select-none hover:text-[#075E8B] w-32"
                  onClick={() => toggleSort("date")}
                >
                  Date
                  <SortIcon field="date" />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium text-gray-700 cursor-pointer select-none hover:text-[#075E8B] w-20"
                  onClick={() => toggleSort("view_count")}
                >
                  Views
                  <SortIcon field="view_count" />
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-700 w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    {search ? "No posts match your search." : "No posts with this status."}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const statusDisplay = getStatusDisplay(post.status || "draft");
                  return (
                    <tr
                      key={post.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/admin/posts/edit?id=${post.id}`)}
                          className="text-left font-medium text-[#075E8B] hover:underline block"
                        >
                          {post.title || "Untitled"}
                        </button>
                        <span className="text-xs text-gray-400">/{post.slug}</span>
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setStatusMenuId(statusMenuId === post.id ? null : post.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${statusDisplay.bg} ${statusDisplay.text}`}
                        >
                          {statusDisplay.label}
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {/* Status dropdown */}
                        {statusMenuId === post.id && (
                          <div className="absolute top-full left-4 mt-1 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                              <button
                                key={key}
                                onClick={() => handleStatusChange(post.id, key)}
                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2 ${
                                  post.status === key ? "font-semibold" : ""
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${cfg.bg.replace("100", "500")}`} />
                                {cfg.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {post.date ? formatDate(post.date) : "No date"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {post.view_count ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {deletingId === post.id ? (
                          <div className="inline-flex items-center gap-2">
                            <span className="text-xs text-red-600">Delete?</span>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="text-xs font-medium text-red-600 hover:text-red-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="text-xs font-medium text-gray-500 hover:text-gray-700"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-3">
                            <button
                              onClick={() => router.push(`/admin/posts/edit?id=${post.id}`)}
                              className="text-gray-400 hover:text-[#075E8B] transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeletingId(post.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
