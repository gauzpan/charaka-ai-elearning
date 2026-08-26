import OpenAI from "openai";
import { z } from "zod";
import { getPracticeContext } from "@/lib/practiceContext";
import { getUserIdOrNull } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trackSandboxPromptSubmitted } from "@/lib/analytics";

// The hypothesis-critical practice loop (build-plan Phase 6). Server-side only:
// the OpenRouter key never reaches the browser. Injects a SYNTHETIC abstract +
// the user's prompt and returns the model's output. No real patient data.
// Inference runs through OpenRouter (OpenAI-compatible API).
export const runtime = "nodejs";

const MODEL = "nvidia/nemotron-3.5-lightning:free";

const Body = z.object({
  taskId: z.string().min(1),
  prompt: z.string().min(1).max(4000),
});

const SYSTEM =
  "You are a general-purpose AI assistant a physician is practicing with. You are given a SYNTHETIC, fictional research abstract that contains no real patient data. Answer the physician's prompt using only the abstract provided. Be concise and clinical. Be honest about limitations, and if the prompt asks you to flag uncertainty, verify claims, or note what to check, do so plainly.";

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_KEY) {
    return Response.json(
      {
        error: "not_configured",
        message:
          "The live sandbox isn't configured yet. Add OPENROUTER_KEY to web/.env.local to run real practice.",
      },
      { status: 503 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const ctx = getPracticeContext(parsed.data.taskId);
  if (!ctx) {
    return Response.json({ error: "unknown_task" }, { status: 404 });
  }

  // Fire where the call genuinely "initiates" from the backend's view — no
  // auth is required to use the sandbox API itself, so this degrades to an
  // "anonymous" distinct_id rather than gating the route just for analytics.
  const userId = await getUserIdOrNull();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
    : null;
  trackSandboxPromptSubmitted({
    userId: userId ?? "anonymous",
    userAgent: req.headers.get("user-agent"),
    userRole: user?.role,
    lessonId: parsed.data.taskId,
  });

  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_KEY,
  });

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content: `Synthetic context (${ctx.title}):\n${ctx.abstract}\n\n---\nMy prompt:\n${parsed.data.prompt}`,
    },
  ];

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 3000,
      messages,
      // OpenRouter reasoning extension (not in the base OpenAI types).
      reasoning: { enabled: false },
    } as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming);

    const choice = completion.choices?.[0];
    const output = choice?.message?.content?.trim() ?? "";

    // Surface inference issues that still returned a 200 — chiefly truncation
    // when the response hit the max_tokens ceiling (finish_reason "length").
    let notice: string | null = null;
    switch (choice?.finish_reason) {
      case "length":
        notice =
          "Output was cut off at the length limit. Ask for less, or split it into steps.";
        break;
      case "content_filter":
        notice = "Part of the response was filtered by the provider.";
        break;
      default:
        if (!output) {
          notice = "The model returned an empty response. Try rephrasing your prompt.";
        }
    }

    return Response.json({ output, notice });
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      return Response.json(
        { error: "upstream", message: err.message },
        { status: 502 },
      );
    }
    return Response.json({ error: "unknown" }, { status: 500 });
  }
}
