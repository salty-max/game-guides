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
 * The completion board, and the overall figure with it: every target counts, one entry each, so 100% is everything the guide tracks.
 * The first eleven are the game's own completion count. A test pins every goal to the data.
 */
export const targets: BoardItem[] = [
  { tag: "tool", goal: 51 },
  { tag: "skill", goal: 6 },
  { tag: "kit", goal: 4 },
  { tag: "pouch", goal: 4 },
  { tag: "silk-heart", goal: 3 },
  { tag: "crest", goal: 6 },
  { tag: "ability", goal: 7 },
  { tag: "mask-shard", goal: 20 },
  { tag: "spool-fragment", goal: 18 },
  { tag: "needle", goal: 4 },
  { tag: "item", goal: 1 },
  { tag: "mobility", goal: 2 },
  { tag: "flea", goal: 30 },
  { tag: "memory-locket", goal: 20 },
  { tag: "craftmetal", goal: 8 },
  { tag: "pale-oil", goal: 3 },
  { tag: "simple-key", goal: 4 },
  { tag: "mossberry", goal: 7 },
  { tag: "relic", goal: 21 },
  { tag: "memento", goal: 8 },
  { tag: "map", goal: 28 },
  { tag: "bellshrine", goal: 6 },
  { tag: "bellway", goal: 12 },
  { tag: "ventrica", goal: 7 },
  { tag: "quest" },
  { tag: "boss" },
  { tag: "ending", goal: 5 },
  { tag: "challenge" },
];

const config: GuideConfig = {
  brand,
  layout: "article",
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10, chapter11, chapter12],
  sources,
  categories: {
    route: ["Route steps", "Route", "compass"],
    pickup: ["Other discoveries", "Pickup", "chest", "mint"],
    boss: ["Boss encounters", "Boss", "sword", "rose"],
    quest: ["Wishes", "Wish", "scroll", "mint"],
    tool: ["Tools", "Tool", "chest", "amber"],
    skill: ["Silk Skills", "Silk Skill", "star", "violet"],
    kit: ["Crafting Kits", "Crafting Kit", "chest", "amber"],
    pouch: ["Tool Pouches", "Tool Pouch", "chest", "amber"],
    "silk-heart": ["Silk Hearts", "Silk Heart", "heart", "rose"],
    crest: ["Crests", "Crest", "ribbon", "violet"],
    ability: ["Counted abilities", "Ability", "compass", "sky"],
    mobility: ["Cloaks", "Cloak", "compass", "sky"],
    "mask-shard": ["Mask Shards", "Mask Shard", "heart", "rose"],
    "spool-fragment": ["Spool Fragments", "Spool Fragment", "flask", "sky"],
    needle: ["Needle upgrades", "Needle upgrade", "sword", "amber"],
    item: ["Key item", "Key item", "star", "mint"],
    "pale-oil": ["Pale Oils", "Pale Oil", "flask", "amber"],
    flea: ["Lost Fleas", "Lost Flea", "heart", "mint"],
    "memory-locket": ["Memory Lockets", "Memory Locket", "gem", "violet"],
    craftmetal: ["Craftmetal", "Craftmetal", "gem", "clay"],
    "simple-key": ["Simple Keys", "Simple Key", "chest", "amber"],
    mossberry: ["Mossberries", "Mossberry", "chest", "mint"],
    relic: ["Relics and cylinders", "Relic", "book", "amber"],
    memento: ["Mementos", "Memento", "star", "violet"],
    bellshrine: ["Bellshrines", "Bellshrine", "pin", "violet"],
    map: ["Area maps", "Map", "compass", "sky"],
    bellway: ["Bellway stops", "Bellway", "pin", "sky"],
    ventrica: ["Ventrica stops", "Ventrica", "pin", "sky"],
    ending: ["Endings", "Ending", "book", "violet"],
    challenge: ["Challenges", "Challenge", "ribbon", "mint"],
  },
  chips: {
    checklist: [
      ["tool", "Tools"],
      ["quest", "Wishes"],
      ["flea", "Lost Fleas"],
      ["mask-shard", "Mask Shards"],
      ["spool-fragment", "Spool Fragments"],
      ["memory-locket", "Memory Lockets"],
      ["boss", "Boss encounters"],
      ["crest", "Crests"],
      ["pale-oil", "Pale Oils"],
      ["map", "Area maps"],
      ["ending", "Endings"],
    ],
  },
  missables,
  questlines,
  banners,
  completion: { board: targets },
  state: {},
  text: {
    checklistIntro: "Search by tool, Wish, boss or place. Checks are shared with the walkthrough.",
    searchPlaceholder: "Search tools, Wishes or places",
    dashboardIntro: "Every entry the guide tracks counts once, so 100% means all of it: every item, collection, Wish, boss, ending and challenge.",
    boardTitle: "Completion targets",
    boardNote:
      "Every target counts toward the overall figure, one entry each. The first eleven are what the game's own completion counts, with four Mask Shards to a mask and two Spool Fragments to a spool; the rest are the collections, Wishes, bosses, endings and challenges a full save also holds.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or check the totals on the Progress page.",
    backupBlurb: "Export a copy of your checks and spoiler settings.",
  },
};

export default config;
