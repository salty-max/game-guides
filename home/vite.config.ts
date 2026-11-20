import { defineConfig } from "vitest/config";
import { home } from "./src/plugin.ts";

// The landing page at hundo.quest: index.html and 404.html, made from the guides by the plugin (src/plugin.ts). The tests load the guides
// themselves, so they run without it.
export default defineConfig({
  plugins: process.env.VITEST ? [] : [home()],
  build: { rollupOptions: { input: { index: "index.html", notFound: "404.html" } } },
  test: { globals: true, environment: "node", include: ["src/**/*.test.{ts,tsx}"], testTimeout: 60_000 },
});
