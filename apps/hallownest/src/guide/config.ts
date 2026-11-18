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
import chapter10 from "./data/chapter-10";
import chapter11 from "./data/chapter-11";
import chapter12 from "./data/chapter-12";
import { missables } from "./data/missables";
import { questlines } from "./data/questlines";
import { sources } from "./data/sources";
import { countsInGame, fullCompletion } from "./points";

const banners = byChapter(import.meta.glob<Banner>("./banners/chapter-*.webp", { eager: true, query: "?banner", import: "default" }));

/**
 * The completion board. The targets that aren't optional are the game's own 112%, term by term: what the overall figure reads.
 * The optional ones are the collections a full save also holds (Grubs, notches, Pale Ore, maps, stations, Roots, keys) and the
 * endings and dream rematches, which the game's percentage doesn't count. A test pins every goal to the data.
 */
export const targets: BoardItem[] = [
  { tag: "charm", goal: 40 },
  { tag: "percent-boss", goal: 15 },
  { tag: "equipment", goal: 7 },
  { tag: "warrior-dream", goal: 7 },
  { tag: "spell", goal: 6 },
  { tag: "forge", goal: 4 },
  { tag: "mask-shard", goal: 16 },
  { tag: "vessel-fragment", goal: 9 },
  { tag: "nail-art", goal: 3 },
  { tag: "dreamer", goal: 3 },
  { tag: "dream-milestone", goal: 3 },
  { tag: "trial", goal: 3 },
  { tag: "troupe-boss", goal: 1 },
  { tag: "troupe-finale", goal: 1 },
  { tag: "godtuner", goal: 1 },
  { tag: "pantheon", goal: 4 },
  { tag: "grub", goal: 46, optional: true },
  { tag: "notch", goal: 8, optional: true },
  { tag: "pale-ore", goal: 6, optional: true },
  { tag: "map", goal: 13, optional: true },
  { tag: "stag", goal: 11, optional: true },
  { tag: "root", goal: 15, optional: true },
  { tag: "simple-key", goal: 4, optional: true },
  { tag: "ending", goal: 5, optional: true },
  { tag: "dream-boss", goal: 5, optional: true },
];

const config: GuideConfig = {
  brand,
  layout: "article",
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10, chapter11, chapter12],
  sources,
  categories: {
    route: ["Route steps", "Route", "compass"],
    quest: ["Quest steps", "Quest", "scroll", "mint"],
    map: ["Area maps", "Map", "compass", "sky"],
    stag: ["Stag stations", "Stag station", "pin", "sky"],
    boss: ["Boss encounters", "Boss", "sword", "rose"],
    "percent-boss": ["Bosses (in-game %)", "Boss (in-game %)", "sword", "rose"],
    "dream-boss": ["Dream boss rematches", "Dream rematch", "sword", "violet"],
    "warrior-dream": ["Warrior Dreams", "Warrior Dream", "sword", "violet"],
    dreamer: ["Dreamers", "Dreamer", "star", "violet"],
    "dream-milestone": ["Dream Nail milestones", "Dream milestone", "star", "violet"],
    root: ["Whispering Roots", "Root", "star", "mint"],
    equipment: ["Equipment upgrades", "Equipment", "ribbon", "sky"],
    pickup: ["Special pickups", "Pickup", "chest", "mint"],
    "simple-key": ["Simple Keys", "Key", "chest", "amber"],
    charm: ["Charms", "Charm", "gem", "violet"],
    notch: ["Earned Charm Notches", "Charm Notch", "gem", "clay"],
    spell: ["Spells", "Spell", "flask", "violet"],
    "nail-art": ["Nail Arts", "Nail Art", "sword", "amber"],
    forge: ["Nail upgrades", "Nail upgrade", "sword", "amber"],
    "pale-ore": ["Pale Ore", "Pale Ore", "gem", "amber"],
    "mask-shard": ["Mask Shards", "Mask Shard", "heart", "rose"],
    "vessel-fragment": ["Vessel Fragments", "Vessel Fragment", "flask", "sky"],
    grub: ["Grubs", "Grub", "heart", "mint"],
    trial: ["Colosseum trials", "Trial", "ribbon", "amber"],
    "troupe-boss": ["Grimm’s first fight", "Troupe boss", "sword", "rose"],
    "troupe-finale": ["Troupe finale", "Troupe finale", "ribbon", "rose"],
    godtuner: ["Godtuner", "Godtuner", "gem", "amber"],
    pantheon: ["Completion Pantheons", "Pantheon", "sword", "amber"],
    ending: ["Endings", "Ending", "book", "violet"],
    challenge: ["Optional challenges", "Challenge", "ribbon", "violet"],
    achievement: ["Completion achievement", "Achievement", "ribbon", "amber"],
  },
  chips: {
    checklist: [
      ["charm", "Charms"],
      ["equipment", "Equipment upgrades"],
      ["grub", "Grubs"],
      ["mask-shard", "Mask Shards"],
      ["vessel-fragment", "Vessel Fragments"],
      ["boss", "Boss encounters"],
      ["quest", "Quest steps"],
      ["pale-ore", "Pale Ore"],
      ["stag", "Stag stations"],
      ["map", "Area maps"],
      ["root", "Whispering Roots"],
      ["ending", "Endings"],
      ["pantheon", "Completion Pantheons"],
    ],
  },
  missables,
  questlines,
  banners,
  completion: { board: targets, isCore: countsInGame, overall: { label: "complete", percent: fullCompletion } },
  state: {},
  text: {
    checklistIntro: "Search by charm, boss, NPC or place. Checks are shared with the walkthrough.",
    searchPlaceholder: "Search charms, bosses or places",
    dashboardIntro: "Counts follow the game’s own completion, scaled so that 100% is everything it counts, with all four free content packs.",
    boardTitle: "Completion targets",
    boardNote:
      "The first sixteen targets are the game’s own completion, weighted as the game weighs them: equipment counts twice, and Mask Shards and Vessel Fragments count only as whole masks and vessels. Grubs, notches, Pale Ore, maps, stations, Roots, keys, endings and dream rematches don’t count toward it, and stay out of What’s left.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or check the totals on the Progress page.",
    backupBlurb: "Export a copy of your checks and spoiler settings.",
  },
};

export default config;
