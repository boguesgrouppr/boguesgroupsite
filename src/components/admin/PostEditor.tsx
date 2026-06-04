"use client";

import { useState, useCallback, useEffect } from "react";
import slugify from "slugify";
import TiptapEditor from "./TiptapEditor";
import ImageUploader from "./ImageUploader";
import {
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  type EditorBlogPost,
} from "@/hooks/usePosts";
import AiAssistant from "./AiAssistant";
import AiFillButton from "./AiFillButton";

interface PostEditorProps {
  post?: EditorBlogPost | null;
  onSaved?: () => void;
  onDeleted?: () => void;
}

export default function PostEditor({
  post,
  onSaved,
  onDeleted,
}: PostEditorProps) {
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  // Form state
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugManual, setSlugManual] = useState(false);
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    post?.featured_image || null
  );
  const [status, setStatus] = useState<string>(post?.status || "draft");
  const [date, setDate] = useState(
    post?.date
      ? new Date(post.date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [author, setAuthor] = useState(
    typeof post?.author === "string" ? post.author : "Bogues Group"
  );
  const [categories, setCategories] = useState<string>(
    post?.categories?.join(", ") || ""
  );
  const [tags, setTags] = useState<string>(post?.tags?.join(", ") || "");

  // SEO state
  const [seoOpen, setSeoOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(
    post?.meta_description || ""
  );
  const [ogImage, setOgImage] = useState<string | null>(
    post?.og_image || null
  );
  const [h1Override, setH1Override] = useState(post?.h1_override || "");

  // UI state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showAi, setShowAi] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(
        slugify(title, {
          lower: true,
          strict: true,
          trim: true,
        })
      );
    }
  }, [title, slugManual]);

  // Hydrate form when post loads async
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setSlug(post.slug || "");
      setContent(post.content || "");
      setExcerpt(post.excerpt || "");
      setFeaturedImage(post.featured_image || null);
      setStatus(post.status || "draft");
      setDate(
        post.date
          ? new Date(post.date).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      );
      setAuthor(
        typeof post.author === "string" ? post.author : "Bogues Group"
      );
      setCategories(post.categories?.join(", ") || "");
      setTags(post.tags?.join(", ") || "");
      setMetaTitle(post.meta_title || "");
      setMetaDescription(post.meta_description || "");
      setOgImage(post.og_image || null);
      setH1Override(post.h1_override || "");
    }
  }, [post]);

  const buildPayload = useCallback(
    (statusOverride?: string) => {
      const parsedCategories = categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .map(Number)
        .filter((n) => !isNaN(n));

      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map(Number)
        .filter((n) => !isNaN(n));

      return {
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        status: statusOverride || status,
        date: new Date(date).toISOString(),
        author,
        categories: parsedCategories,
        tags: parsedTags,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        og_image: ogImage,
        h1_override: h1Override || null,
      };
    },
    [
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      status,
      date,
      author,
      categories,
      tags,
      metaTitle,
      metaDescription,
      ogImage,
      h1Override,
    ]
  );

  const handleSave = useCallback(
    async (statusOverride?: string) => {
      setSaveMessage(null);
      const payload = buildPayload(statusOverride);

      try {
        if (post?.id) {
          await updatePost.mutateAsync({ id: post.id, ...payload });
          setSaveMessage("Post saved successfully.");
        } else {
          await createPost.mutateAsync(payload);
          setSaveMessage("Post created successfully.");
        }
        if (statusOverride) setStatus(statusOverride);
        onSaved?.();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save post.";
        setSaveMessage(message);
      }
    },
    [post, buildPayload, updatePost, createPost, onSaved]
  );

  const handleDelete = useCallback(async () => {
    if (!post?.id) return;
    try {
      await deletePost.mutateAsync(post.id);
      onDeleted?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete post.";
      setSaveMessage(message);
    }
  }, [post, deletePost, onDeleted]);

  const isSaving =
    createPost.isPending || updatePost.isPending || deletePost.isPending;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content area */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400">Title</span>
            <AiFillButton field="title" currentContent={content} onFill={setTitle} />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            className="w-full text-3xl font-bold text-[#075E8B] border-0 border-b-2 border-gray-200 focus:border-[#D4AF38] focus:ring-0 outline-none pb-2 bg-transparent placeholder:text-gray-300"
          />
        </div>

        {/* Slug */}
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-500">Slug:</label>
            <AiFillButton field="slug" currentTitle={title} onFill={(v) => { setSlugManual(true); setSlug(v); }} />
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              className="flex-1 text-sm text-gray-600 border border-gray-200 rounded px-2 py-1 focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none"
            />
            {slugManual && (
              <button
                type="button"
                onClick={() => {
                  setSlugManual(false);
                  setSlug(
                    slugify(title, { lower: true, strict: true, trim: true })
                  );
                }}
                className="text-xs text-[#075E8B] hover:underline"
              >
                Auto
              </button>
            )}
          </div>
        </div>

        {/* Content editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <button
              type="button"
              onClick={() => setShowAi(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#075E8B] text-white rounded-lg hover:bg-[#064a6e] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Write with AI
            </button>
          </div>
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        {/* Excerpt */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium text-gray-700">Excerpt</label>
            <AiFillButton field="excerpt" currentTitle={title} currentContent={content} onFill={setExcerpt} />
          </div>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Brief summary of the post..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none resize-y"
          />
        </div>

        {/* Featured Image */}
        <ImageUploader
          value={featuredImage}
          onChange={setFeaturedImage}
          label="Featured Image"
        />

        {/* SEO Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setSeoOpen(!seoOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <span className="font-medium text-[#075E8B]">
              SEO Settings
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                seoOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {seoOpen && (
            <div className="p-4 space-y-4">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Meta Title</label>
                    <AiFillButton field="metaTitle" currentTitle={title} currentExcerpt={excerpt} onFill={setMetaTitle} />
                  </span>
                  <span
                    className={`text-xs ${
                      metaTitle.length > 60
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {metaTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO title (defaults to post title)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Meta Description</label>
                    <AiFillButton field="metaDescription" currentTitle={title} currentContent={content} onFill={setMetaDescription} />
                  </span>
                  <span
                    className={`text-xs ${
                      metaDescription.length > 160
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {metaDescription.length}/160
                  </span>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  placeholder="SEO description for search results"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none resize-y"
                />
              </div>

              {/* OG Image */}
              <ImageUploader
                value={ogImage}
                onChange={setOgImage}
                label="OG Image"
              />

              {/* H1 Override */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">H1 Override</label>
                  <AiFillButton field="h1Override" currentTitle={title} currentExcerpt={excerpt} onFill={setH1Override} />
                </div>
                <input
                  type="text"
                  value={h1Override}
                  onChange={(e) => setH1Override(e.target.value)}
                  placeholder="Override the default H1 tag"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium text-gray-700">Categories</label>
            <AiFillButton field="categories" currentTitle={title} currentContent={content} onFill={setCategories} />
          </div>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="Comma-separated category IDs"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter category IDs separated by commas
          </p>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <AiFillButton field="tags" currentTitle={title} currentContent={content} onFill={setTags} />
          </div>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated tag IDs"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter tag IDs separated by commas
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-72 shrink-0 space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 lg:sticky lg:top-4">
          {/* Status toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button
                type="button"
                onClick={() => setStatus("draft")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  status === "draft"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus("publish")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  status === "publish"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Published
              </button>
            </div>
          </div>

          {/* Publish date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#075E8B] focus:ring-1 focus:ring-[#075E8B]/20 outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={isSaving}
              className="w-full py-2.5 text-sm font-medium border border-[#075E8B] text-[#075E8B] rounded-lg hover:bg-[#075E8B]/5 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={() => handleSave("publish")}
              disabled={isSaving}
              className="w-full py-2.5 text-sm font-medium bg-[#D4AF38] text-white rounded-lg hover:bg-[#b8951f] transition-colors disabled:opacity-50"
            >
              {isSaving ? "Publishing..." : "Publish"}
            </button>

            {post?.id && (
              <>
                {showDeleteConfirm ? (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-red-600 text-center">
                      Are you sure? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isSaving}
                        className="flex-1 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-2 text-sm font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2.5 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete Post
                  </button>
                )}
              </>
            )}
          </div>

          {/* Save message */}
          {saveMessage && (
            <p
              className={`text-sm text-center ${
                saveMessage.includes("success") ||
                saveMessage.includes("created")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {saveMessage}
            </p>
          )}
        </div>
      </div>

      {/* AI Assistant */}
      <AiAssistant
        open={showAi}
        onClose={() => setShowAi(false)}
        editorContent={content}
        postTitle={title}
        onInsert={(text) => {
          setContent(content + text);
          setShowAi(false);
        }}
        onInsertTitle={(t) => {
          setTitle(t);
          setShowAi(false);
        }}
        onInsertExcerpt={(e) => {
          setExcerpt(e);
          setShowAi(false);
        }}
        onInsertSeo={(seo) => {
          if (seo.metaTitle) setMetaTitle(seo.metaTitle);
          if (seo.metaDescription) setMetaDescription(seo.metaDescription);
          setShowAi(false);
        }}
      />
    </div>
  );
}
