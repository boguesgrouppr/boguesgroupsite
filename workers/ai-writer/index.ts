export interface Env {
  AI: Ai;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Simple API key for auth - matches what the admin panel sends
const API_KEY = "bg-ai-2026-writer";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    // Check API key
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${API_KEY}`) {
      return new Response("Unauthorized", { status: 401, headers: CORS_HEADERS });
    }

    try {
      const body = (await request.json()) as {
        prompt: string;
        system?: string;
        stream?: boolean;
      };

      if (!body.prompt) {
        return new Response(JSON.stringify({ error: "prompt is required" }), {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      const messages = [];

      if (body.system) {
        messages.push({ role: "system", content: body.system });
      } else {
        messages.push({
          role: "system",
          content:
            "You are a writing assistant for Bogues Group, a Charlotte NC PR and communications firm led by Brittney Bogues. Write professional, engaging content. Be concise and follow the instructions exactly. Output only what is asked for, no preamble or explanation.",
        });
      }

      messages.push({ role: "user", content: body.prompt });

      if (body.stream) {
        // Streaming response
        const stream = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages,
          stream: true,
        });

        return new Response(stream as ReadableStream, {
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      } else {
        // Non-streaming response
        const result = (await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages,
          stream: false,
        })) as { response: string };

        return new Response(
          JSON.stringify({ text: result.response }),
          {
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          }
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return new Response(
        JSON.stringify({ error: message }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }
  },
};
