// Takes the pictures of each guide that Chromium's install dialog shows (the manifest's screenshots, src/icons.ts): builds the guide, serves
// the build with `vite preview`, opens its first chapter in the system Chrome as the installed app shows it (navigator.standalone, light
// theme, a fresh save), and writes small JPEGs to the guide's public/icons. Run from the root after a change a reader would see in them,
// and commit what it writes: `pnpm screenshots [koholint,echoes]`. Nothing runs it in the build or the check.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";
import { screenshots } from "./src/icons.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const apps = process.argv[2] ? process.argv[2].split(",") : readdirSync(join(root, "apps")).filter((app) => existsSync(join(root, "apps", app, "vercel.json")));

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

// The preview server runs in a process group of its own, which a Ctrl-C in the terminal doesn't reach: stop it on the way out, however
// the script ends.
let server;
const stop = () => {
  try {
    if (server?.pid) process.kill(-server.pid, "SIGTERM");
  } catch {
    /* already gone */
  }
  server = undefined;
};
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => (stop(), process.exit(130)));

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const app of apps) {
    const folder = join(root, "apps", app);
    const name = JSON.parse(readFileSync(join(folder, "package.json"), "utf8")).name;
    const prefix = /storagePrefix:\s*"([^"]+)"/.exec(readFileSync(join(folder, "src/guide/brand.ts"), "utf8"))[1];
    execFileSync("pnpm", ["--filter", name, "build"], { cwd: root, stdio: "ignore" });
    const port = await freePort();
    server = spawn("pnpm", ["--filter", name, "preview", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore", detached: true });
    try {
      if (!(await answers(`http://localhost:${port}/`, 30000))) throw new Error(`${app}: vite preview never answered on ${port}`);
      for (const { src, formFactor, viewport, scale } of screenshots) {
        const phone = formFactor === "narrow";
        const context = await browser.newContext({ viewport, deviceScaleFactor: scale, isMobile: phone, hasTouch: phone, colorScheme: "light", serviceWorkers: "block", reducedMotion: "reduce" });
        await context.addInitScript((themeKey) => {
          Object.defineProperty(navigator, "standalone", { value: true });
          localStorage.clear();
          localStorage.setItem(themeKey, "light");
        }, `${prefix}.theme`);
        const page = await context.newPage();
        await page.goto(`http://localhost:${port}/guide/1`, { waitUntil: "networkidle" });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
        });
        const file = join(folder, "public", src);
        await sharp(await page.screenshot()).jpeg({ quality: 78, mozjpeg: true }).toFile(file);
        console.log(`${app}: ${src}, ${Math.round(statSync(file).size / 1024)} KB`);
        await context.close();
      }
    } finally {
      stop();
    }
  }
} finally {
  await browser.close();
}
