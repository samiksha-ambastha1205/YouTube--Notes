import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// While developing: `npm run dev` here starts a server on :5173 for the
// React app, and forwards any /api/... request to the Express backend
// running on :3000 (started separately with `npm run dev` in server/).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
