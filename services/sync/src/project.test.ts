import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { GUIDES } from "./app";

// What the deploy of this project depends on, held to what Vercel's docs and past deployments taught.
const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");
const files = (dir: string): string[] =>
  readdirSync(join(root, dir)).flatMap((name) => {
    const path = join(dir, name);
    return statSync(join(root, path)).isDirectory() ? files(path) : [path];
  });

describe("the guides", () => {
  it("lists every guide's brand id, so a new guide can't be turned away by the API", () => {
    const apps = join(root, "../../apps");
    const ids = readdirSync(apps)
      .filter((name) => existsSync(join(apps, name, "src/guide/brand.ts")))
      .map((name) => /^\s*id:\s*"([^"]+)"/m.exec(readFileSync(join(apps, name, "src/guide/brand.ts"), "utf8"))?.[1]);
    expect(ids.length).toBeGreaterThan(0);
    expect([...GUIDES].sort()).toEqual(ids.sort());
  });
});

describe("api/", () => {
  it("holds one thin function a route and nothing else, since each file there becomes a function", () => {
    expect(files("api").sort()).toEqual(["api/forget.ts", "api/pair/claim.ts", "api/pair/start.ts", "api/status.ts", "api/sync.ts", "api/unlink.ts"]);
    for (const path of files("api")) {
      const up = "../".repeat(path.split("/").length - 1);
      expect(read(path), path).toBe(
        `import { handle } from "${up}src/app";\nimport { depsFromEnv } from "${up}src/deps";\n\nexport default { fetch: (request: Request) => handle(request, depsFromEnv()) };\n`,
      );
    }
  });

  it("covers every route the handler answers", () => {
    const source = read("src/app.ts");
    const routes = [...source.matchAll(/^\s*"(\/api\/[a-z/]+)": \w+,$/gm)].map(([, route]) => route);
    expect(routes.length).toBe(6);
    expect(routes.map((route) => `${route.slice(1)}.ts`).sort()).toEqual(files("api").sort());
  });
});

describe("a self-contained function", () => {
  // Vercel does not run TypeScript from another workspace package, so the service imports nothing outside its folder.
  it("imports only its own files and Node's", () => {
    const own = [...files("api"), ...files("src")].filter((path) => !path.endsWith(".test.ts") && !path.endsWith("harness.ts"));
    expect(own.length).toBeGreaterThan(5);
    for (const path of own) {
      for (const [, specifier] of read(path).matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)) {
        if (specifier.startsWith("node:")) continue;
        expect(specifier.startsWith("."), `${path} imports ${specifier}`).toBe(true);
        expect(relative(root, resolve(dirname(join(root, path)), specifier)).startsWith(".."), `${path} imports ${specifier}`).toBe(false);
      }
    }
  });

  it("has no runtime dependencies to install", () => {
    const manifest = JSON.parse(read("package.json"));
    expect(manifest.dependencies).toBeUndefined();
    expect(manifest.type).toBeUndefined();
  });
});

describe("vercel.json", () => {
  const vercel = JSON.parse(read("vercel.json"));
  const headers: { key: string; value: string }[] = vercel.headers.flatMap((rule: { headers: { key: string; value: string }[] }) => rule.headers);
  const header = (key: string) => headers.find((h) => h.key === key)?.value;

  it("installs from the lockfile, builds with the typecheck and runs in Frankfurt, next to the store", () => {
    expect(vercel.installCommand).toBe("pnpm install --frozen-lockfile");
    expect(vercel.buildCommand).toBe("pnpm typecheck");
    expect(JSON.parse(read("package.json")).scripts.typecheck).toBeDefined();
    expect(vercel.regions).toEqual(["fra1"]);
  });

  it("has a static output folder, so a functions-only project still deploys", () => {
    expect(existsSync(join(root, vercel.outputDirectory, "index.html"))).toBe(true);
    expect(read(`${vercel.outputDirectory}/index.html`)).not.toMatch(/<script/i);
  });

  it("rewrites nothing, with no cleanUrls", () => {
    expect(vercel.rewrites).toBeUndefined();
    expect(vercel.cleanUrls).toBeUndefined();
  });

  it("sends the security headers, and nothing is cacheable", () => {
    expect(header("Content-Security-Policy")).toBe("default-src 'none'; frame-ancestors 'none'");
    expect(header("Cache-Control")).toBe("no-store");
    expect(header("X-Content-Type-Options")).toBe("nosniff");
    expect(header("Referrer-Policy")).toBe("no-referrer");
    expect(header("Strict-Transport-Security")).toMatch(/max-age=\d+/);
  });

  it("ignores builds for changes outside this service and what installs its packages, and only answers 0 or 1", () => {
    expect(vercel.ignoreCommand).toBe("sh scripts/vercel-ignore.sh");
    const script = read("scripts/vercel-ignore.sh");
    const code = script
      .split("\n")
      .filter((line) => !line.trim().startsWith("#"))
      .join("\n");
    const watched = /git diff --quiet [^\n]* -- ([^\n&]*)/.exec(code)?.[1].trim().split(/\s+/) ?? [];
    for (const path of [".", "../../package.json", "../../pnpm-lock.yaml", "../../pnpm-workspace.yaml", "../../tsconfig.base.json"]) expect(watched, path).toContain(path);
    // (a bare `exit` or `exit $?` would pass git's own 128 on, which Vercel reads as a failed deployment)
    const exits = [...code.matchAll(/\bexit\b([^\n;&|]*)/g)].map(([, rest]) => rest.trim());
    expect(exits.length).toBeGreaterThan(0);
    for (const value of exits) expect(["0", "1"], `exit ${value}`).toContain(value);
    expect(() => execFileSync("sh", ["-n", join(root, "scripts/vercel-ignore.sh")])).not.toThrow();
    expect(script.trim().split("\n").at(-1)?.trim()).toBe("exit 1");
  });
});
