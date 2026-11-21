import type { BuildEntry } from "@hundo/core/types";

/**
 * What each build is worth going for, by row, one entry per item: facts its sources state (what an item needs, which stats it scales
 * with, what only one seller has), never "best" and never a scaling letter. Requirements are one-handed.
 */
export const builds: BuildEntry[] = [
  {
    row: "pickup-firelink-graveyard",
    serves: ["dex"],
    kind: "weapon",
    note: "Winged Spear: needs 13 Strength and 15 Dexterity, and scales mostly with Dexterity.",
    sources: ["https://darksouls.wikidot.com/winged-spear"],
  },
  {
    row: "pickup-firelink-graveyard",
    serves: ["str"],
    kind: "weapon",
    note: "Zweihander: needs 24 Strength and 10 Dexterity, and scales mostly with Strength.",
    sources: ["https://darksouls.wikidot.com/zweihander"],
  },
  {
    row: "covenant-way-of-white",
    serves: ["fth"],
    kind: "spell",
    note: "Petrus sells miracles at Firelink, Heal among them, which needs 12 Faith.",
    sources: ["https://darksouls.wikidot.com/petrus-of-thorolund"],
  },
  {
    row: "pickup-claymore",
    serves: ["str", "dex"],
    kind: "weapon",
    note: "Claymore: needs 16 Strength and 10 Dexterity, and scales with both.",
    sources: ["https://darksouls.wikidot.com/claymore"],
  },
  {
    row: "quest-griggs",
    serves: ["int"],
    kind: "spell",
    note: "Griggs sells sorceries at Firelink once rescued, Soul Arrow among them, to a character with at least 10 Intelligence.",
    sources: ["https://darksouls.wikidot.com/griggs-of-vinheim"],
  },
  {
    row: "ember-large",
    serves: ["str", "dex"],
    kind: "path",
    note: "Large Ember: Andre takes a Normal weapon past +5 with it, up to +10, and each Normal level raises its Strength and Dexterity scaling.",
    sources: ["https://darksouls.wikidot.com/large-ember", "https://darksouls.wiki.fextralife.com/Regular+Upgrades"],
  },
  {
    row: "ember-chaos-flame",
    serves: ["hum"],
    kind: "path",
    note: "Chaos Flame Ember: Vamos ascends a Fire +5 weapon to Chaos with it, and a Chaos weapon scales with humanity, up to 10, not with Strength or Dexterity.",
    sources: ["https://darksouls.wikidot.com/chaos", "https://darksouls.wiki.fextralife.com/Chaos+Upgrades"],
  },
  {
    row: "quest-laurentius",
    serves: ["pyro"],
    kind: "path",
    note: "Pyromancy Flame: Laurentius reinforces it up to +15, and a pyromancy grows only with the flame.",
    sources: ["https://darksouls.wikidot.com/laurentius", "https://darksouls.wiki.fextralife.com/Pyromancy+Flame"],
  },
  {
    row: "quest-laurentius",
    serves: ["pyro"],
    kind: "spell",
    note: "Iron Flesh and Flash Sweat: only Laurentius sells them.",
    sources: ["https://darksouls.wikidot.com/laurentius"],
  },
];
