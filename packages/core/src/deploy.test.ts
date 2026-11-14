import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import page from "../index.html?raw";

// The Vercel settings each guide ships in its vercel.json, held to what past deployments taught.
const read = (app: string) => JSON.parse(readFileSync(`${app}/vercel.json`, "utf8"));
const vercel = read(process.env.GUIDE_ROOT!);
const apps = `${process.env.GUIDE_ROOT}/..`;

describe("deploy settings", () => {
  it("ships the same vercel.json as every other guide", () => {
    // (a folder with no vercel.json is no guide, such as one git left behind holding only node_modules)
    for (const app of readdirSync(apps).filter((name) => existsSync(`${apps}/${name}/vercel.json`))) {
      expect(read(`${apps}/${app}`), app).toEqual(vercel);
    }
  });

  it("installs from the lockfile and rebuilds when core or the root workspace files change", () => {
    expect(vercel.installCommand).toBe("pnpm install --frozen-lockfile");
    expect(vercel.ignoreCommand).toBe("sh ../../scripts/vercel-ignore.sh");
    const script = readFileSync(`${process.env.GUIDE_ROOT}/../../scripts/vercel-ignore.sh`, "utf8");
    const watched = /git diff --quiet [^\n]* -- ([^\n&]*)/.exec(script)?.[1].trim().split(/\s+/) ?? [];
    for (const path of [".", "../../packages/core", "../../scripts", "../../package.json", "../../pnpm-lock.yaml", "../../pnpm-workspace.yaml", "../../tsconfig.base.json"]) {
      expect(watched, path).toContain(path);
    }
  });

  it("answers only 0 (skip) or 1 (build) from the ignore step, since Vercel fails a deployment on any other code", () => {
    const path = `${process.env.GUIDE_ROOT}/../../scripts/vercel-ignore.sh`;
    const script = readFileSync(path, "utf8");
    // (a bare `exit`, `exit $?` or `exit "$code"` would pass git's own 128 on, so each exit must name 0 or 1)
    const code = script
      .split("\n")
      .filter((line) => !line.trim().startsWith("#"))
      .join("\n");
    const exits = [...code.matchAll(/\bexit\b([^\n;&|]*)/g)].map(([, rest]) => rest.trim());
    expect(exits.length).toBeGreaterThan(0);
    for (const code of exits) expect(["0", "1"], `exit ${code}`).toContain(code);
    // (a syntax error makes sh exit 2)
    expect(() => execFileSync("sh", ["-n", path])).not.toThrow();
    // (the last word is a build, so a failing git command can't leak its own exit code, as 128 once did)
    expect(script.trim().split("\n").at(-1)?.trim()).toBe("exit 1");
  });

  it("leaves cleanUrls off, since it breaks the catch-all rewrite and deep links 404", () => {
    expect(vercel.cleanUrls).toBeUndefined();
  });

  it("serves the app for every route but lets a missing asset, font or icon 404", () => {
    expect(vercel.rewrites).toHaveLength(1);
    const [{ source, destination }] = vercel.rewrites;
    expect(destination).toBe("/index.html");
    // (the source read as a regular expression, which this pattern is)
    const rewritten = (path: string) => new RegExp(`^${source}$`).test(path);
    for (const route of ["/", "/guide/3", "/checklist/heart", "/dashboard/calibration", "/sources"]) expect(rewritten(route), route).toBe(true);
    for (const file of ["/assets/index-abc123.js", "/fonts/body.woff2", "/icons/icon-192.png"]) expect(rewritten(file), file).toBe(false);
  });

  it("forbids inline scripts, and the page has none", () => {
    const csp: string = vercel.headers
      .flatMap((rule: { headers: { key: string; value: string }[] }) => rule.headers)
      .find((header: { key: string }) => header.key === "Content-Security-Policy").value;
    expect(csp).toMatch(/(^|;\s*)script-src 'self'(;|$)/);
    // theme-init.js has to stay an external file for this reason
    const scripts = [...page.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
    expect(scripts.length).toBeGreaterThan(0);
    for (const [tag, attributes, body] of scripts) {
      expect(attributes, tag).toMatch(/\bsrc="/);
      expect(body.trim(), tag).toBe("");
    }
  });
});
