import { defineConfig } from "vitest/config";
import { home } from "./src/plugin.ts";

// The landing page at hundo.quest: index.html and 404.html, made from the guides by the plugin (src/plugin.ts). The tests load the guides
// themselves, so they run without it.
// In production /api is a rewrite to the sync API (vercel.json), as on the guides. Here the dev and preview servers send it to the local one
// (`pnpm -C services/sync dev`, on 8787), keeping the page's own host, as core's vite.ts does for a guide.
const proxy = { "/api": { target: process.env.SYNC_API ?? "http://127.0.0.1:8787" } };

export default defineConfig({
  plugins: process.env.VITEST ? [] : [home()],
  server: { proxy },
  preview: { proxy },
  build: { rollupOptions: { input: { index: "index.html", notFound: "404.html" } } },
  // A suite's beforeAll makes the whole page from every guide's files (plugin.ts's make), as slow as any test here.
  test: { globals: true, environment: "node", include: ["src/**/*.test.{ts,tsx}"], testTimeout: 60_000, hookTimeout: 60_000 },
});
