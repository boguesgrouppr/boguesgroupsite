/**
 * Ollama API helper for the Bogues Group AI writing assistant.
 *
 * Expects Ollama running locally at http://localhost:11434.
 * Default model: llama3.1:8b
 */

const OLLAMA_BASE = "http://localhost:11434";
const DEFAULT_MODEL = "llama3.1:8b";

// Cloudflare Workers AI fallback
const CF_AI_URL = "https://bogues-ai-writer.chase-c7a.workers.dev";
const CF_AI_KEY = "bg-ai-2026-writer";

// ---- Shared system context injected into every prompt ----

const BOGUES_CONTEXT = `You are a writing assistant for The Bogues Group, a Charlotte-based public relations and communications firm led by Brittney Bogues, daughter of NBA legend Muggsy Bogues. The firm specializes in public relations, crisis management, marketing, branding, events, and digital strategy. Their clients span sports, entertainment, hospitality, nonprofits, and wellness industries. Write with confidence and polish. Avoid cliches. Never use em dashes or en dashes.`;

// ---- Types ----

export interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
}

export interface GenerateOptions {
  temperature?: number;
  top_p?: number;
  num_predict?: number;
  system?: string;
}

// ---- Low-level helpers ----

/**
 * Check whether Ollama is reachable locally.
 */
export async function checkOllamaLocal(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Check whether AI is available (local Ollama or Cloudflare Worker).
 * Always returns true since the Cloudflare Worker is always available.
 */
export async function checkAvailability(): Promise<boolean> {
  return true;
}

/**
 * Generate text using Cloudflare Workers AI (non-streaming fallback).
 */
export async function generateViaWorker(prompt: string, system?: string): Promise<string> {
  const res = await fetch(CF_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CF_AI_KEY}`,
    },
    body: JSON.stringify({ prompt, system }),
  });
  if (!res.ok) throw new Error(`AI worker error: ${res.status}`);
  const data = await res.json();
  return (data as { text: string }).text || "";
}

/**
 * List models installed in Ollama.
 */
export async function listModels(): Promise<OllamaModel[]> {
  const res = await fetch(`${OLLAMA_BASE}/api/tags`);
  if (!res.ok) throw new Error("Failed to list Ollama models");
  const json = await res.json();
  return (json.models ?? []) as OllamaModel[];
}

/**
 * Stream tokens from Ollama /api/generate.
 *
 * Returns a ReadableStream<string> that yields text chunks as they arrive.
 * The caller can also pass an AbortSignal to cancel mid-stream.
 */
export function generate(
  prompt: string,
  model: string = DEFAULT_MODEL,
  options: GenerateOptions = {},
  signal?: AbortSignal
): ReadableStream<string> {
  const { system, temperature = 0.7, top_p = 0.9, num_predict = 2048 } = options;

  return new ReadableStream<string>({
    async start(controller) {
      try {
        const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            prompt,
            system: system ?? BOGUES_CONTEXT,
            stream: true,
            options: { temperature, top_p, num_predict },
          }),
          signal,
        });

        if (!res.ok || !res.body) {
          controller.error(new Error(`Ollama returned ${res.status}`));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          // Ollama streams newline-delimited JSON objects
          for (const line of text.split("\n")) {
            if (!line.trim()) continue;
            try {
              const obj = JSON.parse(line);
              if (obj.response) {
                controller.enqueue(obj.response);
              }
              if (obj.done) {
                controller.close();
                return;
              }
            } catch {
              // partial JSON line, skip
            }
          }
        }
        controller.close();
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          controller.close();
        } else {
          controller.error(err);
        }
      }
    },
  });
}

// ---- High-level helpers ----

const TONE_MAP: Record<string, string> = {
  professional:
    "Write in a polished, professional tone suitable for business communications and press releases.",
  casual:
    "Write in a warm, approachable, conversational tone while remaining credible and knowledgeable.",
  authoritative:
    "Write in a commanding, authoritative tone that positions the Bogues Group as an industry leader.",
};

const LENGTH_MAP: Record<string, number> = {
  short: 600,
  medium: 1200,
  long: 2400,
};

/**
 * Generate a blog post draft.
 */
export function generateBlogPost(
  topic: string,
  tone: string = "professional",
  length: string = "medium",
  model: string = DEFAULT_MODEL,
  signal?: AbortSignal
): ReadableStream<string> {
  const toneInstruction = TONE_MAP[tone] ?? TONE_MAP.professional;
  const wordTarget = LENGTH_MAP[length] ?? LENGTH_MAP.medium;

  const prompt = `Write a blog post about: ${topic}

${toneInstruction}

Target length: approximately ${wordTarget} words.

Structure the post with a compelling headline, an engaging opening, clear subheadings, and a strong closing paragraph with a call to action. Write from the perspective of The Bogues Group. Do not include meta-commentary about the writing process.`;

  return generate(prompt, model, { num_predict: wordTarget * 2, system: BOGUES_CONTEXT }, signal);
}

/**
 * Rewrite text based on an instruction.
 */
export function rewriteText(
  text: string,
  instruction: string,
  model: string = DEFAULT_MODEL,
  signal?: AbortSignal
): ReadableStream<string> {
  const prompt = `Here is the original text:

---
${text}
---

Instruction: ${instruction}

Rewrite the text following the instruction above. Output only the rewritten text with no preamble or explanation.`;

  return generate(prompt, model, { system: BOGUES_CONTEXT }, signal);
}

/**
 * Suggest 5 title options for given content.
 */
export function suggestTitles(
  content: string,
  model: string = DEFAULT_MODEL,
  signal?: AbortSignal
): ReadableStream<string> {
  const prompt = `Based on the following blog post content, suggest exactly 5 compelling title options. Each title should be concise (under 80 characters), engaging, and optimized for both readers and search engines.

Content:
---
${content.slice(0, 3000)}
---

Return only the 5 titles, numbered 1 through 5, one per line. No extra commentary.`;

  return generate(prompt, model, { num_predict: 512, system: BOGUES_CONTEXT }, signal);
}

/**
 * Generate a concise excerpt from content.
 */
export function suggestExcerpt(
  content: string,
  model: string = DEFAULT_MODEL,
  signal?: AbortSignal
): ReadableStream<string> {
  const prompt = `Write a concise, compelling excerpt (2-3 sentences, under 160 characters if possible) for the following blog post content. The excerpt should entice readers to click and read the full article.

Content:
---
${content.slice(0, 3000)}
---

Return only the excerpt text with no preamble.`;

  return generate(prompt, model, { num_predict: 256, system: BOGUES_CONTEXT }, signal);
}

/**
 * Generate SEO meta title and meta description suggestions.
 */
export function suggestSeo(
  title: string,
  content: string,
  model: string = DEFAULT_MODEL,
  signal?: AbortSignal
): ReadableStream<string> {
  const prompt = `Given this blog post title and content, generate SEO suggestions.

Title: ${title}
Content (truncated):
---
${content.slice(0, 2000)}
---

Provide:
1. Meta Title (under 60 characters, includes primary keyword)
2. Meta Description (under 155 characters, includes a call to action)

Format your response exactly as:
META TITLE: [your suggestion]
META DESCRIPTION: [your suggestion]

No other text.`;

  return generate(prompt, model, { num_predict: 256, system: BOGUES_CONTEXT }, signal);
}
