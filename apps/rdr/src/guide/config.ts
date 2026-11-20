import { byChapter } from "@hundo/core/format";
import type { Banner, BoardItem, GuideConfig } from "@hundo/core/types";
import { brand } from "./brand";
import chapter1 from "./data/chapter-1";
import chapter2 from "./data/chapter-2";
import chapter3 from "./data/chapter-3";
import chapter4 from "./data/chapter-4";
import chapter5 from "./data/chapter-5";
import { missables } from "./data/missables";
import { questlines } from "./data/questlines";
import { sources } from "./data/sources";
import { readReported } from "./estimate";

const banners = byChapter(import.meta.glob<Banner>("./banners/chapter-*.webp", { eager: true, query: "?banner", import: "default" }));

const categories: GuideConfig["categories"] = {
  mission: ["Story Missions", "Mission", "book", "rose"],
  stranger: ["Stranger Tasks", "Stranger", "compass"],
  // Every step of a Stranger task: the earlier ones as their first tag, the last one (tagged `stranger`, which the board counts) as its second.
  // Named after the tasks, so the Category select reads it as the whole of "Stranger Tasks", the board's tile, which opens it.
  "stranger-step": ["Stranger Tasks, every step", "Stranger step", "compass"],
  location: ["Map Locations", "Location", "pin", "violet"],
  bounty: ["Bounty Locations", "Bounty", "star", "amber"],
  challenge: ["Ambient Challenges", "Challenge", "grid", "sky"],
  outfit: ["Outfits", "Outfit", "shirt", "clay"],
  scrap: ["Outfit Scraps", "Scrap", "scroll", "sky"],
  safehouse: ["Safehouses", "Safehouse", "home"],
  hideout: ["Gang Hideouts", "Hideout", "mountain"],
  weapon: ["Rare Weapons", "Rare Weapon", "gem", "amber"],
  job: ["Jobs", "Job", "checkList"],
  minigame: ["Minigames", "Minigame", "dice"],
  optional: ["Optional Tasks", "Optional", "star"],
};

/** Bulk or sweep work: held back from "Next up" until nothing else is left. */
const sweep = new Set(["location", "scrap", "optional"]);

/**
 * The completion board, and what 100% is: every target counts, each item once, up to its goal, so the bar reads 100 exactly when
 * What's left is empty. Eleven goals are the game's own counts, and together they weigh 100 in the estimate: every target but the
 * scraps and the optional tasks. Each has two hosts named in `docs/facts-to-verify.md` (Counts). The scraps' 30 is six for each of five
 * outfits, listed by two hosts (the game credits only the finished outfit). The optional tasks are the guide's own list, whose goal is its
 * rows: no host totals them, and two say the game's 100% leaves each out. A Stranger task counts once, by its last step, so the steps
 * before it carry no target.
 * The story missions count: the game itself lists and credits them (Stats → General), so they are not directions. A test pins every goal.
 */
export const targets: BoardItem[] = [
  { tag: "mission", goal: 57, list: "game" },
  { tag: "stranger", goal: 18, list: "game", opens: "stranger-step" },
  { tag: "location", goal: 94, list: "game" },
  { tag: "bounty", goal: 20, list: "game" },
  { tag: "challenge", goal: 40, list: "game" },
  { tag: "outfit", goal: 9, list: "game" },
  { tag: "scrap", goal: 30, list: "game" },
  { tag: "safehouse", goal: 13, list: "game" },
  { tag: "hideout", goal: 7, list: "game" },
  { tag: "weapon", goal: 5, list: "game" },
  { tag: "job", goal: 5, list: "game" },
  { tag: "minigame", goal: 6, list: "game" },
  { tag: "optional", goal: 4, list: "guide" },
];

const config: GuideConfig = {
  brand,
  layout: "checklist",
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5],
  sources,
  categories,
  chips: {
    checklist: [
      ["mission", "Story"],
      ["stranger-step", "Strangers"],
      ["location", "Map locations"],
      ["bounty", "Bounties"],
      ["challenge", "Challenges"],
      ["outfit", "Outfits"],
    ],
    route: [
      ["mission", "Story"],
      ["stranger-step", "Strangers"],
      ["location", "Map"],
      ["challenge", "Challenges"],
      ["bounty", "Bounties"],
      ["outfit", "Outfits"],
    ],
  },
  missables,
  questlines,
  banners,
  defer: (row) => sweep.has(row.tags[0]),
  // A Stranger task counts once, by its last step: the steps before it get no tile of their own, and the tile opens every step.
  completion: { board: targets, directions: ["stranger-step"] },
  state: {
    // Saves from before the shared format: version 1 (no in-game percentage) and version 2 (`reported` at the top level).
    legacy: (v) =>
      v.guide === brand.id && (v.version === 1 || v.version === 2) ? { extra: { reported: v.version === 2 ? v.reported : null } } : null,
    extra: { initial: () => ({ reported: null }), read: readReported },
  },
  text: {
    checklistIntro: "Search by item, location or activity. Checks are shared with the walkthrough.",
    searchPlaceholder: "Search items or locations",
    dashboardIntro:
      "100% is every target on the board, each item counted once, outfit scraps and optional tasks included. The game’s own weighted percentage is estimated under Check against the game, to compare with Stats → General.",
    boardTitle: "By category",
    boardNote:
      "Every category counts, each item once, so 100% is exactly when What’s left is empty. That includes the story missions, which the game credits, and some things its own percentage leaves out: outfit scraps, optional tasks, and every Ambient Challenge rank, where the game credits only ranks 5 and 10. A Stranger task counts once, by its last step: the steps before it, which the game doesn’t credit, never count. The game’s weights are in the estimate under Check against the game.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or compare with Stats → General.",
    backupBlurb: "Export a copy of your checks, spoiler settings and in-game percentage.",
  },
};

export default config;
