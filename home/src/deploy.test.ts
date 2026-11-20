// What Vercel serves the landing page with (vercel.json), held to the guides' bar: the same security headers, no inline script, the long
// cache only on a file that exists, an ignore step that only ever answers 0 or 1, and what a search engine reads.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

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
  it("keeps nothing in the browser: progress lives on each guide's own address", () => {
    const sources = readdirSync(import.meta.dirname, { recursive: true, encoding: "utf8" }).filter((file) => /\.tsx?$/.test(file) && !file.includes(".test."));
    for (const file of sources) expect(readFileSync(join(import.meta.dirname, file), "utf8"), file).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
  });
});
