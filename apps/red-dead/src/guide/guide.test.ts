import { allRows, chapters, coreRows, missablesLeft } from "@hundo/core/guide";
import { STORAGE_KEY, defaultState, validateState } from "@hundo/core/progress-state";
import { calibrationDelta, estimate, pointsLeft, readPercent } from "./estimate";
import { THEME_KEY } from "@hundo/core/store/theme";

const all = Object.fromEntries(allRows.map((row) => [row.id, true as const]));
const [a] = allRows.map((row) => row.id);

describe("Red Dead completion estimate", () => {
  it("keeps scraps and optional tasks out of the estimate", () => {
    expect(coreRows.length).toBeLessThan(allRows.length);
    expect(coreRows.every((row) => !["scrap", "optional"].includes(row.tags[0]))).toBe(true);
  });

  it("totals roughly 100% when everything is checked", () => {
    expect(estimate({}, coreRows)).toBe(0);
    expect(estimate(all, coreRows)).toBeGreaterThanOrEqual(99);
    expect(estimate(all, coreRows)).toBeLessThanOrEqual(100);
  });

  it("totals the points left per category to the whole estimate", () => {
    expect(pointsLeft({}, coreRows).reduce((sum, item) => sum + item.left, 0)).toBeGreaterThanOrEqual(99);
    expect(pointsLeft(all, coreRows).every((item) => item.left === 0)).toBe(true);
  });

  it("flags the time-limited Stranger chain", () => {
    expect(missablesLeft(chapters[0], {}).map((row) => row.id)).toContain("optional-i-know-you-start");
    expect(missablesLeft(chapters[0], { "optional-i-know-you-start": true })).toEqual([]);
  });

  it("measures calibration against the game's number", () => {
    expect(calibrationDelta(40.3, 41)).toBe(0.7);
    expect(calibrationDelta(41, 40.2)).toBe(-0.8);
  });
});

describe("Red Dead saves from before the shared format", () => {
  const base = { guide: "red-dead-redemption", checks: { [a]: true }, ceiling: 2, chapter: 2, spoilers: false };

  it("loads a version 1 save and leaves the reported percentage empty", () => {
    expect(validateState({ ...base, version: 1, reported: 50 })).toEqual({ ...defaultState(), checks: { [a]: true }, ceiling: 2, chapter: 2, spoilers: false, extra: { reported: null } });
  });

  it("loads a version 2 save with its reported percentage", () => {
    expect(validateState({ ...base, version: 2, reported: 37.46 }).extra).toEqual({ reported: 37.5 });
  });

  it("keeps the reported percentage through export and import", () => {
    const state = validateState({ ...base, version: 2, reported: 41 });
    expect(validateState(JSON.parse(JSON.stringify(state)))).toEqual(state);
  });

  it("refuses unknown versions and other guides", () => {
    for (const bad of [{ ...base, version: 4 }, { ...base, version: 1, guide: "echoes-of-wisdom" }, { ...base, version: 1, guide: undefined }]) expect(() => validateState(bad)).toThrow();
  });
});

describe("in-game percentage", () => {
  it("keeps a valid number to a tenth and drops anything else", () => {
    expect(readPercent("12")).toBe(12);
    expect(readPercent(0)).toBe(0);
    for (const bad of [140, -1, "x", NaN, null, undefined, true, {}]) expect(readPercent(bad)).toBeNull();
  });
});

describe("storage", () => {
  // Readers' progress and theme live under these keys on this domain: new keys start every reader from nothing.
  it("keeps its storage keys", () => {
    expect(STORAGE_KEY).toBe("red-dead-field-guide.v1");
    expect(THEME_KEY).toBe("red-dead-field-guide.theme");
  });
});
