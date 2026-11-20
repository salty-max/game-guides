import { byChapter } from "@hundo/core/format";
import type { Banner, BoardItem, GuideConfig } from "@hundo/core/types";
import { brand } from "./brand";
import chapter1 from "./data/chapter-1";
import chapter2 from "./data/chapter-2";
import chapter3 from "./data/chapter-3";
import chapter4 from "./data/chapter-4";
import chapter5 from "./data/chapter-5";
import chapter6 from "./data/chapter-6";
import chapter7 from "./data/chapter-7";
import chapter8 from "./data/chapter-8";
import chapter9 from "./data/chapter-9";
import { missables, reassurance } from "./data/missables";
import { questlines } from "./data/questlines";

const banners = byChapter(import.meta.glob<Banner>("./banners/chapter-*.webp", { eager: true, query: "?banner", import: "default" }));

/**
 * The guide's own completion list, and what 100% is: every target counts, each item once, up to its goal, so the bar reads 100 exactly
 * when What's left is empty. Only the amiibo outfits stay out (they need physical figures), and route and story rows are directions.
 * The first eleven come with game totals, whose hosts facts-to-verify.md names; the rest are the guide's own lists, whose goals are
 * their rows: the dungeon and mini-dungeon chests (no page read totals them) and the lists after them. The Waypoints are one of those: the
 * game treats them as fast-travel unlocks, with no counter, percentage or reward, but a reader activates each one, so all 43 count
 * (the 26 inside dungeons carry `waypoint` after `dungeon-waypoint`, which names the label and icon of the row). A test pins every
 * goal to the data, so a missing row shows up as a failing count.
 */
export const targets: BoardItem[] = [
  { tag: "echo", goal: 127, list: "game" },
  { tag: "heart-piece", goal: 40, list: "game" },
  { tag: "heart-container", goal: 7, list: "game" },
  { tag: "might-crystal", goal: 150, list: "game" },
  { tag: "side-quest", goal: 50, list: "game" },
  { tag: "stamp", goal: 25, list: "game" },
  { tag: "accessory", goal: 28, list: "game" },
  { tag: "outfit", goal: 8, list: "game" },
  { tag: "recipe", goal: 69, list: "game" },
  { tag: "automaton", goal: 6, list: "game" },
  { tag: "fairy-bottle", goal: 4, list: "game" },
  { tag: "dungeon-chest", goal: 57, list: "guide" },
  { tag: "mini-dungeon-chest", goal: 12, list: "guide" },
  { tag: "overworld-chest", goal: 38, list: "guide" },
  { tag: "equipment", goal: 4, list: "guide" },
  { tag: "ability", goal: 2, list: "guide" },
  { tag: "upgrade", goal: 11, list: "guide" },
  { tag: "milestone", goal: 2, list: "guide" },
  { tag: "minigame-extra", goal: 22, list: "guide" },
  { tag: "waypoint", goal: 43, list: "guide" },
];

const config: GuideConfig = {
  brand,
  layout: "article",
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9],
  sources: [],
  categories: {
    route: ["Route steps", "Route", "compass"],
    story: ["Story", "Story", "book"],
    equipment: ["Equipment", "Gear", "sword"],
    ability: ["Abilities", "Ability", "star"],
    echo: ["Echoes", "Echo", "tri"],
    "heart-piece": ["Pieces of Heart", "Heart Piece", "heart", "rose"],
    "heart-container": ["Heart Containers", "Heart Container", "heart", "rose"],
    "might-crystal": ["Might Crystals", "Might Crystal", "gem", "amber"],
    "side-quest": ["Side quests", "Side quest", "scroll", "mint"],
    chest: ["Chests", "Chest", "chest", "sky"],
    "overworld-chest": ["Overworld chests", "Overworld chest", "chest", "sky"],
    "dungeon-chest": ["Dungeon chests", "Dungeon chest", "chest", "sky"],
    "mini-dungeon-chest": ["Mini-dungeon chests", "Mini-dungeon chest", "chest", "sky"],
    "fairy-bottle": ["Fairy Bottles", "Fairy Bottle", "flask", "amber"],
    waypoint: ["Waypoints", "Waypoint", "pin", "sky"],
    "dungeon-waypoint": ["Dungeon Waypoints", "Dungeon Waypoint", "pin", "sky"],
    stamp: ["Stamp stands", "Stamp", "stamp", "amber"],
    recipe: ["Recipes", "Recipe", "flask", "mint"],
    minigame: ["Minigames", "Minigame", "dice"],
    "minigame-extra": ["Minigame entries", "Minigame entry", "dice"],
    accessory: ["Accessories", "Accessory", "ribbon", "rose"],
    outfit: ["Outfits", "Outfit", "shirt", "sky"],
    amiibo: ["Amiibo outfits (optional)", "Amiibo", "shirt"],
    automaton: ["Automatons", "Automaton", "gear", "mint"],
    upgrade: ["Upgrades", "Upgrade", "arrowUp"],
    milestone: ["Milestones", "Milestone", "flag"],
  },
  chips: {
    checklist: [
      ["echo", "Echoes"],
      ["heart-piece", "Heart Pieces"],
      ["might-crystal", "Might Crystals"],
      ["side-quest", "Side quests"],
      ["chest", "Chests"],
      ["recipe", "Recipes"],
      ["stamp", "Stamps"],
    ],
  },
  quantity: "might-crystal",
  missables,
  questlines,
  reassurance,
  banners,
  defer: (row) => row.tags.includes("amiibo"),
  completion: { board: targets, directions: ["route", "story"], outside: ["amiibo"] },
  state: {
    legacy: (v) => (v.version === 1 && v.guide === brand.id ? {} : null),
  },
  text: {
    checklistIntro: "Search by echo, item, place or activity. Checks are shared with the walkthrough.",
    searchPlaceholder: "Search echoes, items or places",
    dashboardIntro: "100% is every target on the board, each item counted once, with the equipment, upgrades, minigames, chests and Waypoints as well as the game’s own lists. Optional amiibo outfits, which need physical figures, are tracked separately.",
    boardTitle: "Completion targets",
    boardNote:
      "Every target counts, each item once, so 100% is exactly when What’s left is empty. Might Crystals count by what each entry awards. Accessories count all 28 versions, although two are replaced by upgrades on a finished save. Dungeon chests, mini-dungeon chests, overworld chests, equipment, abilities, upgrades, milestones, Waypoints and the minigame entries that award nothing the board counts already count the guide’s own rows, not a game total. The game keeps no count of Waypoints, so the guide’s 43 are its own list.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or check the totals on the Progress page.",
    backupBlurb: "Export a copy of your checks and spoiler settings.",
  },
};

export default config;
