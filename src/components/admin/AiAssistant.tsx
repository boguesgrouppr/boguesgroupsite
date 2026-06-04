"use client";

import { useCallback, useMemo, useState } from "react";
import { useOllama } from "@/hooks/useOllama";

// ---- Types ----

type Mode = "draft" | "rewrite" | "titles" | "excerpt" | "seo";

export interface AiAssistantProps {
  /** Whether the panel is open */
  open: boolean;
  /** Close the panel */
  onClose: () => void;
  /** Insert generated text into the editor body */
  onInsert?: (text: string) => void;
  /** Insert a suggested title */
  onInsertTitle?: (title: string) => void;
  /** Insert a suggested excerpt */
  onInsertExcerpt?: (excerpt: string) => void;
  /** Insert SEO suggestions */
  onInsertSeo?: (seo: { metaTitle: string; metaDescription: string }) => void;
  /** Current editor content (used by titles/excerpt/seo modes) */
  editorContent?: string;
  /** Current post title (used by SEO mode) */
  postTitle?: string;
  /** Selected text from the editor (used by rewrite mode) */
  selectedText?: string;
}

// ---- Constants ----

const MODES: { key: Mode; label: string }[] = [
  { key: "draft", label: "Generate Draft" },
  { key: "rewrite", label: "Rewrite" },
  { key: "titles", label: "Suggest Titles" },
  { key: "excerpt", label: "Suggest Excerpt" },
  { key: "seo", label: "SEO" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "authoritative", label: "Authoritative" },
];

const LENGTHS = [
  { value: "short", label: "Short (~300 words)" },
  { value: "medium", label: "Medium (~600 words)" },
  { value: "long", label: "Long (~1200 words)" },
];

// ---- Component ----

export default function AiAssistant({
  open,
  onClose,
  onInsert,
  onInsertTitle,
  onInsertExcerpt,
  onInsertSeo,
  editorContent = "",
  postTitle = "",
  selectedText = "",
}: AiAssistantProps) {
  const {
    isAvailable,
    isGenerating,
    output,
    models,
    selectedModel,
    setSelectedModel,
    generateDraft,
    rewrite,
    titles,
    excerpt,
    seo,
    stop,
    reset,
  } = useOllama();

  const [mode, setMode] = useState<Mode>("draft");

  // Draft mode state
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");

  // Rewrite mode state
  const [rewriteInstruction, setRewriteInstruction] = useState("");

  // ---- Handlers ----

  const handleGenerate = useCallback(async () => {
    switch (mode) {
      case "draft":
        if (!topic.trim()) return;
        await generateDraft(topic, tone, length);
        break;
      case "rewrite":
        if (!selectedText && !editorContent) return;
        await rewrite(selectedText || editorContent, rewriteInstruction || "Improve clarity and flow");
        break;
      case "titles":
        if (!editorContent) return;
        await titles(editorContent);
        break;
      case "excerpt":
        if (!editorContent) return;
        await excerpt(editorContent);
        break;
      case "seo":
        if (!editorContent) return;
        await seo(postTitle || "Untitled", editorContent);
        break;
    }
  }, [mode, topic, tone, length, selectedText, editorContent, rewriteInstruction, postTitle, generateDraft, rewrite, titles, excerpt, seo]);

  const handleInsert = useCallback(() => {
    if (!output.trim()) return;
    if (mode === "titles" && onInsertTitle) {
      // Already handled per-line via click
      onInsert?.(output);
    } else if (mode === "excerpt" && onInsertExcerpt) {
      onInsertExcerpt(output.trim());
    } else if (mode === "seo" && onInsertSeo) {
      const metaTitle = output.match(/META TITLE:\s*(.+)/i)?.[1]?.trim() ?? "";
      const metaDescription = output.match(/META DESCRIPTION:\s*(.+)/i)?.[1]?.trim() ?? "";
      onInsertSeo({ metaTitle, metaDescription });
    } else {
      onInsert?.(output);
    }
  }, [output, mode, onInsert, onInsertTitle, onInsertExcerpt, onInsertSeo]);

  const handleCopy = useCallback(() => {
    if (output) navigator.clipboard.writeText(output);
  }, [output]);

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      reset();
    },
    [reset]
  );

  // Parse title suggestions into clickable items
  const parsedTitles = useMemo(() => {
    if (mode !== "titles" || !output) return [];
    return output
      .split("\n")
      .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter((line) => line.length > 0);
  }, [mode, output]);

  // ---- Render helpers ----

  const renderModeContent = () => {
    switch (mode) {
      case "draft":
        return (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-navy-700">Topic</span>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How PR strategy drives growth for Charlotte small businesses"
                rows={3}
                className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-navy-700">Tone</span>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                >
                  {TONES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-navy-700">Length</span>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                >
                  {LENGTHS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        );

      case "rewrite":
        return (
          <div className="flex flex-col gap-3">
            {selectedText ? (
              <div className="rounded-lg border border-navy-100 bg-navy-50 p-3">
                <span className="mb-1 block text-xs font-medium text-navy-600">Selected text</span>
                <p className="text-sm text-gray-700 line-clamp-4">{selectedText}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No text selected. The full editor content will be used.
              </p>
            )}
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-navy-700">Instruction</span>
              <textarea
                value={rewriteInstruction}
                onChange={(e) => setRewriteInstruction(e.target.value)}
                placeholder="e.g. Make it more concise, add a stronger opening hook"
                rows={2}
                className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
              />
            </label>
          </div>
        );

      case "titles":
        return (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Generate 5 title suggestions based on your current post content.
            </p>
            {!editorContent && (
              <p className="text-sm text-amber-600">
                Your editor is empty. Add some content first for better suggestions.
              </p>
            )}
          </div>
        );

      case "excerpt":
        return (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Auto-generate a concise excerpt from your current post content.
            </p>
            {!editorContent && (
              <p className="text-sm text-amber-600">
                Your editor is empty. Add some content first.
              </p>
            )}
          </div>
        );

      case "seo":
        return (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Generate meta title and description optimized for search engines.
            </p>
            {postTitle && (
              <div className="rounded-lg border border-navy-100 bg-navy-50 p-3">
                <span className="mb-1 block text-xs font-medium text-navy-600">Current title</span>
                <p className="text-sm text-gray-700">{postTitle}</p>
              </div>
            )}
            {!editorContent && (
              <p className="text-sm text-amber-600">
                Your editor is empty. Add some content first.
              </p>
            )}
          </div>
        );
    }
  };

  const renderOutput = () => {
    if (!output && !isGenerating) return null;

    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-navy-700">Output</span>

        {/* Title suggestions get special clickable treatment */}
        {mode === "titles" && parsedTitles.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {parsedTitles.map((title, i) => (
              <button
                key={i}
                onClick={() => onInsertTitle?.(title)}
                className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-left text-sm text-gray-800 transition-colors hover:border-gold hover:bg-gold-50"
              >
                {title}
              </button>
            ))}
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto rounded-lg border border-navy-200 bg-white p-3">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {output}
              {isGenerating && (
                <span className="inline-block h-4 w-1.5 animate-pulse bg-gold ml-0.5 align-middle" />
              )}
            </pre>
          </div>
        )}
      </div>
    );
  };

  // ---- Main render ----

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out panel */}
      <div className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-navy-200 bg-gray-50 shadow-2xl animate-[slideInRight_250ms_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-200 bg-navy px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
            <h2 className="text-base font-semibold text-white">AI Writing Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-navy-200 transition-colors hover:bg-navy-dark hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Unavailable state */}
        {!isAvailable ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-50">
              <svg
                className="h-7 w-7 text-navy-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-navy-700">Ollama not detected</p>
              <p className="mt-1 text-sm text-gray-500">
                AI assistant requires Ollama running locally. Start it with:
              </p>
              <code className="mt-2 inline-block rounded bg-navy-50 px-3 py-1.5 text-sm font-mono text-navy">
                ollama serve
              </code>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Mode tabs */}
            <div className="flex gap-0 overflow-x-auto border-b border-navy-200 bg-white px-2 pt-2">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => handleModeChange(m.key)}
                  className={`shrink-0 rounded-t-lg px-3 py-2 text-xs font-medium transition-colors ${
                    mode === m.key
                      ? "border border-b-0 border-navy-200 bg-gray-50 text-navy"
                      : "text-gray-500 hover:text-navy-700"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                {/* Model selector */}
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-500">Model</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-sm text-gray-800 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                  >
                    {models.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Mode-specific inputs */}
                {renderModeContent()}

                {/* Generate / Stop button */}
                <div className="flex gap-2">
                  {isGenerating ? (
                    <button
                      onClick={stop}
                      className="flex-1 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={handleGenerate}
                      disabled={
                        (mode === "draft" && !topic.trim()) ||
                        ((mode === "titles" || mode === "excerpt" || mode === "seo") && !editorContent)
                      }
                      className="flex-1 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Generate
                    </button>
                  )}
                  {output && !isGenerating && (
                    <button
                      onClick={reset}
                      className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Output area */}
                {renderOutput()}

                {/* Action buttons for output */}
                {output && !isGenerating && mode !== "titles" && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleInsert}
                      className="flex-1 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:bg-gold-light"
                    >
                      {mode === "excerpt"
                        ? "Use as Excerpt"
                        : mode === "seo"
                          ? "Apply SEO Suggestions"
                          : "Insert into Editor"}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
