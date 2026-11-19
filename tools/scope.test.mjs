// node --test tools/**/*.test.mjs (pnpm check runs it when tools/ changes; the root's `pnpm test`, and so CI, always).
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { guidesOf, scopeOf } from "./scope.mjs";

const apps = ["apps/echoes", "apps/hallownest", "apps/koholint", "apps/lordran", "apps/rdr"];
const packages = ["packages/core", "packages/stories", "services/sync", ...apps];
const scope = (...files) => scopeOf(files, packages);

describe("what pnpm check runs for a change", () => {
  it("checks every package for a core change (every package's lint reads core's app.css)", () => {
    assert.deepEqual(scope("packages/core/src/components/ui/Button.tsx"), packages);
  });

  it("checks one guide for its data, its own test or its docs", () => {
    assert.deepEqual(scope("apps/lordran/src/guide/data/chapter-3.ts"), ["apps/lordran"]);
    assert.deepEqual(scope("apps/rdr/src/guide/guide.test.ts", "apps/rdr/docs/facts-to-verify.md"), ["apps/rdr"]);
  });

  it("adds the stories for the guide whose data they render, and for any guide's palette, fonts or brand", () => {
    assert.deepEqual(scope("apps/koholint/src/guide/data/chapter-1.ts"), ["packages/stories", "apps/koholint"]);
    assert.deepEqual(scope("apps/koholint/public/icons/icon-192.png"), ["packages/stories", "apps/koholint"]);
    assert.deepEqual(scope("apps/echoes/src/guide/theme.css"), ["packages/stories", "apps/echoes"]);
    assert.deepEqual(scope("apps/echoes/public/fonts/x.woff2"), ["packages/stories", "apps/echoes"]);
    assert.deepEqual(scope("apps/echoes/public/icons/icon-192.png"), ["apps/echoes"]);
  });

  it("adds the sync API for a guide's brand, where it reads the guide's id", () => {
    assert.deepEqual(scope("apps/hallownest/src/guide/brand.ts"), ["packages/stories", "services/sync", "apps/hallownest"]);
  });

  it("checks every guide and the stories for one guide's vercel.json or package.json", () => {
    assert.deepEqual(scope("apps/rdr/vercel.json"), ["packages/stories", ...apps]);
    assert.deepEqual(scope("apps/rdr/package.json"), ["packages/stories", ...apps]);
  });

  it("checks every guide too for the sync API's code, which core's sync tests run in every guide", () => {
    for (const file of ["src/app.ts", "src/harness.ts", "src/store.ts", "src/ledger.ts"]) {
      assert.deepEqual(scope(`services/sync/${file}`), ["services/sync", ...apps], file);
    }
  });

  it("checks the sync API alone for its tests, its endpoints and its config", () => {
    assert.deepEqual(scope("services/sync/src/app.test.ts", "services/sync/api/sync.ts", "services/sync/tsconfig.json"), ["services/sync"]);
  });

  it("checks the stories alone for a story", () => {
    assert.deepEqual(scope("packages/stories/src/Button.stories.tsx"), ["packages/stories"]);
  });

  it("checks every package for the root's files, README.md and ci.yml (core's tests read them), and anything unknown", () => {
    for (const file of ["package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml", "tsconfig.base.json", "eslint.config.js", "scripts/vercel-ignore.sh", "README.md", ".github/workflows/ci.yml", ".claude/launch.json", ".npmrc", "apps/newguide/src/x.ts"]) {
      assert.equal(scope(file), "all", file);
    }
  });

  it("checks nothing for what no package's check reads", () => {
    assert.deepEqual(scope("docs/testing.md", "CLAUDE.md", ".claude/skills/guide-check/SKILL.md", "harness/q.ts", "harness.toml", "tools/check.mjs", "lighthouse/run.mjs", ".github/dependabot.yml", ".gitignore"), []);
  });

  it("joins the packages of several files, in the workspace's order", () => {
    assert.deepEqual(scope("services/sync/api/sync.ts", "apps/rdr/src/guide/data/x.ts", "docs/core.md"), ["services/sync", "apps/rdr"]);
  });
});

describe("the guides a browser job looks at for a change", () => {
  const guides = (...files) => guidesOf(files, packages);

  it("are the guides whose own files it changes", () => {
    assert.deepEqual(guides("apps/rdr/src/guide/data/x.ts", "apps/echoes/src/guide/theme.css"), { every: false, guides: ["echoes", "rdr"] });
    assert.deepEqual(guides("apps/rdr/vercel.json"), { every: false, guides: ["rdr"] });
  });

  it("reach every guide for core or the root's files, and keep the guides whose own files change", () => {
    assert.deepEqual(guides("packages/core/src/App.tsx"), { every: true, guides: [] });
    assert.deepEqual(guides("apps/lordran/src/guide/data/x.ts", "pnpm-lock.yaml"), { every: true, guides: ["lordran"] });
  });

  it("are none for the sync API's code, a story or the docs, which change no guide's page", () => {
    assert.deepEqual(guides("services/sync/src/ledger.ts", "packages/stories/src/Button.stories.tsx", "docs/core.md"), { every: false, guides: [] });
  });
});
