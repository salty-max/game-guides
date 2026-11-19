// Which of the workspace's packages a change has to check (tools/check.mjs): the packages whose folders it changes, and the packages whose
// checks read the files it changes from outside their own folders. Those reads are the rules below, each with the test or the config that
// makes it. A test that starts reading a file outside its package needs its rule here, or a change to that file alone checks too little
// locally (CI still checks everything: docs/testing.md#what-pnpm-check-runs).
//
// A file no rule names checks every package, unless it is one of the files no package's check reads (OUTSIDE): the docs, the skills, the
// harness, these tools, Lighthouse's runner, CI's own config.
//
// changesOf and workspaceOf read a checkout; guidesOf picks the guides a browser job looks at (guide-check's shoot.mjs, Lighthouse's
// run.mjs).
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Files no package's lint, typecheck, tests or build reads. README.md, .claude/launch.json and ci.yml are read (core's wiring.test.ts). */
const OUTSIDE = [
  (file) => /^[^/]+\.md$/.test(file) && file !== "README.md",
  (file) => file.startsWith("docs/"),
  (file) => file.startsWith(".claude/") && file !== ".claude/launch.json",
  (file) => file.startsWith(".github/") && file !== ".github/workflows/ci.yml",
  (file) => file.startsWith("harness/") || file === "harness.toml",
  (file) => file.startsWith("tools/") || file.startsWith("lighthouse/"),
  (file) => file === ".gitignore",
];

/** The guide whose data and icons the stories render (packages/stories/.storybook/main.ts: virtual:guide, the brand tile). */
const STORIES_GUIDE = "koholint";

/**
 * The package folders one changed file asks the check to run, or "all". `packages` is every package folder of the workspace
 * (`apps/koholint`, `packages/core`, …).
 */
export const packagesFor = (file, packages) => {
  const apps = packages.filter((dir) => dir.startsWith("apps/"));
  if (OUTSIDE.some((rule) => rule(file))) return [];
  const [top, name, ...rest] = file.split("/");
  const inside = rest.join("/");
  if (top === "packages" && name === "core") {
    // Core has no tests or typecheck of its own: every guide runs core's suites and typechecks core against its own config, and the stories
    // render core's components. Every package's lint reads core's app.css (eslint.config.js's Tailwind entry point), the sync API's too.
    return ["packages/core", ...packages.filter((dir) => dir !== "packages/core")];
  }
  if (top === "packages" && name === "stories") return ["packages/stories"];
  if (top === "services" && name === "sync") {
    // Core's sync tests drive the API's own code (core's test/sync-world.ts imports src/harness.ts, and through it app, store and ledger),
    // in every guide's tests and typecheck, under the guides' stricter tsconfig; core's sync/ledger.test.ts holds its copy of the ledger to
    // this one. The API's tests, api/ and config are its own.
    return inside.startsWith("src/") && !inside.endsWith(".test.ts") ? ["services/sync", ...apps] : ["services/sync"];
  }
  if (top === "apps" && packages.includes(`apps/${name}`)) {
    const own = [`apps/${name}`];
    // Every guide's deploy.test.ts holds each guide's vercel.json to its own, and wiring.test.ts reads each guide's package.json and counts the
    // guides by their vercel.json, as the stories' guides.test.ts does.
    if (inside === "vercel.json" || inside === "package.json") return [...apps, "packages/stories"];
    // The sync API's project.test.ts reads every guide's id from its brand.ts; the stories show every guide's brand, palette and fonts.
    if (inside === "src/guide/brand.ts") return [...own, "services/sync", "packages/stories"];
    if (inside === "src/guide/theme.css" || inside.startsWith("public/fonts/")) return [...own, "packages/stories"];
    // The stories render one guide's data, with its icons.
    if (name === STORIES_GUIDE && (inside.startsWith("src/guide/") || inside.startsWith("public/icons/"))) return [...own, "packages/stories"];
    return own;
  }
  // The root's own files (package.json, the lockfile, tsconfig.base.json, eslint.config.js, scripts/, README.md, …), a new package, anything
  // else: every package.
  return "all";
};

/** The package folders a change to these files asks the check to run, in the workspace's order, or "all". */
export const scopeOf = (files, packages) => {
  const wanted = new Set();
  for (const file of files) {
    const these = packagesFor(file, packages);
    if (these === "all") return "all";
    for (const dir of these) wanted.add(dir);
  }
  return packages.filter((dir) => wanted.has(dir));
};

/** The branch a change is measured against: main as this checkout last fetched it. */
export const BASE = "origin/main";

/** Every package folder of a checkout's workspace (pnpm-workspace.yaml: apps/*, packages/*, services/*), in that order. */
export const workspaceOf = (root) =>
  ["packages", "services", "apps"].flatMap((top) =>
    readdirSync(join(root, top), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(root, top, entry.name, "package.json")))
      .map((entry) => `${top}/${entry.name}`)
      .sort(),
  );

/**
 * What a commit of a checkout's working directory would change against BASE (or another ref): the files its branch commits since it left
 * that ref, what it stages and doesn't, and the untracked files git doesn't ignore. `base` is the merge base's sha. Undefined when there is
 * no such ref, or when git fails to say.
 */
export const changesOf = (root, against = BASE) => {
  const git = (...args) => {
    try {
      return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      return undefined;
    }
  };
  const base = git("merge-base", "HEAD", against);
  const diff = base && git("diff", "--name-only", "--no-renames", base);
  const untracked = base && git("ls-files", "--others", "--exclude-standard");
  // Any of them failing tells nothing about what changed: never "nothing changed".
  if (base === undefined || diff === undefined || untracked === undefined) return undefined;
  const lines = (text) => text.split("\n").filter(Boolean);
  return { base, files: [...new Set([...lines(diff), ...lines(untracked)])] };
};

/** The guides that cover both layouts, both corner presets and three palettes: a browser job's pick for a change that reaches every guide. */
export const COVERING_GUIDES = ["koholint", "rdr", "echoes"];

/**
 * The guides (folder names in apps/) whose pages a change to these files can change, for a browser job to look at: `guides`, those whose own
 * files it changes, and `every`, whether it also changes core or the root's files, which reach every guide's pages. Not the check's scope:
 * the sync API's code is tested in every guide, and a guide's vercel.json in all of them, but neither changes another guide's page.
 */
export const guidesOf = (files, packages) => {
  const own = new Set();
  let every = false;
  for (const file of files) {
    const reach = packagesFor(file, packages);
    if (reach === "all" || reach.includes("packages/core")) every = true;
    const [top, name] = file.split("/");
    if (top === "apps" && packages.includes(`apps/${name}`)) own.add(name);
  }
  const apps = packages.filter((dir) => dir.startsWith("apps/")).map((dir) => dir.slice("apps/".length));
  return { every, guides: apps.filter((name) => own.has(name)) };
};
