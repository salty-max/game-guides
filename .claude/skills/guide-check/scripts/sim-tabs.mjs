// The tab-switch walk in a real iOS Safari: the iOS Simulator's. Serves a guide's built dist with `vite preview` behind a small proxy
// that puts a timing script first in the page's head (before theme-init.js), and that script, on a page opened with ?drive=on (or
// ?drive=off, which removes document.startViewTransition first: only telling on a build that still has a view transition), fakes the installed app's flag, then walks Guide → Checklist → Progress →
// Guide → Progress → Checklist → Guide three times by clicking the tab bar's links, and posts each switch's numbers back. Times run from
// the click (a script's click has no finger going down): tab lit, page commit, painted, settled, frozen, longest gap between frames.
//
//   node .claude/skills/guide-check/scripts/sim-tabs.mjs --root <checkout> --app rdr --out <file.json> [--port 5180]
//   xcrun simctl openurl booted "http://localhost:5180/guide/1?drive=on&wait=8000"
//
// It exits once the walk has reported. Record the screen alongside (`xcrun simctl io booted recordVideo <file>`) to count blank frames.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createServer, request } from "node:http";
import { join, resolve } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => (arg.startsWith("--") ? [...pairs, [arg.slice(2), all[i + 1]?.startsWith("--") ? true : (all[i + 1] ?? true)]] : pairs), []),
);
const root = resolve(args.root ?? ".");
const app = args.app ?? "rdr";
const port = Number(args.port ?? 5180);
const out = resolve(args.out ?? "sim-tabs.json");
const brand = readFileSync(join(root, "apps", app, "src/guide/brand.ts"), "utf8");
const prefix = /storagePrefix:\s*"([^"]+)"/.exec(brand)[1];
const id = /\bid:\s*"([^"]+)"/.exec(brand)[1];

const script = `(() => {
  const drive = new URLSearchParams(location.search).get("drive");
  if (!drive) return;
  if (!sessionStorage.getItem("sim-seeded")) {
    localStorage.clear();
    localStorage.setItem(${JSON.stringify(`${prefix}.theme`)}, "light");
    localStorage.setItem(${JSON.stringify(`${prefix}.v1`)}, ${JSON.stringify(JSON.stringify({ version: 3, guide: id, checks: {}, ceiling: 1, spoilers: false, chapter: 1 }))});
    sessionStorage.setItem("sim-seeded", "1");
  }
  Object.defineProperty(Navigator.prototype, "standalone", { get: () => true, configurable: true });
  if (drive === "off") delete Document.prototype.startViewTransition;
  const events = [];
  const frames = [];
  const log = (type, extra) => events.push({ type, t: performance.now(), ...extra });
  addEventListener("click", () => log("down"), true);
  const start = Document.prototype.startViewTransition;
  if (start) Document.prototype.startViewTransition = function (...rest) {
    log("vt-start");
    const transition = start.apply(this, rest);
    transition.ready.then(() => log("vt-ready"), () => log("vt-skipped"));
    transition.finished.then(() => log("vt-finished"));
    return transition;
  };
  const frame = (t) => { frames.push(t); requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
  const heading = () => [...document.querySelectorAll("main h1")].find((h1) => !h1.closest('[style*="display: none"]'))?.textContent.trim() ?? "";
  let shown = null;
  addEventListener("DOMContentLoaded", () => {
    new MutationObserver((records) => {
      for (const r of records) if (r.attributeName === "aria-current" && r.target.getAttribute("aria-current") === "page") log("tab");
      const now = heading();
      if (shown !== null && now !== shown) { log("page"); requestAnimationFrame(() => requestAnimationFrame(() => log("raf2"))); }
      shown = now;
    }).observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["aria-current", "style"] });
  });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const settled = async () => {
    for (let i = 0; i < 400; i++) {
      const raf = events.some((e) => e.type === "raf2");
      const vt = events.some((e) => e.type === "vt-start");
      if (raf && (!vt || events.some((e) => e.type === "vt-finished" || e.type === "vt-skipped"))) return;
      await wait(50);
    }
  };
  addEventListener("load", async () => {
    // (?wait=ms holds the walk, so a screen recording can start once the page is up)
    await wait(Number(new URLSearchParams(location.search).get("wait") ?? 2500));
    const walk = ["Checklist", "Progress", "Guide", "Progress", "Checklist", "Guide"];
    const results = [];
    let from = "Guide";
    for (let round = 0; round < 3; round++) {
      for (const to of walk) {
        events.length = 0;
        frames.length = 0;
        const link = [...document.querySelectorAll('nav[aria-label="Main navigation"] a')].find((a) => a.textContent.includes(to));
        link.click();
        await settled();
        await wait(700);
        const at = (type, after = -Infinity) => events.find((e) => e.type === type && e.t >= after)?.t;
        const down = at("down");
        const page = at("page", down);
        const vtStart = at("vt-start", down);
        const vtReady = at("vt-ready", down);
        const painted = vtReady ?? at("raf2", page);
        const done = at("vt-finished", down) ?? painted;
        const gaps = frames.filter((t) => t >= down && t <= done + 300).map((t, i, all) => (i ? t - all[i - 1] : 0));
        const r = (v) => (v === undefined ? null : Math.round(v - down));
        results.push({ round, switch: from[0] + "→" + to[0], feedback: r(at("tab", down)), commit: r(page), painted: r(painted), settled: r(done),
          frozen: vtStart !== undefined && vtReady !== undefined ? Math.round(vtReady - vtStart) : null, maxGap: Math.round(Math.max(0, ...gaps)) });
        from = to;
      }
    }
    await fetch("/__report", { method: "POST", body: JSON.stringify({ drive, userAgent: navigator.userAgent, results }) });
    document.title = "walk done";
  });
})();`;

const previewPort = port + 1;
const preview = spawn("pnpm", ["-C", join("apps", app), "exec", "vite", "preview", "--port", String(previewPort), "--strictPort"], { cwd: root, stdio: "ignore", detached: true });

const server = createServer((req, res) => {
  if (req.url === "/__instrument.js") {
    res.writeHead(200, { "content-type": "text/javascript", "cache-control": "no-store" });
    return res.end(script);
  }
  if (req.url === "/__report" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      writeFileSync(out, body);
      res.end("ok");
      console.log(`reported to ${out}`);
      server.close();
      process.kill(-preview.pid, "SIGTERM");
      process.exit(0);
    });
    return;
  }
  const upstream = request({ host: "localhost", port: previewPort, path: req.url, method: req.method, headers: { ...req.headers, "accept-encoding": "identity" } }, (answer) => {
    const html = (answer.headers["content-type"] ?? "").includes("text/html");
    if (!html) {
      res.writeHead(answer.statusCode, answer.headers);
      return answer.pipe(res);
    }
    let page = "";
    answer.setEncoding("utf8");
    answer.on("data", (chunk) => (page += chunk));
    answer.on("end", () => {
      const headers = { ...answer.headers };
      delete headers["content-length"];
      res.writeHead(answer.statusCode, headers);
      res.end(page.replace("<head>", '<head><script src="/__instrument.js"></script>'));
    });
  });
  req.pipe(upstream);
});
server.listen(port, () => console.log(`http://localhost:${port}/guide/1?drive=on (or drive=off)`));
