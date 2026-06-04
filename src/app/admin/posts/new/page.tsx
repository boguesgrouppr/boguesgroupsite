"use client";

import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import PostEditor from "@/components/admin/PostEditor";

function NewPostContent() {
  const router = useRouter();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">New Post</h1>
      <PostEditor onSaved={() => router.push("/admin")} />
    </div>
  );
}

export default function NewPost() {
  return (
    <ProtectedRoute>
      <NewPostContent />
    </ProtectedRoute>
  );
}
