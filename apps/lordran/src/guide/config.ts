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
import chapter10 from "./data/chapter-10";
import chapter11 from "./data/chapter-11";
import chapter12 from "./data/chapter-12";
import chapter13 from "./data/chapter-13";
import { missables } from "./data/missables";
import { sources } from "./data/sources";

const banners = byChapter(import.meta.glob<Banner>("./banners/chapter-*.webp", { eager: true, query: "?banner", import: "default" }));

/**
 * The guide's own completion list: the Steam achievements, the lists they count, the rings, the expansion's gear and the
 * NPC quests. A test pins every goal to the data, so a missing row shows up as a failing count. The expansion equipment
 * and the NPC quests are the guide's own rows, not a game total, so they have no goal: an NPC's arc ends in a death, a
 * hollowing or a choice, so no number of steps is "all of them". The quests are also `optional`, so they show on the
 * board and stay out of What's left, which would otherwise rank them first and need every quest step for "100%". The
 * seven `invasion` rows are fights, not questlines, and have no line. Base-game spells have their own tags, so the five
 * expansion spells count in their schools without inflating the three spell achievements.
 */
export const targets = [
  { tag: "achievement", goal: 41 },
  { tag: "boss", goal: 26 },
  { tag: "covenant", goal: 9 },
  { tag: "rare-weapon", goal: 47 },
  { tag: "base-sorcery", goal: 24 },
  { tag: "base-pyromancy", goal: 19 },
  { tag: "miracle", goal: 23 },
  { tag: "ring", goal: 41 },
  { tag: "ember", goal: 10 },
  { tag: "reinforcement", goal: 10 },
  { tag: "ending", goal: 2 },
  { tag: "quest", optional: true },
  { tag: "dlc-spell", goal: 5 },
  { tag: "dlc-gear" },
];

const config: GuideConfig = {
  brand,
  layout: "article",
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10, chapter11, chapter12, chapter13],
  sources,
  categories: {
    route: ["Route steps", "Route", "compass"],
    boss: ["Bosses", "Boss", "sword", "rose"],
    quest: ["NPC quests", "Quest", "scroll", "mint"],
    covenant: ["Covenants", "Covenant", "ribbon", "violet"],
    invasion: ["NPC invasions", "Invasion", "sword", "rose"],
    pickup: ["Equipment and keys", "Pickup", "chest", "sky"],
    ring: ["Rings", "Ring", "gem", "violet"],
    ember: ["Embers", "Ember", "gem", "amber"],
    estus: ["Estus upgrades", "Estus", "flask", "amber"],
    forge: ["Forging materials", "Forging", "gem", "clay"],
    reinforcement: ["Maximum reinforcements", "Reinforcement", "sword", "amber"],
    "rare-weapon": ["Knight’s Honor weapons", "Knight’s Honor", "sword", "amber"],
    sorcery: ["Sorceries", "Sorcery", "star", "sky"],
    pyromancy: ["Pyromancies", "Pyromancy", "star", "clay"],
    miracle: ["Miracles", "Miracle", "star", "amber"],
    "base-sorcery": ["Base-game sorceries", "Base sorcery", "star", "sky"],
    "base-pyromancy": ["Base-game pyromancies", "Base pyromancy", "star", "clay"],
    "dlc-spell": ["Expansion spells", "Expansion spell", "star", "violet"],
    "dlc-gear": ["Expansion equipment", "Expansion gear", "chest", "violet"],
    dlc: ["Artorias of the Abyss", "Expansion", "compass", "violet"],
    ending: ["Endings", "Ending", "book", "rose"],
    cycle: ["Later cycles", "Later cycle", "compass", "sky"],
    extra: ["Optional discoveries", "Optional", "star", "mint"],
    achievement: ["Achievement milestones", "Achievement", "ribbon", "amber"],
    trade: ["Crow trades", "Trade", "chest", "mint"],
  },
  chips: {
    checklist: [
      ["boss", "Bosses"],
      ["quest", "NPC quests"],
      ["rare-weapon", "Knight’s Honor"],
      ["ring", "Rings"],
      ["covenant", "Covenants"],
      ["sorcery", "Sorceries"],
      ["pyromancy", "Pyromancies"],
      ["miracle", "Miracles"],
      ["ember", "Embers"],
      ["achievement", "Achievements"],
    ],
  },
  missables,
  banners,
  completion: { board: targets },
  state: {},
  text: {
    checklistIntro: "Search by item, boss, NPC or place. Checks are shared with the walkthrough.",
    searchPlaceholder: "Search items, bosses or places",
    dashboardIntro: "Counts follow the Steam achievements, the lists they count, the rings, the expansion’s gear and the NPC quests, across three playthroughs.",
    boardTitle: "Completion targets",
    boardNote:
      "Spell counts are the base game’s, as the achievements count them; the five expansion spells have their own line. Knight’s Honor counts all 47 rare weapons. NPC quests count the guide’s own quest steps: a story can end in a death or a choice, so there is no finish line, and they stay out of What’s left.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or check the totals on the Progress page.",
    backupBlurb: "Export a copy of your checks and spoiler settings.",
  },
};

export default config;
