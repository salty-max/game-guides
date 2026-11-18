import config from "virtual:guide/config";
import { pct } from "./format";
import type { Chapter, Checks, LeftItem, Row } from "./types";

export { config };
export const { brand, categories: cats, completion, text } = config;

const missableIds = new Set(config.missables.map((item) => item.id));
export const hasMissables = missableIds.size > 0;

export const chapters: Chapter[] = config.chapters.map((chapter) => ({
  ...chapter,
  sources: chapter.sources ?? [],
  groups: chapter.groups.map((group, index) => ({
    key: `section-${chapter.id}-${index + 1}`,
    title: group.title,
    location: group.location,
    icon: group.icon,
    note: group.note,
    sources: group.sources ?? [],
    map: group.map,
    compact: group.compact === true,
    rows: group.rows.map(
      ([id, tags, title, text, extra]): Row => ({
        id,
        title,
        text,
        chapter: chapter.id,
        group: group.title,
        location: group.location,
        tags: missableIds.has(id) ? [...tags, "missable"] : tags,
        quantity: extra?.quantity ?? 0,
        reference: extra?.reference,
        map: extra?.map,
      }),
    ),
  })),
}));

export const CHAPTER_COUNT = chapters.length;
export const allRows: Row[] = chapters.flatMap((chapter) => chapter.groups.flatMap((group) => group.rows));
export const byId = new Map(allRows.map((row) => [row.id, row]));
export const rowsByTag = (tag: string) => allRows.filter((row) => row.tags.includes(tag));
export const chapterRows = (chapter: Chapter) => chapter.groups.flatMap((group) => group.rows);
export const primaryTag = (row: Row) => row.tags[0];
export const isCategory = (value: string | undefined): value is string => value !== undefined && Object.hasOwn(cats, value);
export const tagName = (tag: string) => (isCategory(tag) ? cats[tag][0] : tag === "missable" ? "Missable" : tag);
export const missableWhy = (id: string) => config.missables.find((item) => item.id === id)?.why;

export const readChapter = (value: unknown, fallback = 1) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= CHAPTER_COUNT ? n : fallback;
};

export const statusOptions: [string, string][] = [
  ["all", "All statuses"],
  ["todo", "Unfinished"],
  ["done", "Completed"],
];

/** A row id or a section key in this chapter, as the element id to scroll to. */
export function guideAnchor(chapterId: number, target: string | undefined): string | undefined {
  if (!target) return;
  if (byId.get(target)?.chapter === chapterId) return `entry-${target}`;
  return chapters[chapterId - 1]?.groups.find((group) => group.key === target)?.key;
}

/** The next unchecked steps in guide order, starting at `fromChapter` and wrapping round. Deferred rows wait until nothing else is left. */
export function nextUp(checks: Checks, isChapterOpen: (chapter: number) => boolean, fromChapter: number, count = 3): Row[] {
  const order = [...chapters.filter((chapter) => chapter.id >= fromChapter), ...chapters.filter((chapter) => chapter.id < fromChapter)];
  const left = order.filter((chapter) => isChapterOpen(chapter.id)).flatMap(chapterRows).filter((row) => checks[row.id] !== true);
  const steps = config.defer ? left.filter((row) => !config.defer!(row)) : left;
  return (steps.length ? steps : left).slice(0, count);
}

export const missablesLeft = (chapter: Chapter, checks: Checks) =>
  chapterRows(chapter).filter((row) => missableIds.has(row.id) && checks[row.id] !== true);

/** Rows a weighted overall figure reads (`completion.overall.percent`, Red Dead's estimate). Default: every row. */
export const coreRows = completion.isCore ? allRows.filter(completion.isCore) : allRows;

/** How much one entry adds toward a category: the configured quantity category by amount, everything else by one. */
export const worth = (row: Row, tag: string) => (tag === config.quantity ? row.quantity : 1);

export function tally(tag: string, checks: Checks) {
  let done = 0;
  let total = 0;
  for (const row of rowsByTag(tag)) {
    total += worth(row, tag);
    if (checks[row.id] === true) done += worth(row, tag);
  }
  return { done, total };
}

const opens = new Map(completion.board.map((item) => [item.tag, item.opens ?? item.tag]));
/** The checklist a target's tile and its line in What's left open: its category, or the one it names (`BoardItem.opens`). */
export const checklistOf = (tag: string) => `/checklist/${opens.get(tag) ?? tag}`;

const listed = completion.board.filter((item) => !item.optional);

/**
 * The guide's completion list done, as a whole percentage rounded down: every board target that isn't optional, counted as the board
 * counts it (an entry by one, the quantity category by amount) and only up to its goal. What's left counts the same targets the same
 * way, so this is 100 exactly when What's left is empty, and never 100 while anything on the list is left.
 */
export function listedPercent(checks: Checks) {
  let done = 0;
  let total = 0;
  for (const { tag, goal } of listed) {
    const count = tally(tag, checks);
    const target = goal ?? count.total;
    done += Math.min(count.done, target);
    total += target;
  }
  return pct(done, total);
}

/**
 * The guide's one overall figure and the words after it. By default it is the completion list (`listedPercent`); a guide whose game keeps
 * a percentage of its own replaces it with a model of that (`completion.overall.percent`, Red Dead's estimate), whose rows are real
 * entries, so their count comes with it. The list's own total isn't a count of anything a reader can point at (crystals by amount, a row
 * once per target it carries), so it has none.
 */
export function overall(checks: Checks) {
  const label = completion.overall?.label ?? "complete";
  const weighted = completion.overall?.percent;
  if (!weighted) return { percent: listedPercent(checks), label, entries: null };
  const done = coreRows.filter((row) => checks[row.id] === true).length;
  return { percent: weighted(checks, coreRows), label, entries: { done, total: coreRows.length } };
}

/** The figure in words, as a screen reader hears it: as it is shown, never rounded up (Base UI's own text goes through Intl, which reads 99.9 as "100%"). */
export const overallText = (percent: number, label: string) => `${percent}% ${label}`;

/** What is left per category, biggest first; finished categories drop out. */
export function whatsLeft(checks: Checks): LeftItem[] {
  const items = completion.left
    ? completion.left(checks, coreRows)
    : completion.board
        .filter((item) => !item.optional)
        .map(({ tag, goal }) => {
          const { done, total } = tally(tag, checks);
          const target = goal ?? total;
          return { tag, total: target, left: Math.max(target - done, 0) };
        });
  return items.filter((item) => item.left > 0).sort((a, b) => b.left - a.left || tagName(a.tag).localeCompare(tagName(b.tag)));
}
