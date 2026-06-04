"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import PostEditor from "@/components/admin/PostEditor";
import { usePost } from "@/hooks/usePosts";

function EditPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const id = idParam ? parseInt(idParam, 10) : null;

  const { data: post, isLoading, error } = usePost(id);

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">No post ID provided.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Post not found.</p>
      </div>
    );
  }

  return (
    <PostEditor
      post={post}
      onSaved={() => {
        // Stay on the page -- success message is shown in PostEditor
      }}
      onDeleted={() => router.push("/admin")}
    />
  );
}

function EditPostContent() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Edit Post</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy border-t-transparent" />
          </div>
        }
      >
        <EditPostForm />
      </Suspense>
    </div>
  );
}

export default function EditPost() {
  return (
    <ProtectedRoute>
      <EditPostContent />
    </ProtectedRoute>
  );
}
