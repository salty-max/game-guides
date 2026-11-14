/** The deathless-run log, saved as the progress state's `extra`. */
export type RunMode = "normal" | "hero";
export interface Run {
  deaths: number;
  cleared: boolean;
}
export interface RunLog {
  mode: RunMode;
  runs: Record<RunMode, Run>;
}

declare module "../core/types" {
  interface Register {
    extra: RunLog;
  }
}

export const modeNames: Record<RunMode, string> = { normal: "Normal", hero: "Hero" };
export const blankRun = (): Run => ({ deaths: 0, cleared: false });
export const blankLog = (): RunLog => ({ mode: "normal", runs: { normal: blankRun(), hero: blankRun() } });

/** Sanitise an untrusted run log: unknown modes become Normal, bad counts become zero. */
export function readRunLog(value: unknown): RunLog {
  const v = (value ?? {}) as { mode?: unknown; runs?: Partial<Record<RunMode, Partial<Run>>> };
  const log = blankLog();
  log.mode = v.mode === "hero" ? "hero" : "normal";
  for (const mode of Object.keys(modeNames) as RunMode[]) {
    const run = v.runs?.[mode];
    if (run) {
      log.runs[mode] = {
        deaths: Number.isSafeInteger(run.deaths) && (run.deaths as number) >= 0 ? (run.deaths as number) : 0,
        cleared: run.cleared === true,
      };
    }
  }
  return log;
}
