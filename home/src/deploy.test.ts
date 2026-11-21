// What Vercel serves the landing page with (vercel.json), held to the guides' bar: the same security headers, no inline script, the long
// cache only on a file that exists, an ignore step that only ever answers 0 or 1, and what a search engine reads.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { THEME_KEY } from "./theme";

type Route = { src?: string; dest?: string; status?: number; headers?: Record<string, string>; continue?: boolean; handle?: string };
const home = join(import.meta.dirname, "..");
const read = (path: string) => readFileSync(join(home, path), "utf8");
const vercel = JSON.parse(read("vercel.json"));
const routes: Route[] = vercel.routes;
const phase = (name: string) => {
  const start = name === "start" ? 0 : routes.findIndex((route) => route.handle === name) + 1;
  const end = routes.findIndex((route, i) => i >= start && route.handle);
  return routes.slice(start, end === -1 ? undefined : end);
};

describe("home's vercel.json", () => {
  it("is routes alone, in the phases filesystem, hit and error", () => {
    for (const key of ["headers", "rewrites", "redirects", "trailingSlash", "cleanUrls"]) expect(vercel[key], key).toBeUndefined();
    expect(routes.filter((route) => route.handle).map((route) => route.handle)).toEqual(["filesystem", "hit", "error"]);
    expect(vercel.outputDirectory).toBe("dist");
    expect(vercel.installCommand).toBe("pnpm install --frozen-lockfile");
  });

  it("sends the guides' security headers on every answer, 404s included, with a CSP that runs no inline script or style", () => {
    const guide = JSON.parse(readFileSync(join(home, "..", "apps", "koholint", "vercel.json"), "utf8")).routes[0].headers;
    const own = phase("start")[0].headers!;
    expect(phase("start")[0].src).toBe("/(.*)");
    for (const key of Object.keys(guide)) expect(own[key], key).toBeDefined();
    for (const key of Object.keys(guide).filter((key) => key !== "Content-Security-Policy")) expect(own[key], key).toBe(guide[key]);
    const csp = own["Content-Security-Policy"];
    expect(csp).toMatch(/(^|; )script-src 'self'(;|$)/);
    expect(csp).toMatch(/(^|; )style-src 'self'(;|$)/);
    expect(csp).not.toContain("unsafe");
    expect(csp).toMatch(/frame-ancestors 'none'/);
  });

  it("sends /api to the sync API as the guides do, ahead of the 404, so a linked browser can read its group's progress", () => {
    const guide: Route[] = JSON.parse(readFileSync(join(home, "..", "apps", "koholint", "vercel.json"), "utf8")).routes;
    const api = guide.find((route) => route.src?.startsWith("/api"));
    expect(api).toEqual({ src: "/api(?:/(.*))?", dest: "https://api.hundo.quest/api/$1", check: true });
    expect(phase("filesystem")).toEqual([api]);
  });

  it("caches a year only a hashed file that exists, and answers anything else with the 404 page", () => {
    for (const route of [...phase("start"), ...phase("filesystem")]) expect(route.headers?.["Cache-Control"] ?? "", route.src).not.toMatch(/immutable/);
    expect(phase("hit")).toEqual([{ src: "/assets/(.*)", headers: { "Cache-Control": "public, max-age=31536000, immutable" }, continue: true }]);
    expect(phase("error")).toEqual([{ src: "/(.*)", status: 404, dest: "/404.html" }]);
  });

  it("skips a build only when nothing it's made from changed, and answers only 0 or 1", () => {
    expect(vercel.ignoreCommand).toBe("sh vercel-ignore.sh");
    const script = read("vercel-ignore.sh");
    execFileSync("sh", ["-n", join(home, "vercel-ignore.sh")]);
    for (const path of [" . ", "../apps", "../packages/core", "../package.json", "../pnpm-lock.yaml", "../pnpm-workspace.yaml", "../tsconfig.base.json"]) expect(script, path).toContain(path);
    const code = script.split("\n").filter((line) => !line.trimStart().startsWith("#")).join("\n");
    expect([...code.matchAll(/\bexit (\S+)/g)].map(([, status]) => status)).toEqual(["1", "0", "1"]);
    expect(script.trim().endsWith("exit 1")).toBe(true);
  });
});

describe("what a search engine reads", () => {
  const index = read("index.html");

  it("names hundo.quest as the page's address", () => {
    expect(index).toContain('<link rel="canonical" href="https://hundo.quest/">');
    expect(index).toContain('<meta property="og:url" content="https://hundo.quest/">');
    expect(read("public/sitemap.xml")).toContain("<loc>https://hundo.quest/</loc>");
    expect(read("public/robots.txt")).toContain("Sitemap: https://hundo.quest/sitemap.xml");
    expect(read("404.html")).toContain('<meta name="robots" content="noindex">');
  });

  it("holds no inline script, the WebSite block aside (a JSON-LD data block, which the CSP doesn't cover)", () => {
    for (const page of ["index.html", "404.html"]) {
      for (const [tag] of read(page).matchAll(/<script\b[^>]*>/g)) expect(tag, page).toMatch(/ src="[^"]+"|type="application\/ld\+json"/);
    }
  });
});

describe("the page's code", () => {
  const src = (file: string) => join("src", file);
  const sources = [
    ...readdirSync(import.meta.dirname, { recursive: true, encoding: "utf8" }).filter((file) => /\.tsx?$/.test(file) && !file.includes(".test.")).map(src),
    "public/theme-init.js",
  ];
  const KEEPERS = [src("theme.ts"), "public/theme-init.js"];

  it("keeps one thing in the browser, the reader's theme, and only theme.ts and theme-init.js touch it: progress lives on each guide's own address, and the guides' cookies are only read here", () => {
    for (const file of sources) {
      const code = read(file);
      expect(code, file).not.toMatch(/sessionStorage|indexedDB|cookieStore/);
      if (!KEEPERS.includes(file)) expect(code, file).not.toMatch(/localStorage/);
      // (and Safari has kept a cookie written by script for as little as a week)
      expect(code, file).not.toMatch(/document\.cookie\s*=(?!=)/);
    }
  });

  it("keeps the theme under one key, hundo.theme, the same in both files", () => {
    expect(THEME_KEY).toBe("hundo.theme");
    const calls = (file: string) => [...read(file).matchAll(/localStorage\.(\w+)\(([^,)]*)/g)].map(([, method, key]) => `${method} ${key}`);
    expect(calls("public/theme-init.js")).toEqual(['getItem "hundo.theme"']);
    expect(calls(src("theme.ts")).sort()).toEqual(["removeItem THEME_KEY", "setItem THEME_KEY"]);
  });

  it("puts a kept theme back before the first paint: theme-init.js in the head of both pages, ahead of the stylesheets and the module", () => {
    for (const page of ["index.html", "404.html"]) {
      const html = read(page);
      const init = html.indexOf('<script src="/theme-init.js"></script>');
      expect(init, page).toBeGreaterThan(html.lastIndexOf('<meta name="theme-color"'));
      expect(init, page).toBeLessThan(html.indexOf("<!--home:head-->"));
      expect(init, page).toBeLessThan(html.indexOf('<script type="module"'));
    }
  });
});
