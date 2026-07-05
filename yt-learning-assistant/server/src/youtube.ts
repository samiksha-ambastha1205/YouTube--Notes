// All the "talk to YouTube" logic lives here, kept separate from server.ts
// so each file only does one job.

import { YoutubeTranscript } from "youtube-transcript";

export interface VideoMeta {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
}

export interface TranscriptLine {
  text: string;
  start: number; // seconds
}

// Pulls the 11-character video ID out of any common YouTube URL shape.
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// oEmbed is a free, no-API-key endpoint YouTube provides for basic info.
export async function fetchMetadata(videoId: string): Promise<VideoMeta> {
  const res = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  );
  if (!res.ok) throw new Error("Could not fetch video info. Is the URL correct and public?");
  const data = (await res.json()) as { title: string; author_name: string; thumbnail_url: string };
  return {
    videoId,
    title: data.title,
    channel: data.author_name,
    thumbnail: data.thumbnail_url,
  };
}

// Fetches the auto-generated / uploaded captions for a video.
export async function fetchTranscript(videoId: string): Promise<TranscriptLine[]> {
  const raw = await YoutubeTranscript.fetchTranscript(videoId);
  return raw.map((line) => ({
    text: line.text,
    start: Math.floor(line.offset / 1000),
  }));
}

// Turns [{text, start}] into one plain-text block with timestamp markers
// every ~30s, e.g. "[00:30] some words here". This is what we hand to the AI.
export function formatTranscript(lines: TranscriptLine[]): string {
  let out = "";
  let lastMark = -30;
  for (const line of lines) {
    if (line.start - lastMark >= 30) {
      out += `\n[${formatTime(line.start)}] `;
      lastMark = line.start;
    }
    out += line.text + " ";
  }
  return out.trim();
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
