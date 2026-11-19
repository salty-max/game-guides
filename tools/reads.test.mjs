// Every relative path a package's code spells out that leads out of the package's own folder to a file (an import, a `?raw` stylesheet, a
// path joined onto import.meta.dirname or a URL), held to tools/scope.mjs: a change to that file has to check the package that reads it. Not
// seen here, so scope.mjs lists them by hand: a path built from a variable (core's tests reading `${root}/README.md`, with root from
// GUIDE_ROOT; the stories' `app(\`${name}/public/fonts\`)`), a path to a folder (read whole, or listed), and paths in a tsconfig.
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { packagesFor, workspaceOf } from "./scope.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const workspace = workspaceOf(root);
const SKIP = new Set(["node_modules", "dist", "dev-dist", "coverage", "storybook-static"]);
const SOURCE = /\.(?:[cm]?[jt]sx?|css)$/;
const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".mjs", "/index.ts", "/index.tsx"];

const sources = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP.has(entry.name)) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? sources(path) : SOURCE.test(entry.name) ? [path] : [];
  });

/** The repository file a relative path in `from` names, if it is one (a folder, or a path that only makes sense from elsewhere, is none). */
const fileAt = (from, spec) => {
  const base = resolve(dirname(from), spec.replace(/[?#].*$/, ""));
  return EXTENSIONS.map((extension) => base + extension).find((path) => existsSync(path) && statSync(path).isFile());
};

/** Each [reading package, file it reads] across package folders. */
const reads = workspace.flatMap((dir) =>
  sources(join(root, dir)).flatMap((file) =>
    [...readFileSync(file, "utf8").matchAll(/["'`](\.\.\/[^"'`$\n]*)["'`]/g)].flatMap(([, spec]) => {
      const target = fileAt(file, spec);
      const path = target && relative(root, target);
      return path && !path.startsWith("..") && !path.startsWith(`${dir}/`) ? [[dir, path, relative(root, file)]] : [];
    }),
  ),
);

describe("the files a package reads from outside its folder", () => {
  it("are found (the sync API's harness from core, the guides' brands from the stories)", () => {
    assert.ok(reads.some(([dir, path]) => dir === "packages/core" && path === "services/sync/src/harness.ts"));
    assert.ok(reads.some(([dir, path]) => dir === "packages/stories" && path === "apps/rdr/src/guide/brand.ts"));
  });

  for (const [dir, path, file] of reads) {
    it(`${dir} reads ${path} (${file}): a change to it checks ${dir}`, () => {
      const scope = packagesFor(path, workspace);
      // Core's code runs in every guide's checks, not in a check of its own: a file core reads has to check the guides.
      const readers = dir === "packages/core" ? workspace.filter((other) => other.startsWith("apps/")) : [dir];
      for (const reader of readers) assert.ok(scope === "all" || scope.includes(reader), `tools/scope.mjs: ${path} should check ${reader}`);
    });
  }
});
