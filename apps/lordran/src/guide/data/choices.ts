import type { Choice } from "@hundo/core/types";

// The first cycle takes the way the guide recommends; the other way is a row of its own in NG+ or NG++ (chapter 13), so both count. Where
// the other way only yields an item, the item's own row is the later way (Siegmeyer's ring, the Abyss Greatsword), so it counts once.
// A choice's name, its why and the later rows' titles show in the choice's chapter, so they say only what that chapter says.
export const choices: Choice[] = [
  {
    row: "quest-lautrec-invasion",
    name: "Lautrec and Anastacia",
    why: "Settled before this chapter: Lautrec kills Anastacia once you ring both bells or take two Fire Keeper Souls, unless you killed him first.",
    later: [{ row: "cycle-ng-plus-lautrec", on: "NG+" }],
    sources: ["https://darksouls.wikidot.com/knight-lautrec-of-carim", "https://darksouls.wiki.fextralife.com/Knight+Lautrec"],
  },
  {
    row: "quest-lordvessel-frampt",
    name: "Frampt or Kaathe",
    why: "If Kaathe takes you to place the Lordvessel, Frampt leaves until the next playthrough.",
    later: [{ row: "cycle-ng-plus-plus-kaathe", on: "NG++" }],
    sources: ["https://darksouls.wikidot.com/darkstalker-kaathe", "https://darksouls.wiki.fextralife.com/Kingseeker+Frampt"],
  },
  {
    row: "quest-patches-forgive",
    name: "Patches asks your forgiveness",
    why: "He asks your forgiveness once, and only refusing him gives Twin Humanities.",
    later: [{ row: "cycle-ng-plus-patches", on: "NG+" }],
    sources: ["https://darksouls.wikidot.com/patches", "https://darksouls.wiki.fextralife.com/Patches+the+Hyena"],
  },
  {
    row: "quest-solaire-shortcut",
    name: "Solaire and the red-eyed bug",
    why: "Kill the red-eyed Chaos Bug before you enter Lost Izalith, or Solaire goes mad.",
    later: [{ row: "cycle-ng-plus-solaire", on: "NG+" }],
    sources: ["https://darksouls.wikidot.com/solaire-of-astora", "https://www.goldphantom.com/tools/ds1/npc-quest-tracker/"],
  },
  {
    row: "quest-sieg-ash",
    name: "How Siegmeyer leaves the pit",
    why: "Out of the Chaos Eaters’ pit at half health or more he goes to Ash Lake with Sieglinde; below half he dies and drops his ring. One per cycle.",
    later: [{ row: "ring-speckled-stoneplate", on: "NG+" }],
    sources: ["https://darksouls.wikidot.com/siegmeyer-of-catarina", "https://darksouls.wiki.fextralife.com/Siegmeyer+of+Catarina"],
  },
  {
    row: "quest-ciaran",
    name: "Ciaran and the Soul of Artorias",
    why: "Hand the Soul of Artorias to Ciaran for her Tracers and it’s hers for this cycle.",
    later: [{ row: "dlc-abyss-greatsword", on: "NG+" }],
    sources: ["https://darksouls.wikidot.com/lord-s-blade-ciaran", "https://darksouls.wiki.fextralife.com/Lord's+Blade+Ciaran"],
  },
];
