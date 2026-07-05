// Talks to OpenRouter, which is an OpenAI-compatible API that can point at
// many different models - including several free ones. Plain fetch calls,
// no SDK, so it's easy to see exactly what's being sent and received.

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// OpenRouter caps the "models" fallback array at 3 entries, so pick 3 that
// cover different providers (if one provider is having a bad day, the
// others likely aren't).
const FALLBACK_MODELS = [
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-120b:free",
];

const MODELS = process.env.OPENROUTER_MODEL
  ? [process.env.OPENROUTER_MODEL, ...FALLBACK_MODELS.filter((m) => m !== process.env.OPENROUTER_MODEL)].slice(0, 3)
  : FALLBACK_MODELS;

function apiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is missing. Add it to server/.env");
  return key;
}

async function callModel(system: string, userMessage: string): Promise<string> {
  // Even with a fallback list, it's possible every model in it is briefly
  // busy at once. Retry the whole request a couple of times with a short
  // pause before giving up, since free-tier congestion is usually short-lived.
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey()}`,
        // OpenRouter asks for these two so it can show your app on their
        // dashboard - they're optional but harmless to include.
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Reel to Notes",
      },
      body: JSON.stringify({
        models: MODELS, // priority list - OpenRouter fails over between these
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("The model returned an empty response. Try again.");
      return content;
    }

    const isRateLimited = res.status === 429;
    const isLastAttempt = attempt === MAX_ATTEMPTS;
    const detail = await res.text();

    if (!isRateLimited || isLastAttempt) {
      throw new Error(`OpenRouter error (${res.status}): ${detail}`);
    }

    // Honor the server's requested wait time when it gives one, otherwise
    // just wait a bit longer on each retry.
    const waitSeconds = extractRetryAfterSeconds(detail) ?? attempt * 2;
    await sleep(waitSeconds * 1000);
  }

  throw new Error("OpenRouter kept rate-limiting every free model. Try again in a minute.");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// The 429 body OpenRouter sends includes a retry_after_seconds field buried
// in its metadata - this pulls it out if present.
function extractRetryAfterSeconds(errorBody: string): number | null {
  try {
    const parsed = JSON.parse(errorBody);
    const seconds = parsed?.error?.metadata?.retry_after_seconds;
    return typeof seconds === "number" ? seconds : null;
  } catch {
    return null;
  }
}

export interface StudyMaterial {
  shortSummary: string;
  bulletSummary: string[];
  keyConcepts: { term: string; definition: string }[];
  flashcards: { front: string; back: string }[];
  quiz: { question: string; options: string[]; answerIndex: number; explanation: string }[];
  timestamps: { time: string; label: string }[];
}

const ANALYZE_SYSTEM = `You turn a YouTube video transcript into study material for a student.
Read the transcript (it has [MM:SS] timestamp markers sprinkled through it) and respond with
ONLY a single JSON object. Nothing else: no markdown fences, no "here is your JSON", no
closing remarks - your entire reply must start with { and end with }. It must match exactly
this shape:

{
  "shortSummary": "5-8 sentence plain-language summary",
  "bulletSummary": ["short bullet point", "..."],
  "keyConcepts": [{ "term": "...", "definition": "1-2 sentence definition" }],
  "flashcards": [{ "front": "question", "back": "answer" }],
  "quiz": [{ "question": "...", "options": ["a","b","c","d"], "answerIndex": 0, "explanation": "..." }],
  "timestamps": [{ "time": "MM:SS", "label": "what happens here" }]
}

Aim for 5-8 key concepts, 8-12 flashcards, 5 quiz questions, and 6-10 timestamps pulled
from the markers already in the transcript. Keep everything concise and student-friendly.`;

export async function analyzeTranscript(transcript: string, title: string): Promise<StudyMaterial> {
  // Free models are smaller and chattier than a flagship one - they'll
  // sometimes add a sentence before/after the JSON even when told not to.
  // We ask twice as hard, then defensively extract just the {...} block.
  const raw = await callModel(
    ANALYZE_SYSTEM,
    `Video title: ${title}\n\nTranscript:\n${transcript.slice(0, 20000)}`
  );
  try {
    return JSON.parse(extractJson(raw));
  } catch {
    throw new Error(
      "The free model didn't return valid JSON this time. This happens more often on " +
        "free-tier models - try again, or try a different OPENROUTER_MODEL in .env."
    );
  }
}

export async function askQuestion(transcript: string, question: string): Promise<string> {
  return callModel(
    `You answer questions using ONLY the given video transcript. If the transcript doesn't
     cover the answer, say so honestly instead of guessing. Keep answers short and direct,
     and reference a timestamp marker like [MM:SS] when it helps.`,
    `Transcript:\n${transcript.slice(0, 20000)}\n\nQuestion: ${question}`
  );
}

// Pulls out the first {...} block, ignoring any stray commentary or
// ```json fences a smaller model might wrap around it.
function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return text;
  return text.slice(start, end + 1);
}
