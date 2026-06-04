"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkAvailability,
  listModels,
  generate as ollamaGenerate,
  generateBlogPost,
  rewriteText,
  suggestTitles,
  suggestExcerpt,
  suggestSeo,
  type OllamaModel,
  type GenerateOptions,
} from "@/lib/ollama";

const DEFAULT_MODEL = "llama3.1:8b";

export interface UseOllamaReturn {
  isAvailable: boolean;
  isGenerating: boolean;
  output: string;
  models: OllamaModel[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  generate: (prompt: string, options?: GenerateOptions) => Promise<void>;
  generateDraft: (topic: string, tone: string, length: string) => Promise<void>;
  rewrite: (text: string, instruction: string) => Promise<void>;
  titles: (content: string) => Promise<void>;
  excerpt: (content: string) => Promise<void>;
  seo: (title: string, content: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export function useOllama(): UseOllamaReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);

  const abortRef = useRef<AbortController | null>(null);

  // Check availability on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const available = await checkAvailability();
      if (cancelled) return;
      setIsAvailable(available);
      if (available) {
        try {
          const list = await listModels();
          if (!cancelled) {
            setModels(list);
            // If the default model is not in the list, pick the first one
            if (list.length > 0 && !list.some((m) => m.name === DEFAULT_MODEL)) {
              setSelectedModel(list[0].name);
            }
          }
        } catch {
          // models fetch failed, leave empty
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const consumeStream = useCallback(async (stream: ReadableStream<string>) => {
    setIsGenerating(true);
    setOutput("");
    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + value);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Ollama stream error:", err);
      }
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generate = useCallback(
    async (prompt: string, options?: GenerateOptions) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const stream = ollamaGenerate(prompt, selectedModel, options, controller.signal);
      await consumeStream(stream);
    },
    [selectedModel, consumeStream]
  );

  const generateDraft = useCallback(
    async (topic: string, tone: string, length: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const stream = generateBlogPost(topic, tone, length, selectedModel, controller.signal);
      await consumeStream(stream);
    },
    [selectedModel, consumeStream]
  );

  const rewrite = useCallback(
    async (text: string, instruction: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const stream = rewriteText(text, instruction, selectedModel, controller.signal);
      await consumeStream(stream);
    },
    [selectedModel, consumeStream]
  );

  const titles = useCallback(
    async (content: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const stream = suggestTitles(content, selectedModel, controller.signal);
      await consumeStream(stream);
    },
    [selectedModel, consumeStream]
  );

  const excerpt = useCallback(
    async (content: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const stream = suggestExcerpt(content, selectedModel, controller.signal);
      await consumeStream(stream);
    },
    [selectedModel, consumeStream]
  );

  const seo = useCallback(
    async (title: string, content: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const stream = suggestSeo(title, content, selectedModel, controller.signal);
      await consumeStream(stream);
    },
    [selectedModel, consumeStream]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
    setOutput("");
  }, []);

  return {
    isAvailable,
    isGenerating,
    output,
    models,
    selectedModel,
    setSelectedModel,
    generate,
    generateDraft,
    rewrite,
    titles,
    excerpt,
    seo,
    stop,
    reset,
  };
}
