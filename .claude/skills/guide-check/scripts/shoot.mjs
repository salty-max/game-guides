// Builds each guide, serves the build with `vite preview` on a free port, and screenshots it with the system Chrome:
// desktop 1280×860, tablet 768×1024 and phone 375×812, light and dark (the phone as a touch screen). Service workers are blocked, and the theme is seeded in
// localStorage before the first paint, the way theme-init.js reads it. Writes <out>/<app>-<page>-<size>-<theme>.png
// and <out>/report.md (sideways scroll, console errors and loaded fonts per shot). Exits 1 if any shot had a problem.
// --pages replaces the default pages. --reveal also seeds a save with spoiler protection off, so every chapter shows.
//
//   node .claude/skills/guide-check/scripts/shoot.mjs --out <dir> [--root <checkout>] [--apps koholint,echoes]
//        [--pages guide=/guide/1,checklist=/checklist] [--reveal] [--full]
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { join, resolve } from "node:path";
import { chromium } from "playwright-core";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => (arg.startsWith("--") ? [...pairs, [arg.slice(2), all[i + 1]?.startsWith("--") ? true : (all[i + 1] ?? true)]] : pairs), []),
);
if (!args.out || args.out === true) {
  console.error("usage: shoot.mjs --out <dir> [--root <checkout>] [--apps a,b] [--pages name=/path,…] [--full]");
  process.exit(2);
}
const root = resolve(args.root === true || !args.root ? "." : args.root);
const out = resolve(args.out);
const apps = typeof args.apps === "string" ? args.apps.split(",") : readdirSync(join(root, "apps")).filter((app) => existsSync(join(root, "apps", app, "vercel.json")));
const pages = (typeof args.pages === "string" ? args.pages : "guide=/guide/1,checklist=/checklist,progress=/dashboard").split(",").map((pair) => pair.split("="));
const sizes = { desktop: { width: 1280, height: 860 }, tablet: { width: 768, height: 1024 }, phone: { width: 375, height: 812 } };

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

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const rows = [];
for (const app of apps) {
  const folder = join(root, "apps", app);
  const name = JSON.parse(readFileSync(join(folder, "package.json"), "utf8")).name;
  const brandSource = readFileSync(join(folder, "src/guide/brand.ts"), "utf8");
  const prefix = /storagePrefix:\s*"([^"]+)"/.exec(brandSource)[1];
  const id = /\bid:\s*"([^"]+)"/.exec(brandSource)[1];
  // (the shared save format, version 3, as progress-state.ts reads it: no checks, every chapter shown)
  const save = args.reveal === true ? JSON.stringify({ version: 3, guide: id, checks: {}, ceiling: 1, spoilers: false, chapter: 1 }) : null;
  try {
    execFileSync("pnpm", ["--filter", name, "build"], { cwd: root, stdio: "pipe" });
  } catch (error) {
    console.error(`${app}: the build failed\n${String(error.stdout).slice(-2000)}${String(error.stderr).slice(-2000)}`);
    process.exit(1);
  }
  const port = await freePort();
  const server = spawn("pnpm", ["--filter", name, "preview", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore", detached: true });
  try {
    if (!(await answers(`http://localhost:${port}/`, 30000))) throw new Error(`${app}: vite preview never answered on ${port}`);
    for (const [size, viewport] of Object.entries(sizes)) {
      for (const theme of ["light", "dark"]) {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: size === "phone", hasTouch: size === "phone", colorScheme: theme, serviceWorkers: "block" });
        // (once per context, so a reload inside a check keeps what the page saved since)
        await context.addInitScript(([themeKey, value, saveKey, saved]) => {
          if (sessionStorage.getItem("shoot-seeded")) return;
          localStorage.clear();
          localStorage.setItem(themeKey, value);
          if (saved) localStorage.setItem(saveKey, saved);
          sessionStorage.setItem("shoot-seeded", "1");
        }, [`${prefix}.theme`, theme, `${prefix}.v1`, save]);
        const page = await context.newPage();
        let errors = [];
        page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
        page.on("pageerror", (error) => errors.push(error.message));
        for (const [label, path] of pages) {
          errors = [];
          await page.goto(`http://localhost:${port}${path}`, { waitUntil: "networkidle" });
          await page.evaluate(() => document.fonts.ready);
          const facts = await page.evaluate(() => ({
            sideways: document.documentElement.scrollWidth > window.innerWidth,
            fonts: [...new Set([...document.fonts].filter((face) => face.status === "loaded").map((face) => face.family.replaceAll('"', "")))],
          }));
          const file = `${app}-${label}-${size}-${theme}.png`;
          await page.screenshot({ path: join(out, file), fullPage: args.full === true });
          rows.push({ file, path, ...facts, errors: [...errors] });
        }
        await context.close();
      }
    }
  } finally {
    process.kill(-server.pid, "SIGTERM");
  }
}
await browser.close();

const bad = rows.filter((row) => row.sideways || row.errors.length);
const report = [
  `# Screenshots`,
  ``,
  `${rows.length} shots of ${apps.join(", ")} from ${root}, ${bad.length ? `${bad.length} with a problem` : "no problems"}.`,
  ``,
  `| Shot | Path | Sideways scroll | Console errors | Fonts loaded |`,
  `| --- | --- | --- | --- | --- |`,
  ...rows.map((row) => `| ${row.file} | ${row.path} | ${row.sideways ? "**yes**" : "no"} | ${row.errors.length || ""} | ${row.fonts.join(", ")} |`),
  ...bad.flatMap((row) => (row.errors.length ? ["", `## ${row.file}`, "", ...row.errors.map((error) => `- ${error}`)] : [])),
].join("\n");
writeFileSync(join(out, "report.md"), `${report}\n`);
console.log(`${rows.length} shots in ${out}, ${bad.length ? `${bad.length} with a problem (report.md)` : "no problems"}`);
process.exit(bad.length ? 1 : 0);
