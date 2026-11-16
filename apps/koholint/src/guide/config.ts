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
import { sources } from "./data/sources";
import { blankLog, readRunLog } from "./run-log";

const banners = byChapter(import.meta.glob<Banner>("./banners/chapter-*.webp", { eager: true, query: "?banner", import: "default" }));

const categories: GuideConfig["categories"] = {
  heart: ["Heart Pieces", "Heart Piece", "heart", "rose"],
  shell: ["Secret Seashells", "Seashell", "shell", "violet"],
  chest: ["Treasure Chests", "Chest", "chest", "amber"],
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
  reassurance,
  banners,
  defer: (row) => row.tags.includes("amiibo"),
  completion: {
    isCore: (row) => !row.tags.includes("amiibo"),
    overall: { label: "complete" },
    board: Object.keys(categories)
      .filter((tag) => tag !== "story")
      .map((tag) => ({ tag, optional: tag === "amiibo" })),
  },
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
    boardNote: "Category totals include the full guide. Optional amiibo and the deathless log sit outside overall completion.",
    nextUpDone: "Everything revealed so far is done. Reveal the next chapter or check the progress page.",
    sourcesIntro: "These references cover the 2019 Nintendo Switch remake. The external guides may reveal later chapters.",
    sourcesTitle: "Collectibles, systems and side quests",
    allSourcesLink: "Heart Pieces, shells and side-quest sources",
    backupBlurb: "Export a copy of all checks, spoiler settings and run logs.",
  },
};

export default config;
