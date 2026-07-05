import { Router } from "express";
import { extractVideoId, fetchMetadata, fetchTranscript, formatTranscript } from "./youtube.js";
import { analyzeTranscript, askQuestion } from "./ai.js";

export const router = Router();

// One endpoint that does the whole "video URL -> study material" pipeline.
router.post("/analyze", async (req, res) => {
  try {
    const { url } = req.body as { url?: string };
    if (!url) return res.status(400).json({ error: "Missing 'url' in request body." });

    const videoId = extractVideoId(url);
    if (!videoId) return res.status(400).json({ error: "That doesn't look like a YouTube URL." });

    const meta = await fetchMetadata(videoId);
    const lines = await fetchTranscript(videoId);
    if (lines.length === 0) {
      return res.status(422).json({ error: "This video has no captions available." });
    }
    const transcript = formatTranscript(lines);

    const material = await analyzeTranscript(transcript, meta.title);

    res.json({ meta, transcript, material });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// Ask-a-question endpoint. The frontend sends back the transcript it already
// has, so the server doesn't need to store anything.
router.post("/ask", async (req, res) => {
  try {
    const { transcript, question } = req.body as { transcript?: string; question?: string };
    if (!transcript || !question) {
      return res.status(400).json({ error: "Missing 'transcript' or 'question'." });
    }
    const answer = await askQuestion(transcript, question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
});
