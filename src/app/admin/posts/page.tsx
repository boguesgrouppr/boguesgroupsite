"use client";

import ProtectedRoute from "@/components/admin/ProtectedRoute";
import PostsTable from "@/components/admin/PostsTable";

function PostsListContent() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">All Posts</h1>
      <PostsTable />
    </div>
  );
}

export default function PostsListPage() {
  return (
    <ProtectedRoute>
      <PostsListContent />
    </ProtectedRoute>
  );
}
