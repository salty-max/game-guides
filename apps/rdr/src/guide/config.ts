import { byChapter } from "@hundo/core/format";
import type { Banner, GuideConfig } from "@hundo/core/types";
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
  completion: {
    // Every category counts, each item once. A Stranger task counts once, by its last step: the steps before it get no tile of their own, and the tile opens every step.
    board: Object.keys(categories)
      .filter((tag) => tag !== "stranger-step")
      .map((tag) => (tag === "stranger" ? { tag, opens: "stranger-step" } : { tag })),
  },
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
      "Every category counts, each item once, so 100% is exactly when What’s left is empty. That includes outfit scraps and optional tasks, which the game’s own percentage leaves out, and every Ambient Challenge rank, where the game credits only ranks 5 and 10. A Stranger task counts once its last step is checked. The game’s weights are in the estimate under Check against the game.",
    nextUpDone: "Everything revealed is checked. Reveal the next chapter or compare with Stats → General.",
    backupBlurb: "Export a copy of your checks, spoiler settings and in-game percentage.",
  },
};

export default config;
