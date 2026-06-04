"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/content";

// Extended BlogPost with optional SEO fields the editor uses.
// The author field is stored as a string in the DB (author name),
// but the WP interface typed it as number. We override it here.
export interface EditorBlogPost extends Omit<BlogPost, "author"> {
  author: string | number;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
  h1_override?: string | null;
  view_count?: number;
}

export function useAllPosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          "id, title, slug, status, date, view_count, excerpt, featured_image"
        )
        .order("date", { ascending: false });

      if (error) throw error;
      return data as EditorBlogPost[];
    },
  });
}

export function usePost(id: number | null) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as EditorBlogPost;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Partial<EditorBlogPost>) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data as EditorBlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<EditorBlogPost> & { id: number }) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as EditorBlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
