// `pnpm stats [days] [--test]`: the visit counts and the sync groups, read from Upstash with the database's read-only token. Runs
// src/stats.ts through Vite's module loader, as dev.mjs does. The token comes from the environment or from .env.local, which
// `vercel env pull --project hundo-api --environment production` writes (and git ignores).
import { existsSync } from "node:fs";
import { createServer } from "vite";

const root = new URL("..", import.meta.url).pathname;
if (existsSync(`${root}.env.local`)) process.loadEnvFile(`${root}.env.local`);
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_READ_ONLY_TOKEN ?? process.env.UPSTASH_REDIS_REST_READ_ONLY_TOKEN;
if (!url || !token) {
  console.error("Needs KV_REST_API_URL and KV_REST_API_READ_ONLY_TOKEN: vercel env pull --project hundo-api --environment production");
  process.exit(1);
}
const args = process.argv.slice(2);
const days = Number(args.find((arg) => /^\d+$/.test(arg)) ?? 30);
const ns = args.includes("--test") ? "test" : "prod";

const vite = await createServer({ configFile: false, root, appType: "custom", logLevel: "error", server: { middlewareMode: true, hmr: false, ws: false, watch: null } });
try {
  const { readStats, formatStats } = await vite.ssrLoadModule("/src/stats.ts");
  const { UpstashStore } = await vite.ssrLoadModule("/src/store.ts");
  const { COUNT_BUDGET } = await vite.ssrLoadModule("/src/app.ts");
  const stats = await readStats(new UpstashStore(url, token), { ns, now: Date.now(), days });
  console.log(formatStats(stats, COUNT_BUDGET[ns]));
} finally {
  await vite.close();
}
