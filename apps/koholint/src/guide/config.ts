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
import { sources } from "./data/sources";
import { blankLog, readRunLog } from "./run-log";

const banners = byChapter(import.meta.glob<Banner>("./banners/chapter-*.webp", { eager: true, query: "?banner", import: "default" }));

const categories: GuideConfig["categories"] = {
  heart: ["Heart Pieces", "Heart Piece", "heart", "rose"],
  shell: ["Secret Seashells", "Seashell", "shell", "violet"],
  chest: ["Chests", "Chest", "chest", "amber"],
  treasure: ["Treasure Chests", "Chest", "chest", "amber"],
  trade: ["Trading Quest", "Trade", "swap", "clay"],
  gear: ["Equipment & Upgrades", "Equipment", "sword"],
  container: ["Heart Containers", "Heart Container", "heart"],
  instrument: ["Instruments", "Instrument", "music"],
  song: ["Ocarina Songs", "Song", "music"],
  bottle: ["Fairy Bottles", "Bottle", "flask"],
  figure: ["Figures", "Figure", "star"],
  mini: ["Mini-game Rewards", "Mini-game", "fish"],
  lure: ["Fishing Lures", "Lure", "fish"],
  challenge: ["Chamber Challenges", "Challenge", "grid", "sky"],
  stone: ["Chamber Stones", "Chamber Stone", "gem", "sky"],
  effect: ["Chamber Effects", "Effect", "star"],
  warp: ["Warp Points", "Warp Point", "pin"],
  fairy: ["Great Fairy Fountains", "Fountain", "leaf"],
  explore: ["Island Sweep", "Exploration", "compass"],
  amiibo: ["Optional amiibo", "amiibo", "star"],
  story: ["Route Steps", "Route", "book"],
};

/**
 * The guide's completion list, and what 100% is: every target counts, each item once, up to its goal, so the bar reads 100 exactly when
 * What's left is empty. Only the amiibo stay out (they need physical figures), and route steps (`story`) are directions, among them
 * fishing with the pond's default Lightweight Lure and buying back the item traded for the Boomerang. Treasure Chests, Equipment &
 * Upgrades, the Island Sweep and the amiibo panels are the guide's own lists, and the rest are game totals (facts-to-verify.md names two
 * hosts for each). A row of the guide's own lists counts nowhere else: Treasure Chests are the chests holding nothing another target
 * counts (`chest` tags the guide's chest list, for the filter), Equipment leaves out the instruments and songs, and the Mini-game Rewards
 * (`mini`) and Chamber Effects (`effect`) are filters, not targets, since each of their rows is already a Heart Piece, a figure, a Chamber Stone and so on.
 * A row on two of the game's lists counts on both: Dampé's challenges that award a Heart Piece, a Seashell, a Fairy Bottle or a Heart
 * Container, and Manbo's Mambo, a song and the Manbo's Pond warp point. guide.test.ts pins every goal.
 */
export const targets: BoardItem[] = [
  { tag: "heart", goal: 32, list: "game" },
  { tag: "shell", goal: 50, list: "game" },
  { tag: "treasure", goal: 83, list: "guide" },
  { tag: "trade", goal: 14, list: "game" },
  { tag: "gear", goal: 24, list: "guide" },
  { tag: "container", goal: 9, list: "game" },
  { tag: "instrument", goal: 8, list: "game" },
  { tag: "song", goal: 3, list: "game" },
  { tag: "bottle", goal: 3, list: "game" },
  { tag: "figure", goal: 10, list: "game" },
  { tag: "lure", goal: 2, list: "game" },
  { tag: "challenge", goal: 24, list: "game" },
  { tag: "stone", goal: 14, list: "game" },
  { tag: "warp", goal: 10, list: "game" },
  { tag: "fairy", goal: 4, list: "game" },
  { tag: "explore", goal: 5, list: "guide" },
  { tag: "amiibo", goal: 6, list: "guide" },
];

const config: GuideConfig = {
  brand,
  layout: "article",
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9],
  sources,
  categories,
  chips: {
    checklist: [
      ["heart", "Heart Pieces"],
      ["shell", "Seashells"],
      ["chest", "Chests"],
      ["trade", "Trades"],
      ["mini", "Mini-games"],
      ["challenge", "Chambers"],
    ],
  },
  badges: ["heart", "shell", "chest", "bottle", "container"],
  missables,
  questlines,
  reassurance,
  banners,
  defer: (row) => row.tags.includes("amiibo"),
  completion: { board: targets, directions: ["story"], outside: ["amiibo"] },
  state: {
    // Saves from before the shared format: version 1, no guide id, the run log at the top level.
    legacy: (v) => (v.version === 1 && v.guide === undefined ? { extra: { mode: v.mode, runs: v.runs } } : null),
    extra: { initial: blankLog, read: readRunLog },
  },
  text: {
    checklistIntro: "Search by item, location or activity. Checks sync with the walkthrough. Open a chapter link to read an entry in context.",
    searchPlaceholder: "Search items or locations",
    dashboardIntro: "Track completion across the island and log a deathless attempt.",
    boardTitle: "By category",
    boardNote:
      "Every target counts, each item once, so 100% is exactly when What’s left is empty. A mini-game prize or a chamber reward counts as the item it is, and a chest holding a Seashell or a dungeon item counts as that, so Treasure Chests are the chests holding nothing else counted. A Dampé challenge counts as well as the Heart Piece, Seashell, bottle or Heart Container it awards, and Manbo’s Mambo as a song and a warp point, since the game lists each. Treasure Chests, Equipment & Upgrades and the Island Sweep are the guide’s own lists, not game totals. Optional amiibo and the deathless log sit outside overall completion.",
    nextUpDone: "Everything revealed so far is done. Reveal the next chapter or check the progress page.",
    backupBlurb: "Export a copy of all checks, spoiler settings and run logs.",
  },
};

export default config;
