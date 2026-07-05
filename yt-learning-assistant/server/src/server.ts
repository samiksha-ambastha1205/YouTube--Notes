import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { router } from "./routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// This only exists after you run `npm run build` inside client/. While
// developing, use `npm run dev` in client/ instead (see client/README) -
// it runs its own dev server on :5173 and proxies /api requests here.
const CLIENT_DIST = path.join(__dirname, "../../client/dist");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// API routes live under /api/*
app.use("/api", router);

// Serves the built React app, if it exists (production use).
app.use(express.static(CLIENT_DIST));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Studying, but make it a rainbow: http://localhost:${PORT}`);
});
