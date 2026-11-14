import { byChapter } from "@game-guides/core/format";
import type { GuideConfig } from "@game-guides/core/types";
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

const banners = byChapter(import.meta.glob<string>("./banners/chapter-*.webp", { eager: true, query: "?url", import: "default" }));

/** The guide's own completion list. A test pins every goal to the data, so a missing row shows up as a failing count. */
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
    "dungeon-chest": ["Dungeon chests", "Dungeon chest", "chest", "sky"],
    "mini-dungeon-chest": ["Mini-dungeon chests", "Mini-dungeon chest", "chest", "sky"],
    "fairy-bottle": ["Fairy Bottles", "Fairy Bottle", "flask", "amber"],
    waypoint: ["Waypoints", "Waypoint", "pin", "sky"],
    "dungeon-waypoint": ["Dungeon Waypoints", "Dungeon Waypoint", "pin", "sky"],
    stamp: ["Stamp stands", "Stamp", "stamp", "amber"],
    recipe: ["Recipes", "Recipe", "flask", "mint"],
    minigame: ["Minigames", "Minigame", "dice"],
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
    dashboardIntro: "Counts follow the guide’s own completion list. Optional amiibo outfits are tracked separately.",
    boardTitle: "Completion targets",
    boardNote: "Might Crystals count by what each entry awards. Accessories count all 28 versions, although two are replaced by upgrades on a finished save.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or check the totals on the Progress page.",
    sourcesIntro: "The community guides behind each chapter. Chapters you have not revealed are left out.",
    allSourcesLink: "All chapters’ sources",
    backupBlurb: "Export a copy of your checks and spoiler settings.",
  },
};

export default config;
