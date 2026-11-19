// @vitest-environment node
import { allRows, brand, byId, cats, chapterRows, chapters, CHAPTER_COUNT, completion, config, guideAnchor, hasMissables, isCategory, missablesLeft, nextUp, readChapter, rowsByTag, tally, whatsLeft } from "./guide";

const everything = Object.fromEntries(allRows.map((row) => [row.id, true as const]));
const hosts = (urls: string[]) => new Set(urls.map((url) => new URL(url).host));

describe("guide data", () => {
  it("names the game in the page's title and description, the only places the game's full name is", () => {
    expect(brand.title).toContain(brand.game);
    expect(brand.description).toContain(brand.game);
  });

  it("has its chapters in order, each with rows", () => {
    expect(chapters.map((chapter) => chapter.id)).toEqual(Array.from({ length: CHAPTER_COUNT }, (_, i) => i + 1));
    for (const chapter of chapters) expect(chapterRows(chapter).length, chapter.title).toBeGreaterThan(0);
  });

  it("has unique row ids and a title on every row", () => {
    expect(byId.size).toBe(allRows.length);
    for (const row of allRows) expect(row.title.trim(), row.id).not.toBe("");
  });

  it("only uses known categories, and leaves core's own tags ('missable', 'one-way') to core", () => {
    for (const [id, tags] of config.chapters.flatMap((chapter) => chapter.groups.flatMap((group) => group.rows))) {
      expect(tags.includes("missable") || tags.includes("one-way"), `${id}: core adds these from missables.ts and choices.ts`).toBe(false);
    }
    for (const row of allRows) {
      expect(isCategory(row.tags[0]), row.id).toBe(true);
      for (const tag of row.tags) expect(isCategory(tag) || tag === "missable" || tag === "one-way", `${row.id}: ${tag}`).toBe(true);
    }
    const configured = [...config.chips.checklist, ...(config.chips.route ?? [])].map(([id]) => id);
    const board = completion.board.flatMap((item) => (item.opens ? [item.tag, item.opens] : [item.tag]));
    for (const tag of [...configured, ...board, ...(config.quantity ? [config.quantity] : [])]) {
      expect(isCategory(tag), tag).toBe(true);
    }
  });

  it("opens each board target on a checklist that lists every row it counts, and more", () => {
    for (const { tag, opens } of completion.board) {
      if (!opens) continue;
      for (const row of rowsByTag(tag)) expect(row.tags, `${tag} → ${opens}: ${row.id}`).toContain(opens);
      expect(rowsByTag(opens).length, `${tag} → ${opens}`).toBeGreaterThan(rowsByTag(tag).length);
    }
  });

  it("only links to https sources, each with a label", () => {
    const links = [
      ...config.sources,
      ...(config.reassurance?.sources ?? []),
      ...chapters.flatMap((chapter) => [...chapter.sources, ...chapter.groups.flatMap((group) => group.sources)]),
    ];
    for (const [label, url] of links) {
      expect(label).not.toBe("");
      expect(url).toMatch(/^https:\/\//);
    }
    for (const row of allRows) if (row.reference) expect(row.reference, row.id).toMatch(/^https:\/\//);
  });

  it("names each map's site and links it over https, and a row's map is never its group's", () => {
    for (const group of chapters.flatMap((chapter) => chapter.groups)) {
      for (const [where, map] of [[group.title, group.map], ...group.rows.map((row) => [row.id, row.map] as const)] as const) {
        if (!map) continue;
        expect(map[0].trim(), where).not.toBe("");
        expect(map[1], where).toMatch(/^https:\/\//);
      }
      for (const row of group.rows) if (row.map && group.map) expect(row.map[1], `${row.id} repeats its group's map`).not.toBe(group.map[1]);
    }
  });

  it("only flags real rows as missable, each backed by two independent https sources", () => {
    for (const item of config.missables) {
      expect(byId.has(item.id), item.id).toBe(true);
      expect(item.why.length).toBeGreaterThan(10);
      expect(item.sources.every((url) => url.startsWith("https://"))).toBe(true);
      expect(hosts(item.sources).size, `${item.id} needs two independent hosts`).toBeGreaterThanOrEqual(2);
    }
    if (!hasMissables && config.reassurance) expect(hosts(config.reassurance.sources.map(([, url]) => url)).size).toBeGreaterThanOrEqual(2);
  });

  it("keeps each one-way choice to real rows, its later ways in later chapters, backed by two independent https sources", () => {
    const missable = new Set(config.missables.map((item) => item.id));
    const ids = (config.choices ?? []).flatMap((choice) => [choice.row, ...choice.later.map((later) => later.row)]);
    expect(new Set(ids).size, "a row is in one choice at most").toBe(ids.length);
    for (const choice of config.choices ?? []) {
      const row = byId.get(choice.row);
      expect(row, choice.row).toBeDefined();
      expect(missable.has(choice.row), `${choice.row} is a choice, so its warning is the choice's, not a missable's`).toBe(false);
      expect(choice.name.trim(), choice.row).not.toBe("");
      expect(choice.why.length, choice.row).toBeGreaterThan(10);
      expect(choice.later.length, `${choice.row} needs a later way`).toBeGreaterThan(0);
      for (const later of choice.later) {
        const other = byId.get(later.row);
        expect(other, later.row).toBeDefined();
        expect(other!.chapter, `${later.row} comes in a later chapter than ${choice.row}`).toBeGreaterThan(row!.chapter);
        expect(later.on.trim(), later.row).not.toBe("");
      }
      expect(choice.sources.every((url) => url.startsWith("https://"))).toBe(true);
      expect(hosts(choice.sources).size, `${choice.row} needs two independent hosts`).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps each questline to real rows, once each and in route order, under a stable id, and covers every row its tags name", () => {
    const at = new Map(allRows.map((row, index) => [row.id, index]));
    const { lines, cover = [] } = config.questlines;
    expect(new Set(lines.map((line) => line.id)).size).toBe(lines.length);
    for (const line of lines) {
      expect(line.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(line.name.trim(), line.id).not.toBe("");
      expect(line.steps.length, line.id).toBeGreaterThan(0);
      for (const id of line.steps) expect(byId.has(id), `${line.id}: ${id}`).toBe(true);
      // Strictly in route order: the steps a reader has revealed are then always the line's first ones (questlines.ts).
      const order = line.steps.map((id) => at.get(id)!);
      expect(order, `${line.id} keeps to route order`).toEqual([...new Set(order)].sort((a, b) => a - b));
    }
    for (const tag of cover) expect(isCategory(tag), tag).toBe(true);
    const inLine = new Set(lines.flatMap((line) => line.steps));
    expect(allRows.filter((row) => row.tags.some((tag) => cover.includes(tag)) && !inLine.has(row.id)).map((row) => row.id)).toEqual([]);
  });

  it("finds the missables and one-way choices left in a chapter and drops them once checked", () => {
    for (const chapter of chapters) {
      const left = missablesLeft(chapter, {});
      expect(left.every((row) => row.tags.includes("missable") || row.tags.includes("one-way"))).toBe(true);
      expect(missablesLeft(chapter, everything)).toEqual([]);
    }
    expect(chapters.flatMap((chapter) => missablesLeft(chapter, {})).length).toBe(config.missables.length + (config.choices ?? []).length);
  });

  it("names every category it shows", () => {
    for (const [id, [plural, singular]] of Object.entries(cats)) {
      expect(plural, id).not.toBe("");
      expect(singular, id).not.toBe("");
    }
  });

  it("clamps chapter numbers", () => {
    expect(readChapter("3")).toBe(Math.min(3, CHAPTER_COUNT));
    expect(readChapter("0", 2)).toBe(2);
    expect(readChapter(String(CHAPTER_COUNT + 1))).toBe(1);
    expect(readChapter("x", 2)).toBe(2);
  });

  it("resolves a row id or a section key to an anchor in its own chapter only", () => {
    const row = chapters[0].groups[0].rows[0];
    expect(guideAnchor(1, row.id)).toBe(`entry-${row.id}`);
    expect(guideAnchor(1, chapters[0].groups[0].key)).toBe(chapters[0].groups[0].key);
    expect(guideAnchor(2, row.id)).toBeUndefined();
    expect(guideAnchor(1, "nope")).toBeUndefined();
  });
});

describe("nextUp", () => {
  const open = (n: number) => n <= 2;

  it("starts at the given chapter in guide order and skips checked steps", () => {
    const [first, second] = chapterRows(chapters[0]).filter((row) => !config.defer?.(row));
    const rows = nextUp({ [first.id]: true }, open, 1, 3);
    expect(rows).toHaveLength(3);
    expect(rows[0].id).toBe(second.id);
    expect(rows.every((row) => row.chapter <= 2)).toBe(true);
  });

  it("never reaches into hidden chapters", () => {
    const openIds = Object.fromEntries(allRows.filter((row) => row.chapter <= 2).map((row) => [row.id, true as const]));
    expect(nextUp(openIds, open, 1, 3)).toEqual([]);
  });

  it("wraps round to earlier chapters", () => {
    const later = Object.fromEntries(allRows.filter((row) => row.chapter === 2).map((row) => [row.id, true as const]));
    expect(nextUp(later, open, 2, 1)[0].chapter).toBe(1);
  });

  it("holds deferred rows back until nothing else is left", () => {
    const all = () => true;
    expect(nextUp({}, all, 1, 50).some((row) => config.defer?.(row))).toBe(false);
    const deferred = allRows.filter((row) => config.defer?.(row));
    if (!deferred.length) return;
    const rest = Object.fromEntries(allRows.filter((row) => !config.defer?.(row)).map((row) => [row.id, true as const]));
    expect(nextUp(rest, all, 1, 3).every((row) => config.defer?.(row))).toBe(true);
  });
});

describe("completion", () => {
  it("lists what is left, biggest first, and empties once everything is checked", () => {
    const left = whatsLeft({});
    expect(left.length).toBeGreaterThan(0);
    expect([...left].sort((a, b) => b.left - a.left).map((item) => item.left)).toEqual(left.map((item) => item.left));
    expect(whatsLeft(everything)).toEqual([]);
  });

  it("counts a category from nothing to everything", () => {
    for (const { tag } of completion.board) {
      const { done, total } = tally(tag, everything);
      expect(done, tag).toBe(total);
      expect(tally(tag, {}).done, tag).toBe(0);
    }
  });
});
