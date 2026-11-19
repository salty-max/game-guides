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

const banners = byChapter(import.meta.glob<Banner>("./banners/chapter-*.webp", { eager: true, query: "?banner", import: "default" }));

/**
 * The completion board, and what 100% is: every target counts, each item once, up to its goal, so the bar reads 100 exactly when
 * What's left is empty. The first sixteen are the game's own completion (its 112%, term by term). The rest is what the game's
 * percentage doesn't count: the collections a full save also holds (Grubs, notches, Pale Ore, maps, stations, Roots, keys), the
 * endings and dream rematches, and the guide's own lists (key pickups, the six bosses outside the percentage, the
 * challenges, Pure Completion and the quest steps), whose goals are their rows, not a game total. Route steps are directions and
 * carry no target. The game's own figure is the Check against the game panel's (`points.ts`), not the bar's. A test pins every
 * goal to the data.
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
  { tag: "grub", goal: 46 },
  { tag: "notch", goal: 8 },
  { tag: "pale-ore", goal: 6 },
  { tag: "map", goal: 13 },
  { tag: "stag", goal: 11 },
  { tag: "root", goal: 15 },
  { tag: "simple-key", goal: 4 },
  { tag: "ending", goal: 5 },
  { tag: "dream-boss", goal: 5 },
  { tag: "other-boss", goal: 6 },
  { tag: "pickup", goal: 7 },
  { tag: "challenge", goal: 4 },
  { tag: "achievement", goal: 1 },
  { tag: "quest", goal: 41 },
];

const config: GuideConfig = {
  brand,
  layout: "article",
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10, chapter11, chapter12],
  sources,
  categories: {
    route: ["Route steps", "Route", "compass"],
    quest: ["Quest steps", "Quest", "scroll", "mint"],
    choice: ["Quest choices", "Choice", "scroll", "rose"],
    map: ["Area maps", "Map", "compass", "sky"],
    stag: ["Stag stations", "Stag station", "pin", "sky"],
    boss: ["Boss encounters", "Boss", "sword", "rose"],
    "percent-boss": ["Bosses (in-game %)", "Boss (in-game %)", "sword", "rose"],
    "other-boss": ["Bosses (outside the %)", "Boss (outside the %)", "sword", "clay"],
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
  completion: { board: targets },
  state: {},
  text: {
    checklistIntro: "Search by charm, boss, NPC or place. Checks are shared with the walkthrough.",
    searchPlaceholder: "Search charms, bosses or places",
    dashboardIntro:
      "100% is every target on the board, each item counted once: the game’s own completion with all four free content packs, and the Grubs, maps, endings, quest steps and the rest it leaves out. What your save should read is under Check against the game.",
    boardTitle: "Completion targets",
    boardNote:
      "Every target counts, each item once, so 100% is exactly when What’s left is empty. The first sixteen are the game’s own completion, which weighs them differently (equipment counts twice, and Mask Shards and Vessel Fragments count only as whole masks and vessels), so its figure, in Check against the game, differs from this bar. Grubs, notches, Pale Ore, maps, stations, Roots, keys, endings and dream rematches count here too, and so do the guide’s own lists: key pickups, six bosses outside the game’s percentage, the challenges, Pure Completion and the quest steps.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or check the totals on the Progress page.",
    backupBlurb: "Export a copy of your checks and spoiler settings.",
  },
};

export default config;
