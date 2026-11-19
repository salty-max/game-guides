import { allRows, chapters, overall, rowsByTag, tally, whatsLeft, worth } from "@hundo/core/guide";
import { STORAGE_KEY, validateState } from "@hundo/core/progress-state";
import { targets } from "./config";
import { THEME_KEY } from "@hundo/core/store/theme";
import { AWAKE_KEY } from "@hundo/core/store/awake";
import { PLACE_KEY } from "@hundo/core/store/place";
import { SYNC_KEY } from "@hundo/core/sync/local";
import { PERSIST_KEY } from "@hundo/core/persistence";
import { COUNTS_KEY } from "@hundo/core/counts";
import { flatten } from "@hundo/core/sync/fields";
import type { Checks, Row } from "@hundo/core/types";

const [a] = allRows.map((row) => row.id);
const tick = (rows: Row[]): Checks => Object.fromEntries(rows.map((row) => [row.id, true]));
const hasTarget = (row: Row) => row.tags.some((tag) => targets.some((target) => target.tag === tag));
// What 100% counts: every row that carries a target. The amiibo outfits are optional, and route and story rows are directions.
const counted = allRows.filter(hasTarget);

describe("Echoes of Wisdom completion", () => {
  it("cites sources for every chapter", () => {
    for (const chapter of chapters) expect(chapter.sources.length, chapter.title).toBeGreaterThan(0);
  });

  it("gives every entry directions", () => {
    for (const row of allRows) expect(row.text.trim(), row.id).not.toBe("");
  });

  it("reaches every target of the guide's completion list", () => {
    for (const { tag, goal } of targets) expect(tally(tag, {}).total, tag).toBe(goal);
  });

  it("counts Might Crystals by what each entry awards", () => {
    const all = Object.fromEntries(allRows.map((row) => [row.id, true as const]));
    expect(tally("might-crystal", all)).toEqual({ done: 150, total: 150 });
    expect(rowsByTag("might-crystal").some((row) => row.quantity > 1)).toBe(true);
  });

  it("counts every target, each by its goal, and leaves out only the amiibo and the route and story steps", () => {
    expect(targets.some((target) => "optional" in target && target.optional)).toBe(false);
    expect(whatsLeft({}).map((item) => item.tag).sort()).toEqual(targets.map((target) => target.tag).sort());
    expect(whatsLeft({}).reduce((sum, item) => sum + item.total, 0)).toBe(targets.reduce((sum, target) => sum + target.goal, 0));
    const off = allRows.filter((row) => !hasTarget(row));
    expect(off.length).toBeGreaterThan(0);
    expect(off.every((row) => ["route", "story", "amiibo"].includes(row.tags[0]))).toBe(true);
    for (const row of rowsByTag("amiibo")) expect(hasTarget(row), row.id).toBe(false);
  });

  // The game keeps no count of Waypoints (no counter, percentage or reward), so the guide's own list is the goal: 17 overworld ones and
  // 26 inside dungeons, each one item. A dungeon Waypoint names its kind first and carries `waypoint` after it, so one tag counts both.
  it("counts every Waypoint once, as the guide's own list of 43", () => {
    const dungeon = rowsByTag("dungeon-waypoint");
    expect(targets.find((target) => target.tag === "waypoint")?.goal).toBe(43);
    expect(rowsByTag("waypoint")).toHaveLength(43);
    expect(dungeon).toHaveLength(26);
    for (const row of dungeon) expect(row.tags, row.id).toEqual(["dungeon-waypoint", "waypoint"]);
    expect(rowsByTag("waypoint").filter((row) => !dungeon.includes(row)).every((row) => row.tags.length === 1)).toBe(true);
    // (a Waypoint is no other item the board counts)
    const others = targets.map((target) => target.tag).filter((tag) => tag !== "waypoint");
    for (const row of rowsByTag("waypoint")) expect(row.tags.some((tag) => others.includes(tag)), row.id).toBe(false);
  });

  // 100% is every target, each item once: it never shows while anything on the board is left, and What's left says what.
  it("reads 100 only with everything counted ticked, and under 100 with any one item left", () => {
    expect(overall({}).percent).toBe(0);
    expect(overall({}).label).toBe("complete");
    expect(overall(tick(counted)).percent).toBe(100);
    expect(overall(tick(allRows)).percent).toBe(100);
    expect(whatsLeft(tick(counted))).toEqual([]);
    for (const { tag } of targets) {
      // (a row that adds something to it: the Might Crystal category counts by amount)
      const left = rowsByTag(tag).find((row) => worth(row, tag) > 0)!;
      const checks = tick(counted.filter((row) => row !== left));
      expect(overall(checks).percent, tag).toBeLessThan(100);
      expect(whatsLeft(checks).map((item) => item.tag), tag).toContain(tag);
    }
  });

  it("keeps the optional amiibo out of the bar", () => {
    const amiibo = rowsByTag("amiibo");
    expect(amiibo.length).toBeGreaterThan(0);
    expect(overall(tick(amiibo)).percent).toBe(0);
    expect(overall(tick(allRows.filter((row) => !amiibo.includes(row)))).percent).toBe(100);
  });

  it("splits chests into dungeon, mini-dungeon and overworld ones", () => {
    expect(rowsByTag("chest").length).toBeGreaterThan(rowsByTag("dungeon-chest").length + rowsByTag("mini-dungeon-chest").length);
    for (const row of rowsByTag("dungeon-chest")) expect(row.tags).toContain("chest");
    // (one second tag names the overworld ones, so a dungeon chest isn't a chest and a dungeon chest both)
    const overworld = rowsByTag("chest").filter((row) => !row.tags.includes("dungeon-chest") && !row.tags.includes("mini-dungeon-chest"));
    // (a chest that awards a bottle, crystals or an accessory counts as that, once: eight overworld ones, and two inside dungeons that carry
    // neither the dungeon tag nor the overworld one, since the dungeon chests are the guide's own list and not a game total)
    const counted = (row: Row) => row.tags.filter((tag) => targets.some((target) => target.tag === tag && tag !== "overworld-chest")).length;
    expect(rowsByTag("overworld-chest").map((row) => row.id)).toEqual(overworld.filter((row) => counted(row) === 0).map((row) => row.id));
    expect(overworld.length - rowsByTag("overworld-chest").length).toBe(10);
    for (const id of ["chest-suthorn-ruins-heart-pin", "chest-castle-frog-ring"]) {
      const row = rowsByTag("accessory").find((candidate) => candidate.id === id)!;
      expect(row.tags, id).toEqual(["chest", "accessory"]);
    }
  });

  it("counts a minigame entry once: only those that award nothing the board counts already carry the minigame target", () => {
    const others = targets.map((target) => target.tag).filter((tag) => tag !== "minigame-extra");
    const extra = rowsByTag("minigame").filter((row) => !row.tags.some((tag) => others.includes(tag)));
    expect(rowsByTag("minigame-extra").map((row) => row.id)).toEqual(extra.map((row) => row.id));
    expect(rowsByTag("minigame").length).toBeGreaterThan(rowsByTag("minigame-extra").length);
  });

  // One each: a guide's own list counts only rows no other target counts, while a game's list keeps every row it lists (a side quest and
  // the accessory it awards are two items the game lists).
  it("counts a row of the guide's own lists under no other target", () => {
    const own = ["dungeon-chest", "mini-dungeon-chest", "overworld-chest", "equipment", "ability", "upgrade", "milestone", "minigame-extra", "waypoint"];
    for (const tag of own) {
      expect(targets.some((target) => target.tag === tag), tag).toBe(true);
      for (const row of rowsByTag(tag)) expect(row.tags.filter((other) => other !== tag && targets.some((target) => target.tag === other)), `${row.id} (${tag})`).toEqual([]);
    }
  });
});

describe("Echoes of Wisdom saves from before the shared format", () => {
  const v1 = { version: 1, guide: "echoes-of-wisdom", checks: { [a]: true }, ceiling: 4, chapter: 3, spoilers: false };

  it("loads a version 1 save as is", () => {
    expect(validateState(v1)).toEqual({ version: 3, guide: "echoes-of-wisdom", checks: { [a]: true }, ceiling: 4, chapter: 3, spoilers: false, extra: undefined });
  });

  it("refuses other guides' and unknown versions", () => {
    for (const bad of [{ ...v1, version: 2 }, { ...v1, guide: "red-dead-redemption" }, { ...v1, guide: undefined }]) expect(() => validateState(bad)).toThrow();
  });
});

describe("storage", () => {
  // Readers' progress and theme live under these keys on this domain: new keys start every reader from nothing.
  it("keeps its storage keys", () => {
    expect(STORAGE_KEY).toBe("echoes-of-wisdom-field-guide.v1");
    expect(THEME_KEY).toBe("echoes-of-wisdom-field-guide.theme");
    expect(AWAKE_KEY).toBe("echoes-of-wisdom-field-guide.awake");
    expect(PLACE_KEY).toBe("echoes-of-wisdom-field-guide.place");
    expect(SYNC_KEY).toBe("echoes-of-wisdom-field-guide.sync");
    expect(PERSIST_KEY).toBe("echoes-of-wisdom-field-guide.persist");
    expect(COUNTS_KEY).toBe("echoes-of-wisdom-field-guide.counts");
  });
});

describe("Echoes sync", () => {
  it("has no state of its own to sync beyond the shared fields", () => {
    expect(Object.keys(flatten(validateState({ version: 3, guide: "echoes-of-wisdom", checks: { [a]: true }, ceiling: 2, chapter: 2, spoilers: true }))).sort()).toEqual([`c:${a}`, "ceiling", "chapter", "spoilers"].sort());
  });
});
