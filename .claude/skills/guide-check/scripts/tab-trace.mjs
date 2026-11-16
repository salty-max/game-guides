// Traces one warm Guide→Checklist switch in Red Dead, in Chrome at 6x CPU, phone size, the app's frame: sums the main thread's work by
// kind, and the JavaScript's self time by function (a build with --minify false names them; pass its folder as the third argument).
//
//   node .claude/skills/guide-check/scripts/tab-trace.mjs <checkout> <trace.json> [<unminified dist>]
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";
const [root, out, dist] = process.argv.slice(2);
const port = 4991;
const server = spawn("pnpm", ["-C", "apps/rdr", "exec", "vite", "preview", "--port", String(port), "--strictPort", ...(dist ? ["--outDir", dist] : [])], { cwd: root, stdio: "ignore", detached: true });
await new Promise((r) => setTimeout(r, 2500));
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, serviceWorkers: "block" });
await context.addInitScript(() => {
  localStorage.setItem("red-dead-field-guide.v1", JSON.stringify({ version: 3, guide: "red-dead-redemption", checks: {}, ceiling: 1, spoilers: false, chapter: 1 }));
  Object.defineProperty(Navigator.prototype, "standalone", { get: () => true });
});
const page = await context.newPage();
await page.goto(`http://localhost:${port}/guide/1`, { waitUntil: "networkidle" });
const tap = async (name) => {
  const box = await page.locator('nav[aria-label="Main navigation"] a', { hasText: name }).boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(2500);
};
await tap("Checklist");
await tap("Guide");
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 100 });
await cdp.send("Profiler.start");
await browser.startTracing(page, { path: out, categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "blink.user_timing"] });
await tap("Checklist");
await browser.stopTracing();
const { profile } = await cdp.send("Profiler.stop");
await browser.close();
process.kill(-server.pid, "SIGTERM");
const events = JSON.parse(readFileSync(out, "utf8")).traceEvents;
const main = events.find((e) => e.name === "thread_name" && e.args?.name === "CrRendererMain");
const mine = events.filter((e) => e.ph === "X" && e.pid === main.pid && e.tid === main.tid);
const sum = {};
for (const e of mine) sum[e.name] = (sum[e.name] ?? 0) + e.dur / 1000;
const self = {};
const byId = new Map(profile.nodes.map((node) => [node.id, node]));
const dt = profile.timeDeltas;
profile.samples.forEach((id, i) => {
  const { functionName, url, lineNumber } = byId.get(id).callFrame;
  const key = `${functionName || "(anonymous)"} ${url.split("/").pop()}:${lineNumber + 1}`;
  self[key] = (self[key] ?? 0) + (dt[i] ?? 0) / 1000;
});
console.log(Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, v]) => `${v.toFixed(1)} ms  ${k}`).join("\n"));
console.log("--");
console.log(Object.entries(sum).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => `${k}: ${v.toFixed(1)} ms`).join("\n"));
