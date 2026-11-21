import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
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
    // (an id may be listed before its guide exists: the id goes in a small pull request of its own, deployed first, so the new guide's previews
    // are accepted by the production API. docs/deploying.md#a-new-project. So the list may hold more than the apps, never fewer.)
    for (const id of ids) expect(GUIDES, `the guide ${id}: its brand.id in GUIDES (services/sync/src/app.ts)`).toContain(id);
  });

  it("lists each id once, as a brand id is written", () => {
    expect(new Set(GUIDES).size).toBe(GUIDES.length);
    for (const id of GUIDES) expect(id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });
});

describe("api/", () => {
  it("holds one thin function a route and nothing else, since each file there becomes a function", () => {
    expect(files("api").sort()).toEqual(["api/count.ts", "api/forget.ts", "api/pair/claim.ts", "api/pair/start.ts", "api/remove.ts", "api/status.ts", "api/summaries.ts", "api/summary.ts", "api/sync.ts", "api/unlink.ts"]);
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
    expect(routes.length).toBe(10);
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

  it("is compiled by Vercel as CommonJS with the DOM types, so the tsconfig keeps verbatimModuleSyntax off and the DOM lib on", () => {
    // (the base tsconfig turns the first on for the guides, and without them every function build logs TypeScript errors:
    // TS1295 for the imports, and Request and Response without members, seen on the first preview)
    const { compilerOptions } = JSON.parse(read("tsconfig.json"));
    expect(compilerOptions.verbatimModuleSyntax).toBe(false);
    expect(compilerOptions.lib).toContain("DOM");
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

  it("installs from the lockfile and builds with the typecheck", () => {
    expect(vercel.installCommand).toBe("pnpm install --frozen-lockfile");
    expect(vercel.buildCommand).toBe("pnpm typecheck");
    expect(JSON.parse(read("package.json")).scripts.typecheck).toBeDefined();
  });

  it("sets no regions: with [\"fra1\"] set, the functions still ran in iad1 on the first preview", () => {
    expect(vercel.regions).toBeUndefined();
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

describe("the ignore step, run against real history", () => {
  // What Vercel does: runs the script from services/sync in a clone of the repository, with the last deployed commit in
  // VERCEL_GIT_PREVIOUS_SHA, or nothing there. The answers are the exit codes: 0 skips the build, 1 builds it.
  // (without GIT_DIR and the like, which a git hook running the tests would set, and which would point this at the real repository)
  const clean = () => Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_")));
  const git = (cwd: string, ...args: string[]) =>
    execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.com", "-c", "commit.gpgsign=false", ...args], { cwd, encoding: "utf8", env: clean() }).trim();
  const repo = mkdtempSync(join(tmpdir(), "hundo-ignore-"));
  const sync = join(repo, "services/sync");
  const commit = (file: string, text: string) => {
    mkdirSync(dirname(join(repo, file)), { recursive: true });
    writeFileSync(join(repo, file), text);
    git(repo, "add", "-A");
    git(repo, "commit", "-q", "-m", file);
    return git(repo, "rev-parse", "HEAD");
  };
  const answer = (previous?: string) => {
    const env = clean();
    delete env.VERCEL_GIT_PREVIOUS_SHA;
    if (previous !== undefined) env.VERCEL_GIT_PREVIOUS_SHA = previous;
    try {
      execFileSync("sh", ["scripts/vercel-ignore.sh"], { cwd: sync, env, stdio: "ignore" });
      return 0;
    } catch (error) {
      return (error as { status: number }).status;
    }
  };

  // c1 starts the service, c2 changes it, c3 is a docs commit on top of it, c4 changes the lockfile, c5 is a docs fix on top of that
  git(repo, "init", "-q", "-b", "main");
  mkdirSync(join(sync, "scripts"), { recursive: true });
  copyFileSync(join(root, "scripts/vercel-ignore.sh"), join(sync, "scripts/vercel-ignore.sh"));
  const c1 = commit("services/sync/api/sync.ts", "1");
  const c2 = commit("services/sync/src/app.ts", "2");
  const c3 = commit("docs/a.md", "3");
  const c4 = commit("pnpm-lock.yaml", "4");
  const c5 = commit("docs/b.md", "5");
  const c6 = commit("apps/koholint/x.ts", "6");

  afterAll(() => rmSync(repo, { recursive: true, force: true }));

  it("builds when no earlier deployment names a commit to compare with, however the last commit looks", () => {
    // (at c3, c5 and c6 the last commit alone touches nothing the service uses, though c2 and c4 before them did)
    for (const head of [c2, c3, c4, c5, c6]) {
      git(repo, "checkout", "-q", head);
      expect(answer(), head).toBe(1);
      expect(answer(""), head).toBe(1);
    }
  });

  it("builds when the earlier commit is gone from the clone", () => {
    git(repo, "checkout", "-q", c5);
    expect(answer("0123456789abcdef0123456789abcdef01234567")).toBe(1);
  });

  it("skips a build for a range that changes nothing the service uses, and builds for one that does", () => {
    git(repo, "checkout", "-q", c3);
    expect(answer(c2)).toBe(0);
    git(repo, "checkout", "-q", c6);
    expect(answer(c4)).toBe(0);
    expect(answer(c2)).toBe(1);
    expect(answer(c1)).toBe(1);
    git(repo, "checkout", "-q", c5);
    expect(answer(c3)).toBe(1);
  });
});

