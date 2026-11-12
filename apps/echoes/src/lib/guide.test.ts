import { allRows, byId, chapters, CHAPTER_COUNT, isCategory, missablesLeft, nextUp, readChapter, rowsByTag, tally, targets, whatsLeft } from "./guide";
import { missables } from "../data/missables";

describe("guide data", () => {
  it("has its chapters in order, each with rows", () => {
    expect(chapters.map((chapter) => chapter.id)).toEqual(Array.from({ length: CHAPTER_COUNT }, (_, i) => i + 1));
    for (const chapter of chapters) {
      expect(chapter.groups.some((group) => group.rows.length)).toBe(true);
      expect(chapter.sources.length).toBeGreaterThan(0);
    }
  });

  it("has unique row ids and non-empty titles and text", () => {
    expect(byId.size).toBe(allRows.length);
    for (const row of allRows) {
      expect(row.title).not.toBe("");
      expect(row.text).not.toBe("");
    }
  });

  it("only uses known categories", () => {
    for (const row of allRows) for (const tag of row.tags) expect(isCategory(tag) || tag === "missable").toBe(true);
  });

  it("reaches every completion target of the guide's list", () => {
    for (const { tag, goal } of targets) expect(tally(tag, {}).total, tag).toBe(goal);
  });

  it("splits chests into dungeon, mini-dungeon and overworld ones", () => {
    expect(rowsByTag("chest").length).toBeGreaterThan(rowsByTag("dungeon-chest").length + rowsByTag("mini-dungeon-chest").length);
    for (const row of rowsByTag("dungeon-chest")) expect(row.tags).toContain("chest");
  });

  it("only links to https sources", () => {
    const links = [...chapters.flatMap((chapter) => [...chapter.sources, ...chapter.groups.flatMap((group) => group.sources)])];
    expect(links.length).toBeGreaterThan(0);
    for (const [label, url] of links) {
      expect(label).not.toBe("");
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("clamps chapter numbers", () => {
    expect(readChapter("3")).toBe(3);
    expect(readChapter("0", 2)).toBe(2);
    expect(readChapter(String(CHAPTER_COUNT + 1))).toBe(1);
    expect(readChapter("x", 5)).toBe(5);
  });

  it("only flags missables that exist and carry two sources", () => {
    for (const item of missables) {
      expect(byId.has(item.id)).toBe(true);
      expect(item.sources.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("route helpers", () => {
  const first = chapters[0].groups[0].rows[0];

  it("counts Might Crystals by what each entry awards", () => {
    const all = Object.fromEntries(allRows.map((row) => [row.id, true as const]));
    expect(tally("might-crystal", all)).toEqual({ done: 150, total: 150 });
    expect(tally("echo", {}).done).toBe(0);
  });

  it("picks the next unchecked steps in route order", () => {
    const next = nextUp({}, [1, 2], 3);
    expect(next).toHaveLength(3);
    expect(next[0].id).toBe(first.id);
    const after = nextUp({ [first.id]: true }, [1, 2], 3);
    expect(after.map((row) => row.id)).not.toContain(first.id);
    expect(after[0].id).toBe(next[1].id);
  });

  it("only looks at revealed chapters", () => {
    for (const row of nextUp({}, [2], 5)) expect(row.chapter).toBe(2);
    expect(nextUp({}, [], 3)).toEqual([]);
  });

  it("lists what is left per target, biggest first, and empties when done", () => {
    const left = whatsLeft({});
    expect(left).toHaveLength(targets.length);
    expect([...left].sort((a, b) => b.left - a.left)).toEqual(left);
    const all = Object.fromEntries(allRows.map((row) => [row.id, true as const]));
    expect(whatsLeft(all)).toEqual([]);
  });

  it("has nothing missable to flag", () => {
    expect(missablesLeft(chapters[0], {})).toEqual([]);
  });
});
