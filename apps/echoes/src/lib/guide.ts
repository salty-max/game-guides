import chapter1 from "../data/chapter-1";
import chapter2 from "../data/chapter-2";
import chapter3 from "../data/chapter-3";
import chapter4 from "../data/chapter-4";
import chapter5 from "../data/chapter-5";
import chapter6 from "../data/chapter-6";
import chapter7 from "../data/chapter-7";
import chapter8 from "../data/chapter-8";
import chapter9 from "../data/chapter-9";
import { sweepLists } from "../data/sweep-lists";
import { missables } from "../data/missables";
import type { IconName } from "../components/Icon";
import type { Chapter, RawChapter, Row } from "../types";

/** The final chapter also carries the catalogue lists and completion milestones. */
const rawChapters: RawChapter[] = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, { ...chapter9, groups: [...chapter9.groups, ...sweepLists] }];

export const CHAPTER_COUNT = rawChapters.length;

/** id → [plural name, singular label, icon] */
export const cats = {
  route: ["Route steps", "Route", "compass"],
  story: ["Story", "Story", "book"],
  equipment: ["Equipment", "Gear", "sword"],
  ability: ["Abilities", "Ability", "star"],
  echo: ["Echoes", "Echo", "tri"],
  "heart-piece": ["Pieces of Heart", "Heart Piece", "heart"],
  "heart-container": ["Heart Containers", "Heart Container", "heart"],
  "might-crystal": ["Might Crystals", "Might Crystal", "gem"],
  "side-quest": ["Side quests", "Side quest", "scroll"],
  chest: ["Chests", "Chest", "chest"],
  "dungeon-chest": ["Dungeon chests", "Dungeon chest", "chest"],
  "mini-dungeon-chest": ["Mini-dungeon chests", "Mini-dungeon chest", "chest"],
  "fairy-bottle": ["Fairy Bottles", "Fairy Bottle", "flask"],
  waypoint: ["Waypoints", "Waypoint", "pin"],
  "dungeon-waypoint": ["Dungeon Waypoints", "Dungeon Waypoint", "pin"],
  stamp: ["Stamp stands", "Stamp", "stamp"],
  recipe: ["Recipes", "Recipe", "flask"],
  minigame: ["Minigames", "Minigame", "dice"],
  accessory: ["Accessories", "Accessory", "ribbon"],
  outfit: ["Outfits", "Outfit", "shirt"],
  amiibo: ["Amiibo outfits (optional)", "Amiibo", "shirt"],
  automaton: ["Automatons", "Automaton", "gear"],
  upgrade: ["Upgrades", "Upgrade", "arrowUp"],
  milestone: ["Milestones", "Milestone", "flag"],
} as const satisfies Record<string, readonly [string, string, IconName]>;

export type CategoryId = keyof typeof cats;
export const isCategory = (value: string | undefined): value is CategoryId => value !== undefined && Object.hasOwn(cats, value);

/**
 * What the guide's own completion list asks for. A test pins every entry to the data, so a missing row shows up
 * as a failing count rather than a quiet gap. Might Crystals are counted by what each entry awards.
 */
export const targets: { tag: CategoryId; goal: number }[] = [
  { tag: "echo", goal: 127 },
  { tag: "heart-piece", goal: 40 },
  { tag: "heart-container", goal: 7 },
  { tag: "might-crystal", goal: 150 },
  { tag: "side-quest", goal: 50 },
  { tag: "stamp", goal: 25 },
  { tag: "accessory", goal: 28 },
  { tag: "outfit", goal: 8 },
  { tag: "recipe", goal: 69 },
  { tag: "automaton", goal: 6 },
  { tag: "fairy-bottle", goal: 4 },
  { tag: "dungeon-chest", goal: 59 },
  { tag: "mini-dungeon-chest", goal: 12 },
];

const missableIds = new Set(missables.map((item) => item.id));

export const chapters: Chapter[] = rawChapters.map((chapter) => ({
  ...chapter,
  groups: chapter.groups.map((group, index) => ({
    key: `section-${chapter.id}-${index + 1}`,
    title: group.title,
    note: group.note,
    sources: group.sources ?? [],
    rows: group.rows.map(
      ([id, categories, title, text, quantity]): Row => ({
        id,
        title,
        text,
        chapter: chapter.id,
        group: group.title,
        tags: missableIds.has(id) ? [...categories.split(" "), "missable"] : categories.split(" "),
        quantity: quantity ?? 0,
      }),
    ),
  })),
}));

export const allRows: Row[] = chapters.flatMap((chapter) => chapter.groups.flatMap((group) => group.rows));
export const byId = new Map(allRows.map((row) => [row.id, row]));
export const rowsByTag = (tag: string) => allRows.filter((row) => row.tags.includes(tag));
export const chapterRows = (chapter: Chapter) => chapter.groups.flatMap((group) => group.rows);
export const primaryTag = (row: Row): CategoryId => row.tags[0] as CategoryId;

/** How much one entry adds toward a category: crystals by amount, everything else by one. */
export const worth = (row: Row, tag: string) => (tag === "might-crystal" ? row.quantity : 1);

export function tally(tag: string, checks: Record<string, true>) {
  let done = 0;
  let total = 0;
  for (const row of rowsByTag(tag)) {
    total += worth(row, tag);
    if (checks[row.id] === true) done += worth(row, tag);
  }
  return { done, total };
}

export const two = (value: number) => String(value).padStart(2, "0");
export const pct = (done: number, total: number) => (total ? Math.floor((done / total) * 100) : 0);
export const readChapter = (value: unknown, fallback = 1) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= CHAPTER_COUNT ? n : fallback;
};

export const statusOptions: [string, string][] = [
  ["all", "All statuses"],
  ["todo", "Unfinished"],
  ["done", "Completed"],
];

export const tagName = (tag: string) => (isCategory(tag) ? cats[tag][0] : tag === "missable" ? "Missable" : tag);

/** The next unchecked steps in route order (chapters, then groups, then rows) across the given chapters. */
export function nextUp(checks: Record<string, true>, chapterIds: number[], count = 3): Row[] {
  return chapters
    .filter((chapter) => chapterIds.includes(chapter.id))
    .flatMap(chapterRows)
    .filter((row) => checks[row.id] !== true)
    .slice(0, count);
}

/** What is left per target category, most remaining first. */
export function whatsLeft(checks: Record<string, true>) {
  return targets
    .map(({ tag, goal }) => ({ tag, goal, left: Math.max(goal - tally(tag, checks).done, 0) }))
    .filter((item) => item.left > 0)
    .sort((a, b) => b.left - a.left);
}

export const missablesLeft = (chapter: Chapter, checks: Record<string, true>) =>
  chapterRows(chapter).filter((row) => row.tags.includes("missable") && checks[row.id] !== true);
