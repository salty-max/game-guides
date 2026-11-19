// `pnpm check`: lint, typecheck, tests and build, in that order, for the packages this tree changes against main and the packages whose checks
// read what it changes (tools/scope.mjs). A core change still checks every guide and the stories; a guide's data, that guide.
//
//   pnpm check              the packages the change reaches (the first line names them, and why)
//   pnpm check --all        every package, as CI does (CI runs the root's lint, typecheck, test and build scripts, which take every package)
//   pnpm check --base <ref> the packages the change reaches against another ref than origin/main (a branch this one stacks on)
//   pnpm check --dry-run    the first line alone: what it would check, and why
//
// Only the plain `bun run check` stamps the tree for the push gate (q stamps the repository's own check command, word for word): a check with
// --all or --base passes or fails, and stamps nothing.
//
// "This tree" is what a commit of the working directory would hold: what the branch commits since it left origin/main (as last fetched), what
// it stages and doesn't, and the untracked files git doesn't ignore. With no origin/main to compare with, or with CI set, every package. A
// change to tools/ runs these tools' own tests. The harness's `bun run check` is this, so the tree it stamps is checked for what it changes:
// the packages it leaves as main has them passed CI there (docs/testing.md#what-pnpm-check-runs).
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { BASE, changesOf, packagesFor, scopeOf, workspaceOf } from "./scope.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
/** How many packages' tests run at once: two guides' jsdom suites, or one beside the stories' Chrome (docs/testing.md#what-pnpm-check-runs). */
const TEST_CONCURRENCY = 2;

const workspace = workspaceOf(root);

const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

/** The flags, read strictly: a typo (`--al`) must not pass for a check it isn't. */
const flags = { all: false, dryRun: false, base: undefined };
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === "--all") flags.all = true;
  else if (arg === "--dry-run") flags.dryRun = true;
  else if (arg === "--base" && process.argv[i + 1] && !process.argv[i + 1].startsWith("-")) flags.base = process.argv[++i];
  else if (arg.startsWith("--base=") && arg.length > "--base=".length) flags.base = arg.slice("--base=".length);
  else {
    console.error(`check: what is ${arg}? Usage: pnpm check [--all | --base <ref>] [--dry-run]`);
    process.exit(2);
  }
}

const pickScope = () => {
  if (flags.all) return { scope: "all", why: "every package (--all)" };
  if (process.env.CI) return { scope: "all", why: "every package (CI)" };
  const ref = flags.base ?? BASE;
  const changes = changesOf(root, ref);
  if (!changes && flags.base) {
    console.error(`check: git can't compare this tree with ${ref}: is it a ref here?`);
    process.exit(2);
  }
  if (!changes) return { scope: "all", why: `every package: git couldn't say what changes against ${ref}` };
  const { base, files: changed } = changes;
  const against = `against ${ref} (${base.slice(0, 7)})`;
  const tools = changed.some((file) => file.startsWith("tools/"));
  const widest = changed.find((file) => packagesFor(file, workspace) === "all");
  if (widest) return { scope: "all", tools, why: `every package: ${widest} changes ${against}` };
  const scope = scopeOf(changed, workspace);
  if (!changed.length) return { scope, tools, why: `nothing to check: this tree is ${ref}'s (${base.slice(0, 7)})` };
  const shown = `${changed.slice(0, 3).join(", ")}${changed.length > 3 ? `, ${changed.length - 3} more` : ""}`;
  if (!scope.length) return { scope, tools, why: `${tools ? "the tools' tests" : "nothing to check"}: no package reads what this tree changes ${against} (${shown})` };
  return { scope, tools, why: `${scope.join(", ")}: what this tree changes ${against} (${shown}). \`pnpm check --all\` checks every package` };
};

const { scope, tools, why } = pickScope();
console.log(`check: ${why}`);
if (flags.dryRun) process.exit(0);
if (scope === "all" || tools) run("node", ["--test", "tools/**/*.test.mjs"]);
if (scope === "all" || scope.length) {
  const select = scope === "all" ? ["-r"] : scope.flatMap((dir) => ["--filter", `./${dir}`]);
  const steps = [
    // Each package's ESLint keeps its results in its node_modules/.cache, keyed on each file's content and the config (eslint.config.js puts
    // what else the lint reads in it). The typecheck and the build's tsc reuse tsconfig.base.json's incremental build info the same way.
    ["lint", [], ["--cache", "--cache-strategy", "content", "--cache-location", "node_modules/.cache/eslint/"]],
    ["typecheck", [], []],
    ["test", [`--workspace-concurrency=${TEST_CONCURRENCY}`], []],
    ["build", [], []],
  ];
  for (const [script, flags, args] of steps) run("pnpm", [...select, ...flags, "--if-present", "run", script, ...args]);
}
