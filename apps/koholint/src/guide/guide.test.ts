import { allRows, chapters, coreRows } from "@hundo/core/guide";
import { STORAGE_KEY, defaultState, validateState } from "@hundo/core/progress-state";
import { readRunLog } from "./run-log";
import { THEME_KEY } from "@hundo/core/store/theme";
import { AWAKE_KEY } from "@hundo/core/store/awake";
import { PLACE_KEY } from "@hundo/core/store/place";
import { SYNC_KEY } from "@hundo/core/sync/local";
import { flatten, viewFrom } from "@hundo/core/sync/fields";
import type { Entries } from "@hundo/core/sync/ledger";

const [a] = allRows.map((row) => row.id);

describe("Koholint completion", () => {
  it("cites sources for every chapter", () => {
    for (const chapter of chapters) expect(chapter.sources.length, chapter.title).toBeGreaterThan(0);
  });

  it("keeps optional amiibo out of overall completion", () => {
    expect(coreRows.length).toBeLessThan(allRows.length);
    expect(coreRows.every((row) => !row.tags.includes("amiibo"))).toBe(true);
  });

  it("labels instruments and other route rows by what they award, not as route steps", () => {
    for (const row of allRows) if (row.tags.length > 1) expect(row.tags[0], row.id).not.toBe("story");
    expect(allRows.find((row) => row.id === "tail-cello")?.tags).toEqual(["instrument", "story"]);
  });
});

describe("Koholint saves from before the shared format", () => {
  const v1 = { version: 1, checks: { [a]: true }, ceiling: 3, chapter: 2, spoilers: true, mode: "hero", runs: { normal: { deaths: 2, cleared: true }, hero: { deaths: 0, cleared: false } } };

  it("loads a version 1 save with its run log", () => {
    expect(validateState(v1)).toEqual({ ...defaultState(), checks: { [a]: true }, ceiling: 3, chapter: 2, extra: { mode: "hero", runs: v1.runs } });
  });

  it("refuses a version 1 file that names a guide", () => {
    expect(() => validateState({ ...v1, guide: "echoes-of-wisdom" })).toThrow();
  });

  it("keeps the run log through export and import", () => {
    const state = validateState(v1);
    expect(validateState(JSON.parse(JSON.stringify(state)))).toEqual(state);
  });
});

describe("run log", () => {
  it("sanitises modes and counts", () => {
    const log = readRunLog({ mode: "weird", runs: { hero: { deaths: -3, cleared: "yes" }, normal: { deaths: 2, cleared: true } } });
    expect(log.mode).toBe("normal");
    expect(log.runs.hero).toEqual({ deaths: 0, cleared: false });
    expect(log.runs.normal).toEqual({ deaths: 2, cleared: true });
    expect(readRunLog(undefined)).toEqual({ mode: "normal", runs: { normal: { deaths: 0, cleared: false }, hero: { deaths: 0, cleared: false } } });
  });
});

describe("storage", () => {
  // Readers' progress and theme live under these keys on this domain: new keys start every reader from nothing.
  it("keeps its storage keys", () => {
    expect(STORAGE_KEY).toBe("koholint-field-guide.v1");
    expect(THEME_KEY).toBe("koholint-field-guide.theme");
    expect(AWAKE_KEY).toBe("koholint-field-guide.awake");
    expect(PLACE_KEY).toBe("koholint-field-guide.place");
    expect(SYNC_KEY).toBe("koholint-field-guide.sync");
  });
});

const entries = (flat: Record<string, unknown>) => Object.fromEntries(Object.entries(flat).map(([key, value]) => [key, [1, value]])) as Entries;

describe("Koholint sync", () => {
  it("syncs the run log leaf by leaf, and rebuilds the same log from them", () => {
    const extra = { mode: "hero" as const, runs: { normal: { deaths: 4, cleared: true }, hero: { deaths: 1, cleared: false } } };
    const flat = flatten({ ...defaultState(), extra });
    expect(Object.keys(flat).filter((key) => key.startsWith("x:")).sort()).toEqual(["x:mode", "x:runs.hero.cleared", "x:runs.hero.deaths", "x:runs.normal.cleared", "x:runs.normal.deaths"]);
    expect(viewFrom(entries(flat), defaultState()).extra).toEqual(extra);
  });

  it("takes one changed leaf from the group and keeps the rest of the log", () => {
    const mine = { ...defaultState(), extra: { mode: "normal" as const, runs: { normal: { deaths: 2, cleared: false }, hero: { deaths: 0, cleared: false } } } };
    expect(viewFrom(entries({ "x:runs.hero.deaths": 5 }), mine).extra).toEqual({ mode: "normal", runs: { normal: { deaths: 2, cleared: false }, hero: { deaths: 5, cleared: false } } });
  });

  it("refuses what is not a run log's, as the guide's own reader does", () => {
    expect(viewFrom(entries({ "x:mode": "godlike", "x:runs.normal.deaths": -3 }), defaultState()).extra).toEqual(defaultState().extra);
  });
});
