# Reel → Notes

Turn a YouTube video into a summary, key concepts, flashcards, a quiz, and
clickable timestamps. Paste a link, no sign-up.

## How it works (the whole pipeline, in plain English)

1. You paste a YouTube URL into the form.
2. The server pulls the video's title/thumbnail (`youtube.com/oembed` — free,
   no key needed) and its captions (`youtube-transcript` package).
3. The captions get glued into one text block with `[MM:SS]` markers every
   ~30 seconds.
4. That text gets sent to a free model on OpenRouter **once**, asking for a
   single JSON object back: summary, key concepts, flashcards, quiz, timestamps.
5. The React app renders that JSON into tabs. No database, no login.

The "Ask" tab reuses the same transcript and sends a second, separate
question each time you ask something.

## Project layout

```
yt-learning-assistant/
├── server/              ← Express + TypeScript backend
│   ├── src/
│   │   ├── server.ts    ← boots the app, serves the built frontend + API
│   │   ├── routes.ts    ← the two endpoints: /api/analyze, /api/ask
│   │   ├── youtube.ts   ← everything about talking to YouTube
│   │   └── ai.ts        ← everything about talking to OpenRouter
│   ├── package.json
│   └── .env.example
└── client/              ← React frontend (Vite, no extra state library)
    ├── vite.config.js   ← dev server + proxies /api to the backend
    └── src/
        ├── App.jsx          ← composes Hero + Features + AppSection
        ├── components/
        │   ├── Hero.jsx         ← static landing headline
        │   ├── Features.jsx     ← the 4 feature cards (built from an array)
        │   ├── AppSection.jsx   ← owns the fetch + loading/error/ready state
        │   ├── UrlForm.jsx      ← the link input
        │   ├── LoadingCat.jsx   ← bobbing cat + rotating status text
        │   ├── Results.jsx      ← tab bar + the 6 tab panels
        │   ├── Flashcard.jsx    ← one flippable card
        │   ├── QuizTab.jsx      ← quiz question/answer state
        │   └── AskTab.jsx       ← the little Q&A chat
        ├── utils.js         ← markdown export + time helpers
        └── styles.css       ← all the styling, plain CSS (no Tailwind)
```

## Getting a free OpenRouter API key

1. Go to https://openrouter.ai and sign up.
2. Open your dashboard → Keys → **Create Key**. Copy the `sk-or-v1-...` value.
3. Free models on OpenRouter end in `:free` (e.g.
   `meta-llama/llama-3.3-70b-instruct:free`, `qwen/qwen3-coder:free`,
   `openai/gpt-oss-120b:free`). You can swap models any time — see below.

## Setup

**1. Backend**
```
cd server
cp .env.example .env
# edit .env and paste your OPENROUTER_API_KEY
npm install
npm run dev
```
This starts the API on http://localhost:3000.

**2. Frontend** (in a second terminal)
```
cd client
npm install
npm run dev
```
This starts the React app on http://localhost:5173 and forwards any
`/api/...` request to the backend on :3000 (see `vite.config.js`).

Open **http://localhost:5173** while developing.

**3. Production build** (optional, one server instead of two)
```
cd client && npm run build
```
This creates `client/dist`. The backend already looks for that folder and
serves it automatically — so after building, just run the backend
(`cd server && npm start`) and open **http://localhost:3000**.

## About the free models & rate limits

Free models on OpenRouter share tight, heavily-used capacity, so any single
one can occasionally return a `429 rate-limited` error, especially during
busy hours. This project handles that two ways, both in `server/src/ai.ts`:

1. **A fallback list, not one model.** Every request sends a priority-ordered
   `models` array (`openrouter/free`, then a few specific free models as
   backups). OpenRouter itself tries them in order and only reports an error
   if every single one fails - no code needed on our side for that part.
2. **A short retry loop.** If everything in that list is briefly busy at
   once, the app waits (honoring OpenRouter's suggested `retry_after_seconds`
   when it sends one) and tries the whole request again, up to 3 times total,
   before giving up.

If you want one *specific* free model to be tried first (say, you've found
one that gives cleaner JSON), set it in `server/.env`:
```
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
```
It'll be tried first, with the built-in list still there as backup. Any
slug ending in `:free` from https://openrouter.ai/models works.

Separately: free models are smaller and chattier than a flagship one - they
sometimes add a stray sentence before/after the JSON even when told not to.
`ai.ts` defends against that by extracting just the `{...}` block from the
response before parsing it.

## Notes on the "minimal" choices

- No database. State (transcript + generated material) lives in React state
  (`AppSection.jsx`) for as long as the tab is open. Refreshing loses it —
  that's intentional, not a bug.
- No Redux/Zustand/Context — every component only needs `useState`, so
  props are passed straight down. `AppSection` is the one place that owns
  the real data; everything under it is just given what it needs to render.
- No RAG / embeddings / vector DB for the "Ask" tab. The whole transcript is
  stuffed into the prompt directly — good enough for videos up to a couple
  hours, and much easier to read than a retrieval pipeline.
- Only 2 backend endpoints. Everything else (flashcard flipping, quiz
  navigation, tab switching, exporting notes as Markdown) happens entirely
  in the browser with no server round-trip.
