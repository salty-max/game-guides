import { allRows, chapters, coreRows } from "@game-guides/core/guide";
import { defaultState, validateState } from "@game-guides/core/progress-state";
import { readRunLog } from "./run-log";

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
