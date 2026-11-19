// Takes a heavy browser job's turn in the machine's queue (harness/queue.ts), so two of them never run at once: with several sessions each
// running Lighthouse, screenshot sweeps or `pnpm check`'s stories, the Mac's load passed 200 and its swap filled.
//
//   import { queueSelf } from "…/tools/queued.mjs";
//   await queueSelf("lighthouse");      // before the job's work, after its imports and any check of its arguments
//
// A check that can end the run without work (no guide to look at, a usage error) goes before it, as in lighthouse/run.mjs and
// guide-check's shoot.mjs, so such a run doesn't wait for its turn first.
//
// The script runs again through `bun harness/q.ts --queue <name> -- …`: it waits its turn behind a `check` or another job (one line on
// stderr says who holds the place), keeps the output in .cache/logs, prints q's verdict line (which ends with that log's path) and then the
// log's last lines, where a table or a report is. The exit code is the job's. The job goes straight to running, as it always did, when
//   - it is CI (`CI` is set: no bun, and no one to share the machine with),
//   - HARNESS_QUEUE=off,
//   - it already runs inside a queued command (`bun harness/q.ts --queue screenshots -- pnpm screenshots`, or a `check`: HARNESS_QUEUE_HELD
//     names a live holder) or inside this module's own re-run, or
//   - bun or harness/q.ts isn't there.
// A job that waits can wait for minutes: run it in the background, since a foreground tool call that times out loses its place.
//
// This lives in tools/, which no guide's or the API's Vercel ignore command watches: a file in scripts/ or a change to the root
// package.json rebuilds every guide on the next merge.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { constants } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const q = fileURLToPath(new URL("../harness/q.ts", import.meta.url));
/** How many of the log's last lines are shown after q's verdict. */
const TAIL = 50;

/** Whether a pid is a process that still runs (EPERM: it does, it isn't ours). */
const alive = (value) => {
  const pid = Number(value);
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
};

/** Whether this run should take a place in the queue: not CI, not switched off, not already inside one, and the queue is here. */
export const shouldQueue = (env = process.env) => !env.CI && env.HARNESS_QUEUE !== "off" && !env.HUNDO_QUEUED && !alive(env.HARNESS_QUEUE_HELD) && existsSync(q);

/** What a process was started as, without the program: its arguments, as `ps` shows them. */
const argumentsOf = (pid) => spawnSync("/bin/ps", ["-o", "command=", "-p", String(pid)], { encoding: "utf8" }).stdout.trim().replace(/^\S+\s*/, "");

/**
 * Whether this process runs under a shim of itself, as `node` does on a machine with Volta: the pid a caller holds is the shim's, a
 * signal sent to it stops the shim and not this process, and the job would go on (or start later, from the queue) with nobody to stop it.
 */
const underShim = () => process.ppid > 1 && argumentsOf(process.ppid) !== "" && argumentsOf(process.ppid) === argumentsOf(process.pid);

/**
 * Runs a command with this process's terminal; a signal sent to this process goes on to it, and so does the end of the shim this process
 * runs under, if any. Its output is passed on as it comes and also handed back. Resolves with its exit code and output, or with the error
 * that kept it from starting.
 */
const run = (file, args, env) =>
  new Promise((done) => {
    const child = spawn(file, args, { stdio: ["inherit", "pipe", "inherit"], env });
    const shim = process.ppid;
    const orphaned = underShim() ? setInterval(() => !alive(shim) && child.kill("SIGTERM"), 1000) : undefined;
    let out = "";
    child.stdout.on("data", (chunk) => {
      out += chunk;
      process.stdout.write(chunk);
    });
    const handlers = ["SIGINT", "SIGTERM", "SIGHUP"].map((signal) => [signal, () => child.kill(signal)]);
    for (const [signal, handler] of handlers) process.on(signal, handler);
    const finish = (result) => {
      clearInterval(orphaned);
      for (const [signal, handler] of handlers) process.off(signal, handler);
      done(result);
    };
    child.on("error", (error) => finish({ error }));
    child.on("close", (code, signal) => finish({ code: code ?? 128 + (constants.signals[signal] ?? 0), out }));
  });

/** bun's own executable: `bun` is a shim on some machines (Volta's), a process of its own that a signal stops without stopping q behind it. undefined when there is no bun. */
const bun = () => {
  const found = spawnSync("bun", ["-p", "process.execPath"], { encoding: "utf8" });
  return found.error || found.status !== 0 ? undefined : found.stdout.trim() || "bun";
};

/** The end of the run's log, found from the verdict line q printed (its last field is the log's path, relative to where q ran): the lines the job printed last. */
export function logTail(name, out, count = TAIL) {
  const verdict = out.split("\n").find((line) => line.startsWith(`${name}: `) && / · \S+\.log$/.test(line));
  const shown = verdict && / · (\S+\.log)$/.exec(verdict)[1];
  const file = shown && resolve(shown);
  if (!file || !existsSync(file)) return [];
  // (the log's first line is the command, its last the exit)
  const lines = readFileSync(file, "utf8").split("\n").slice(1).filter((line) => line.trim() && !/^\[exit \d+, [\d.]+s\]$/.test(line));
  return lines.length ? [`— ${name}'s last ${Math.min(count, lines.length)} lines, from ${shown}:`, ...lines.slice(-count)] : [];
}

/**
 * Runs `command` through q's queue under `name` (letters, digits, `.`, `-`, `_`), prints the end of its log, and resolves with its exit
 * code, or with undefined when bun isn't there. Signals sent to this process reach q, which stops the job and gives its place up.
 */
export async function runQueued(name, command) {
  const exe = bun();
  if (!exe) return undefined;
  const result = await run(exe, [q, "--queue", name, "--", ...command], { ...process.env, HUNDO_QUEUED: "1" });
  if (result.error) throw result.error;
  for (const line of logTail(name, result.out)) console.log(line);
  return result.code;
}

/** Re-runs the calling script, with its arguments and from where it was started, through the queue, and exits with its code; returns when it needn't. */
export async function queueSelf(name) {
  if (!shouldQueue()) return;
  const code = await runQueued(name, [process.execPath, ...process.execArgv, ...process.argv.slice(1)]);
  if (code !== undefined) process.exit(code);
}
