// Times every switch between the phone tab bar's three pages (Guide, Checklist, Progress, both ways) in production builds, the way the
// installed app runs them: phone size, a touch screen, `navigator.standalone` on (so the frame is the app's), every chapter revealed, the
// service worker blocked. For each guide and each browser it walks Guide → Checklist → Progress → Guide → Progress → Checklist → Guide,
// once cold (the first visit to each page) and then --rounds more times warm, and records, per switch, from the finger going down:
//   tab lit  the tapped tab marked current (aria-current): the first sign the tap was taken,
//   commit   the new page in the DOM (the heading of the page on screen changes; until it is painted the old page lingers),
//   painted  the first frame that shows it (the view transition's first frame when there is one, else two frames after the commit),
//   settled  nothing left moving: the transition finished, or painted when there is none (no tap lands on the page before this),
//   frozen   how long the view transition held the old page's picture on screen (its start to its first frame),
//   long     the main thread's long tasks in the window (Chromium only), and the longest gap between two frames (every browser).
// Then, on the Checklist, three ticks of its first row: from the finger going down to the box's change committed and painted (whatever
// is kept alive in the background must not slow a tick).
// And, after the walk, the page's weight with whatever is kept alive: the DOM's elements, and in Chromium the JS heap after a collection.
// --video records each run (Playwright's screencast) and counts its blank frames: the area between the bars one flat colour (ffmpeg).
// --vt off removes document.startViewTransition before the page loads, so React commits without a transition: the same build with and
// without it, which splits a switch's cost between the transition and the page's mount (only telling on a build that still has one).
//
//   node .claude/skills/guide-check/scripts/tab-switch.mjs --out <dir> [--root <checkout>] [--apps rdr,koholint] [--rounds 3]
//        [--browsers chromium4x,chromium6x,webkit] [--vt on,off] [--label main] [--no-build] [--video]
//
// Writes <out>/<label>.json (every switch's numbers) and <out>/<label>.md (medians per switch, cold and warm). Chromium is the system
// Chrome throttled through CDP; WebKit is Playwright's, unthrottled (no throttle exists for it), so its numbers are a Mac's, far
// faster than a phone's: read them for what WebKit does (its frozen picture, its gaps), not for how long a phone takes.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { join, resolve } from "node:path";
import { chromium, webkit } from "playwright-core";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => (arg.startsWith("--") ? [...pairs, [arg.slice(2), all[i + 1]?.startsWith("--") ? true : (all[i + 1] ?? true)]] : pairs), []),
);
if (!args.out || args.out === true) {
  console.error("usage: tab-switch.mjs --out <dir> [--root <checkout>] [--apps a,b] [--rounds 3] [--browsers chromium4x,chromium6x,webkit] [--vt on,off] [--label name] [--no-build]");
  process.exit(2);
}
const root = resolve(args.root === true || !args.root ? "." : args.root);
const out = resolve(args.out);
const label = typeof args.label === "string" ? args.label : "run";
const apps = typeof args.apps === "string" ? args.apps.split(",") : readdirSync(join(root, "apps")).filter((app) => existsSync(join(root, "apps", app, "vercel.json")));
const rounds = Number(args.rounds ?? 3);
const browsers = (typeof args.browsers === "string" ? args.browsers : "chromium4x,chromium6x,webkit").split(",");
const vtModes = (typeof args.vt === "string" ? args.vt : "on,off").split(",");
const walk = ["Checklist", "Progress", "Guide", "Progress", "Checklist", "Guide"];
const short = { Guide: "G", Checklist: "C", Progress: "P" };

const freePort = () =>
  new Promise((done) => {
    const server = createServer().listen(0, () => {
      const { port } = server.address();
      server.close(() => done(port));
    });
  });
const answers = async (url, ms) => {
  for (const end = Date.now() + ms; Date.now() < end; await new Promise((r) => setTimeout(r, 300))) {
    try {
      if ((await fetch(url)).ok) return true;
    } catch {}
  }
  return false;
};
const median = (values) => {
  const sorted = values.filter((v) => typeof v === "number").sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// Runs in the page before any of its scripts.
function instrument({ themeKey, saveKey, save, vt }) {
  if (!sessionStorage.getItem("tab-switch-seeded")) {
    localStorage.clear();
    localStorage.setItem(themeKey, "light");
    localStorage.setItem(saveKey, save);
    sessionStorage.setItem("tab-switch-seeded", "1");
  }
  // The installed app on an iPhone: theme-init.js reads this and gives the page the app's frame.
  Object.defineProperty(Navigator.prototype, "standalone", { get: () => true, configurable: true });
  const m = (window.__m = { events: [], frames: [], longtasks: [] });
  const log = (type, extra) => m.events.push({ type, t: performance.now(), ...extra });
  addEventListener("pointerdown", () => log("down"), true);
  addEventListener("click", () => log("click"), true);
  if (vt === "off") {
    delete Document.prototype.startViewTransition;
  } else if (Document.prototype.startViewTransition) {
    const start = Document.prototype.startViewTransition;
    Document.prototype.startViewTransition = function (...rest) {
      log("vt-start");
      const transition = start.apply(this, rest);
      transition.updateCallbackDone.then(() => log("vt-updated"), () => log("vt-update-failed"));
      transition.ready.then(() => log("vt-ready"), () => log("vt-skipped"));
      transition.finished.then(() => log("vt-finished"));
      return transition;
    };
  }
  const frame = (t) => {
    m.frames.push(t);
    if (m.frames.length > 4000) m.frames.splice(0, 2000);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  try {
    new PerformanceObserver((list) => list.getEntries().forEach((e) => m.longtasks.push({ start: e.startTime, duration: e.duration }))).observe({ type: "longtask", buffered: true });
  } catch {}
  // The page on screen is the one whose heading isn't inside something hidden (a page kept out of sight is display: none); no layout read.
  const heading = () => [...document.querySelectorAll("main h1")].find((h1) => !h1.closest('[style*="display: none"]'))?.textContent.trim() ?? "";
  let shownHeading = null;
  addEventListener("DOMContentLoaded", () => {
    new MutationObserver((records) => {
      for (const record of records) {
        if (record.type !== "attributes") continue;
        if (record.attributeName === "aria-checked") {
          log("checked");
          requestAnimationFrame(() => requestAnimationFrame(() => log("raf2-checked")));
        } else if (record.attributeName === "aria-current" && record.target.getAttribute("aria-current") === "page") {
          log("tab", { to: record.target.textContent.trim() });
        }
      }
      const now = heading();
      if (shownHeading !== null && now !== shownHeading) {
        log("page", { heading: now });
        // Two frames after the commit: the first frame that can show it has been drawn.
        requestAnimationFrame(() => requestAnimationFrame(() => log("raf2", { heading: now })));
      }
      shownHeading = now;
    }).observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["aria-current", "aria-checked", "style"] });
  });
}

function summarise(events, frames, longtasks, to) {
  const at = (type, after = -Infinity) => events.find((e) => e.type === type && e.t >= after)?.t;
  const down = at("down");
  if (down === undefined) return { error: "no pointerdown" };
  const feedback = events.find((e) => e.type === "tab" && e.to.includes(to) && e.t >= down)?.t;
  const commit = at("page", down);
  if (commit === undefined) return { error: "no page change" };
  const raf2 = at("raf2", commit);
  const vtStart = at("vt-start", down);
  const vt = vtStart !== undefined && vtStart <= commit + 1;
  const vtReady = vt ? at("vt-ready", vtStart) : undefined;
  const vtFinished = vt ? at("vt-finished", vtStart) : undefined;
  const painted = vt ? (vtReady ?? raf2) : raf2;
  const settled = vt ? (vtFinished ?? painted) : painted;
  const end = (settled ?? commit) + 300;
  const inWindow = longtasks.filter((task) => task.start + task.duration >= down && task.start <= end);
  const gaps = frames.filter((t) => t >= down && t <= end).map((t, i, all) => (i ? t - all[i - 1] : 0));
  const round = (v) => (v === undefined || v === null ? null : Math.round(v));
  return {
    feedback: round(feedback - down),
    commit: round(commit - down),
    painted: round(painted - down),
    settled: round(settled - down),
    frozen: vt && vtReady !== undefined ? round(vtReady - vtStart) : null,
    transition: vt,
    longTotal: round(inWindow.reduce((sum, task) => sum + task.duration, 0)),
    longMax: round(Math.max(0, ...inWindow.map((task) => task.duration))),
    longCount: inWindow.length,
    maxGap: round(Math.max(0, ...gaps)),
  };
}

// Frames of a recording where the page's area (between the bars) is one flat colour: a blank screen. ffmpeg's signalstats gives each
// frame's darkest and brightest luma; a page with anything on it spans more than a few steps.
function blankFrames(video, skipSeconds) {
  const output = execFileSync("ffmpeg", ["-hide_banner", "-i", video, "-vf", "crop=iw:ih*0.6:0:ih*0.2,signalstats,metadata=print:file=-", "-f", "null", "-"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 64 * 1024 * 1024,
  });
  let time = 0;
  let low = 0;
  const frames = [];
  for (const line of output.split("\n")) {
    const pts = /pts_time:([\d.]+)/.exec(line);
    if (pts) time = Number(pts[1]);
    const min = /signalstats\.YMIN=(\d+)/.exec(line);
    if (min) low = Number(min[1]);
    const max = /signalstats\.YMAX=(\d+)/.exec(line);
    if (max) frames.push({ time, flat: Number(max[1]) - low < 8 });
  }
  const counted = frames.filter((frame) => frame.time >= skipSeconds);
  return { frames: counted.length, blank: counted.filter((frame) => frame.flat).length };
}

mkdirSync(out, { recursive: true });
const results = [];
const engines = {};
for (const app of apps) {
  const folder = join(root, "apps", app);
  const name = JSON.parse(readFileSync(join(folder, "package.json"), "utf8")).name;
  const brandSource = readFileSync(join(folder, "src/guide/brand.ts"), "utf8");
  const prefix = /storagePrefix:\s*"([^"]+)"/.exec(brandSource)[1];
  const id = /\bid:\s*"([^"]+)"/.exec(brandSource)[1];
  // (the shared save format, version 3, as progress-state.ts reads it: nothing checked, every chapter shown, chapter 1 open)
  const save = JSON.stringify({ version: 3, guide: id, checks: {}, ceiling: 1, spoilers: false, chapter: 1 });
  if (args["no-build"] !== true) {
    try {
      execFileSync("pnpm", ["--filter", name, "build"], { cwd: root, stdio: "pipe" });
    } catch (error) {
      console.error(`${app}: the build failed\n${String(error.stdout).slice(-2000)}${String(error.stderr).slice(-2000)}`);
      process.exit(1);
    }
  }
  const port = await freePort();
  const server = spawn("pnpm", ["--filter", name, "preview", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore", detached: true });
  try {
    if (!(await answers(`http://localhost:${port}/`, 30000))) throw new Error(`${app}: vite preview never answered on ${port}`);
    for (const browserName of browsers) {
      const isWebkit = browserName === "webkit";
      const throttle = isWebkit ? 1 : Number(/(\d+)x/.exec(browserName)?.[1] ?? 1);
      engines[browserName] ??= await (isWebkit ? webkit.launch() : chromium.launch({ channel: "chrome" }));
      for (const vt of vtModes) {
        const context = await engines[browserName].newContext({
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 3,
          ...(isWebkit ? {} : { isMobile: true }),
          hasTouch: true,
          colorScheme: "light",
          serviceWorkers: "block",
          ...(args.video === true ? { recordVideo: { dir: join(out, "videos", `${label}-${app}-${browserName}-vt-${vt}`), size: { width: 390, height: 844 } } } : {}),
        });
        await context.addInitScript(instrument, { themeKey: `${prefix}.theme`, saveKey: `${prefix}.v1`, save, vt });
        const page = await context.newPage();
        const opened = Date.now();
        let firstTap = 0;
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        const cdp = isWebkit ? null : await context.newCDPSession(page);
        await page.goto(`http://localhost:${port}/guide/1`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(800);
        if (cdp) await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
        const settle = 1200 * Math.max(1, throttle / 2);
        let from = "Guide";
        for (let round = 0; round <= rounds; round++) {
          for (const to of walk) {
            const box = await page.locator('nav[aria-label="Main navigation"] a', { hasText: to }).boundingBox();
            await page.evaluate(() => {
              window.__m.events.length = 0;
              window.__m.frames.length = 0;
              window.__m.longtasks.length = 0;
            });
            firstTap ||= Date.now();
            await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
            await page.waitForFunction(() => window.__m.events.some((e) => e.type === "raf2"), null, { timeout: 30000 });
            await page.waitForTimeout(settle);
            const { events, frames, longtasks } = await page.evaluate(() => window.__m);
            const numbers = summarise(events, frames, longtasks, to);
            results.push({ app, browser: browserName, vt, round, cold: round === 0, switch: `${short[from]}→${short[to]}`, ...numbers });
            from = to;
          }
        }
        // Ticks, on the Checklist.
        {
          const tab = await page.locator('nav[aria-label="Main navigation"] a', { hasText: "Checklist" }).boundingBox();
          await page.touchscreen.tap(tab.x + tab.width / 2, tab.y + tab.height / 2);
          await page.waitForTimeout(settle);
          for (let tick = 0; tick < 3; tick++) {
            const box = await page.locator('main [role="checkbox"]:visible').first().boundingBox();
            await page.evaluate(() => {
              window.__m.events.length = 0;
              window.__m.longtasks.length = 0;
            });
            await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
            await page.waitForFunction(() => window.__m.events.some((e) => e.type === "raf2-checked"), null, { timeout: 30000 });
            await page.waitForTimeout(settle);
            const { events, longtasks } = await page.evaluate(() => window.__m);
            const down = events.find((e) => e.type === "down")?.t;
            const checked = events.find((e) => e.type === "checked")?.t;
            const painted = events.find((e) => e.type === "raf2-checked")?.t;
            const inWindow = longtasks.filter((task) => task.start + task.duration >= down && task.start <= painted + 300);
            results.push({
              app, browser: browserName, vt, tick,
              commit: Math.round(checked - down),
              painted: Math.round(painted - down),
              longTotal: Math.round(inWindow.reduce((sum, task) => sum + task.duration, 0)),
            });
          }
        }
        if (cdp) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
        const weight = { elements: await page.evaluate(() => document.getElementsByTagName("*").length) };
        if (cdp) {
          await cdp.send("HeapProfiler.collectGarbage");
          await cdp.send("Performance.enable");
          const { metrics } = await cdp.send("Performance.getMetrics");
          const metric = (key) => metrics.find((m) => m.name === key)?.value;
          weight.heapMB = Math.round((metric("JSHeapUsedSize") / 1048576) * 10) / 10;
          weight.nodes = metric("Nodes");
          weight.layoutObjects = metric("LayoutObjects");
        }
        const video = page.video();
        await context.close();
        // Blank frames from the first tap on (the page's own first paint before it isn't a switch).
        if (video) weight.blank = blankFrames(await video.path(), (firstTap - opened) / 1000);
        results.push({ app, browser: browserName, vt, weight, errors });
        console.log(`${app} ${browserName} vt ${vt}: done${errors.length ? `, ${errors.length} page errors` : ""}`);
      }
    }
  } finally {
    process.kill(-server.pid, "SIGTERM");
  }
}
for (const engine of Object.values(engines)) await engine.close();

writeFileSync(join(out, `${label}.json`), `${JSON.stringify(results, null, 1)}\n`);
const switches = walk.map((to, i) => `${short[i ? walk[i - 1] : "Guide"]}→${short[to]}`);
const lines = [`# Tab switches: ${label}`, ``, `${root}, ${rounds} warm rounds after the cold one. Medians in ms from the finger going down.`, ``];
for (const app of apps) {
  for (const browserName of browsers) {
    for (const vt of vtModes) {
      const rows = results.filter((r) => r.app === app && r.browser === browserName && r.vt === vt);
      const weight = rows.find((r) => r.weight);
      lines.push(`## ${app}, ${browserName}, view transition ${vt}`, ``);
      lines.push(`| Switch | Visit | Tab lit | Page commit | Painted | Settled | Frozen | Long tasks (total / max) | Max frame gap |`, `| --- | --- | --- | --- | --- | --- | --- | --- | --- |`);
      for (const name of switches) {
        for (const cold of [true, false]) {
          const set = rows.filter((r) => r.switch === name && r.cold === cold && !r.error);
          if (!set.length) continue;
          const med = (key) => median(set.map((r) => r[key]));
          const frozen = med("frozen");
          lines.push(
            `| ${name} | ${cold ? "cold" : "warm"} | ${med("feedback")} | ${med("commit")} | ${med("painted")} | ${med("settled")} | ${frozen ?? "–"} | ${browserName === "webkit" ? "n/a" : `${med("longTotal")} / ${med("longMax")}`} | ${med("maxGap")} |`,
          );
        }
      }
      const ticks = rows.filter((r) => r.tick !== undefined);
      if (ticks.length)
        lines.push(``, `Tick a row on the Checklist (median of ${ticks.length}): committed ${median(ticks.map((r) => r.commit))}, painted ${median(ticks.map((r) => r.painted))}${browserName === "webkit" ? "" : `, long tasks ${median(ticks.map((r) => r.longTotal))}`}.`);
      const failed = rows.filter((r) => r.error);
      if (failed.length) lines.push(``, `${failed.length} switches not measured: ${[...new Set(failed.map((r) => r.error))].join(", ")}`);
      if (weight) lines.push(``, `After the walk: ${weight.weight.elements} elements${weight.weight.blank ? `, ${weight.weight.blank.blank} blank frames of ${weight.weight.blank.frames} recorded` : ""}${weight.weight.heapMB !== undefined ? `, JS heap ${weight.weight.heapMB} MB, ${weight.weight.nodes} DOM nodes, ${weight.weight.layoutObjects} layout objects` : ""}${weight.errors.length ? `. Page errors: ${weight.errors.join("; ")}` : ""}`);
      lines.push(``);
    }
  }
}
writeFileSync(join(out, `${label}.md`), `${lines.join("\n")}\n`);
console.log(`results in ${join(out, `${label}.md`)}`);
