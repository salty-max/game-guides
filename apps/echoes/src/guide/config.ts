import { byChapter } from "@hundo/core/format";
import type { Banner, GuideConfig } from "@hundo/core/types";
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
 * when What's left is empty. Only the amiibo outfits stay out (they need physical figures), and route, story and Waypoint rows are
 * directions: the game treats Waypoints as fast-travel unlocks, with no counter, percentage or reward, so they carry no target. The
 * first thirteen come with game totals; the rest are the guide's own lists, whose goals are their rows (facts-to-verify.md). A test
 * pins every goal to the data, so a missing row shows up as a failing count.
 */
export const targets = [
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
  { tag: "overworld-chest", goal: 46 },
  { tag: "equipment", goal: 4 },
  { tag: "ability", goal: 2 },
  { tag: "upgrade", goal: 11 },
  { tag: "milestone", goal: 2 },
  { tag: "minigame-extra", goal: 22 },
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
  completion: { board: targets },
  state: {
    legacy: (v) => (v.version === 1 && v.guide === brand.id ? {} : null),
  },
  text: {
    checklistIntro: "Search by echo, item, place or activity. Checks are shared with the walkthrough.",
    searchPlaceholder: "Search echoes, items or places",
    dashboardIntro: "100% is every target on the board, each item counted once, with the equipment, upgrades, minigames and chests as well as the game’s own lists. Optional amiibo outfits, which need physical figures, are tracked separately.",
    boardTitle: "Completion targets",
    boardNote:
      "Every target counts, each item once, so 100% is exactly when What’s left is empty. Might Crystals count by what each entry awards. Accessories count all 28 versions, although two are replaced by upgrades on a finished save. Overworld chests, equipment, abilities, upgrades, milestones and the minigame entries that award nothing the board counts already count the guide’s own rows, not a game total, and Waypoints are directions, not counted.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or check the totals on the Progress page.",
    backupBlurb: "Export a copy of your checks and spoiler settings.",
  },
};

export default config;
