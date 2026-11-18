import { allRows, byId, cats, chapters, checklistOf, config, coreRows, missablesLeft, rowsByTag, tally } from "@hundo/core/guide";
import { STORAGE_KEY, defaultState, validateState } from "@hundo/core/progress-state";
import { calibrationDelta, estimate, pointsLeft, readPercent } from "./estimate";
import { THEME_KEY } from "@hundo/core/store/theme";
import { AWAKE_KEY } from "@hundo/core/store/awake";
import { PLACE_KEY } from "@hundo/core/store/place";
import { SYNC_KEY } from "@hundo/core/sync/local";
import { PERSIST_KEY } from "@hundo/core/persistence";
import { COUNTS_KEY } from "@hundo/core/counts";
import { flatten, viewFrom } from "@hundo/core/sync/fields";
import type { Entries } from "@hundo/core/sync/ledger";
import { brand } from "./brand";
import { questlines } from "./data/questlines";

const all = Object.fromEntries(allRows.map((row) => [row.id, true as const]));
const [a] = allRows.map((row) => row.id);

describe("Red Dead completion estimate", () => {
  it("keeps scraps, optional tasks and the steps before a Stranger task's last out of the estimate", () => {
    expect(coreRows.length).toBeLessThan(allRows.length);
    expect(coreRows.every((row) => !["scrap", "optional", "stranger-step"].includes(row.tags[0]))).toBe(true);
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

describe("Stranger tasks", () => {
  // The game's count: a task counts once, by its last step, however many steps it is split into.
  it("counts the game's 18", () => {
    expect(rowsByTag("stranger")).toHaveLength(18);
    expect(tally("stranger", {}).total).toBe(18);
  });

  it("ends each task's line on its counted step, every step before it a stranger-step", () => {
    const tagsOf = (id: string) => byId.get(id)!.tags;
    for (const line of questlines.lines) {
      if (line.id === "i-know-you") {
        for (const id of line.steps) expect(tagsOf(id)[0], id).toBe("optional");
        continue;
      }
      expect(tagsOf(line.steps.at(-1)!), line.id).toEqual(["stranger", "stranger-step"]);
      for (const id of line.steps.slice(0, -1)) expect(tagsOf(id), id).toEqual(["stranger-step"]);
    }
  });

  it("opens every step from the board's tile and What's left, where the Strangers chip goes", () => {
    expect(checklistOf("stranger")).toBe("/checklist/stranger-step");
    expect(config.chips.checklist).toContainEqual(["stranger-step", "Strangers"]);
    // (named so the Category select reads it as the whole of the tile's Stranger Tasks)
    expect(cats["stranger-step"][0]).toBe(`${cats.stranger[0]}, every step`);
    const steps = new Set(rowsByTag("stranger-step").map((row) => row.id));
    const lines = questlines.lines.filter((line) => line.id !== "i-know-you");
    expect(steps.size).toBeGreaterThan(rowsByTag("stranger").length);
    for (const id of lines.flatMap((line) => line.steps)) expect(steps.has(id), id).toBe(true);
  });

  it("names the place of every group with Stranger steps in it", () => {
    // Without one, a group's line lists its rows' categories, here "Stranger Tasks · Stranger Tasks, every step".
    for (const group of chapters.flatMap((chapter) => chapter.groups)) {
      if (group.rows.some((row) => row.tags.includes("stranger-step"))) expect(group.location, group.title).toBeTruthy();
    }
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
    expect(AWAKE_KEY).toBe("red-dead-field-guide.awake");
    expect(PLACE_KEY).toBe("red-dead-field-guide.place");
    expect(SYNC_KEY).toBe("red-dead-field-guide.sync");
    expect(PERSIST_KEY).toBe("red-dead-field-guide.persist");
    expect(COUNTS_KEY).toBe("red-dead-field-guide.counts");
  });

  // Every saved state and backup carries this id, and one with another id is refused.
  it("keeps its guide id", () => {
    expect(brand.id).toBe("red-dead-redemption");
  });

  // Moved from reddead.hundo.quest: the old address hands each reader's progress over to the new one.
  it("hands readers over from its old address", () => {
    expect(brand.home).toBe("https://rdr.hundo.quest");
    expect(brand.movedFrom).toContain("reddead.hundo.quest");
  });
});

const entries = (flat: Record<string, unknown>) => Object.fromEntries(Object.entries(flat).map(([key, value]) => [key, [1, value]])) as Entries;

describe("Red Dead sync", () => {
  it("syncs the reported percentage as one leaf, empty or not, and gets it back", () => {
    expect(Object.keys(flatten(defaultState())).filter((key) => key.startsWith("x:"))).toEqual(["x:reported"]);
    expect(flatten({ ...defaultState(), extra: { reported: 37.5 } })["x:reported"]).toBe(37.5);
    expect(viewFrom(entries({ "x:reported": 37.5 }), defaultState()).extra).toEqual({ reported: 37.5 });
    expect(viewFrom(entries({ "x:reported": null }), { ...defaultState(), extra: { reported: 12 } }).extra).toEqual({ reported: null });
  });

  it("refuses a percentage that isn't one", () => {
    expect(viewFrom(entries({ "x:reported": 400 }), defaultState()).extra).toEqual({ reported: null });
  });
});
