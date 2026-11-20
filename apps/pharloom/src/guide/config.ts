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
import chapter13 from "./data/chapter-13";
import { choices } from "./data/choices";
import { missables } from "./data/missables";
import { questlines } from "./data/questlines";
import { sources } from "./data/sources";

const banners = byChapter(import.meta.glob<Banner>("./banners/chapter-*.webp", { eager: true, query: "?banner", import: "default" }));

/**
 * The completion board, and the overall figure with it: every target counts, one entry each and nothing optional, so 100% is
 * everything the guide tracks and the bar reads 100 exactly when What's left is empty. The first eleven are the game's own
 * completion count, term by term. The game's lists follow (fleas, lockets, maps and the rest), then the guide's own lists, whose
 * goals are their rows rather than a game total: the pickups, the Wishes, the bosses and the challenges. Route steps are
 * directions and never count. Both ways of the one-way choice count, the second in chapter 13 with the Steel Soul boss, so 100%
 * takes a second save. A test pins every goal.
 */
export const targets: BoardItem[] = [
  { tag: "tool", goal: 51, list: "game" },
  { tag: "skill", goal: 6, list: "game" },
  { tag: "kit", goal: 4, list: "game" },
  { tag: "pouch", goal: 4, list: "game" },
  { tag: "silk-heart", goal: 3, list: "game" },
  { tag: "crest", goal: 6, list: "game" },
  { tag: "ability", goal: 7, list: "game" },
  { tag: "mask-shard", goal: 20, list: "game" },
  { tag: "spool-fragment", goal: 18, list: "game" },
  { tag: "needle", goal: 4, list: "game" },
  { tag: "item", goal: 1, list: "game" },
  { tag: "mobility", goal: 2, list: "game" },
  { tag: "flea", goal: 30, list: "game" },
  { tag: "memory-locket", goal: 20, list: "game" },
  { tag: "craftmetal", goal: 8, list: "game" },
  { tag: "pale-oil", goal: 3, list: "game" },
  { tag: "simple-key", goal: 4, list: "game" },
  { tag: "mossberry", goal: 7, list: "game" },
  { tag: "relic", goal: 21, list: "game" },
  { tag: "memento", goal: 8, list: "game" },
  { tag: "map", goal: 28, list: "game" },
  { tag: "bellshrine", goal: 6, list: "game" },
  { tag: "bellway", goal: 12, list: "game" },
  { tag: "ventrica", goal: 7, list: "game" },
  { tag: "pickup", goal: 13, list: "guide" },
  { tag: "wish", goal: 79, list: "guide" },
  { tag: "boss", goal: 41, list: "guide" },
  { tag: "ending", goal: 5, list: "game" },
  { tag: "challenge", goal: 8, list: "guide" },
];

const config: GuideConfig = {
  brand,
  layout: "article",
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10, chapter11, chapter12, chapter13],
  sources,
  // The game keeps its own achievement list: Switch and Switch 2 have none of their own, so there the game records them itself, as Feats.
  achievements: {
    sources: [
      ["Hollow Knight wiki · on Switch and Switch 2 the achievements are in-game Feats", "https://hollowknight.wiki/w/Achievements_(Silksong)"],
      ["Nintendo Life · on Switch and Switch 2 they're recorded in-game, on the main menu", "https://www.nintendolife.com/guides/hollow-knight-silksong-all-achievements"],
    ],
  },
  categories: {
    route: ["Route steps", "Route", "compass"],
    pickup: ["Other discoveries", "Pickup", "chest", "mint"],
    boss: ["Boss encounters", "Boss", "sword", "rose"],
    wish: ["Wishes", "Wish", "scroll", "mint"],
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
      ["wish", "Wishes"],
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
  choices,
  questlines,
  banners,
  completion: { board: targets, directions: ["route"] },
  state: {},
  text: {
    checklistIntro: "Search by tool, Wish, boss or place. Checks are shared with the walkthrough.",
    searchPlaceholder: "Search tools, Wishes or places",
    dashboardIntro: "Every entry the guide tracks counts once, so 100% means all of it: every item, collection, Wish, boss, ending and challenge.",
    boardTitle: "Completion targets",
    boardNote:
      "Every target counts toward the overall figure, one entry each. The first eleven are what the game's own completion counts, with four Mask Shards to a mask and two Spool Fragments to a spool; the rest are the collections, pickups, Wishes, bosses, endings and challenges a full save also holds. Route steps don't count. One boss and one way of a one-way choice need a second save, so 100% takes two.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or check the totals on the Progress page.",
    backupBlurb: "Export a copy of your checks and spoiler settings.",
  },
};

export default config;
