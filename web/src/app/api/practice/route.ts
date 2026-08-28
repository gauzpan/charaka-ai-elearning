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
// Explicit, rather than relying on the platform default — comfortably above
// OPENROUTER_TIMEOUT_MS below so a slow-but-eventually-successful upstream
// call isn't cut off by the function itself first.
export const maxDuration = 30;

const MODEL = "nvidia/nemotron-3.5-lightning:free";

const MODELS = ["nvidia/nemotron-3.5-lightning:free",
            "google/gemma-4-26b-a4b-it:free",
            "minimax/minimax-m2.7:free",
        ];
// The free-tier model can queue/hang upstream with no signal back — bound it
// so the request fails clearly instead of hanging until the platform kills
// the function (which is what "pending forever" in the client looks like).
const OPENROUTER_TIMEOUT_MS = 25_000;

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
  // NOT awaited: this used to block the whole request on a DB round-trip
  // before the actual sandbox call even started — a real bug (analytics must
  // never affect app UX, and a slow/pool-exhausted DB in prod turned that
  // into the entire route hanging). Runs concurrently with the OpenRouter
  // call instead; any failure here is swallowed, never surfaced to the user.
  void (async () => {
    try {
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
    } catch (err) {
      console.error("[practice] analytics lookup failed", err);
    }
  })();

  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_KEY,
    // The SDK's own default timeout is 10 minutes and it retries on timeout
    // by default — either alone can make a stuck upstream look "pending
    // forever" to the user. maxRetries: 0 because a timeout retry just
    // doubles the wait before the same "Run again" button the UI already
    // offers; no point retrying automatically first.
    timeout: OPENROUTER_TIMEOUT_MS,
    maxRetries: 0,
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
      models: MODELS,
   
      max_tokens: 10000,
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
    if (err instanceof OpenAI.APIConnectionTimeoutError) {
      return Response.json(
        {
          error: "timeout",
          message: "The model took too long to respond. Try again — the free-tier model can be slow under load.",
        },
        { status: 504 },
      );
    }
    if (err instanceof OpenAI.APIError) {
      return Response.json(
        { error: "upstream", message: err.message },
        { status: 502 },
      );
    }
    return Response.json({ error: "unknown" }, { status: 500 });
  }
}
