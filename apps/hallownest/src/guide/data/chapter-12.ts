import type { RawChapter } from "@hundo/core/types";

export default {
  id: 12,
  title: "Godhome and the Final Percentage",
  region: "Royal Waterways · Junk Pit · Godhome",
  teaser: "Godhome",
  intro: "Use a Simple Key to enter the Junk Pit and clear the first four Pantheons. With your other collections finished, return to an ending to lock in Pure Completion.",
  sources: [["Godhome access and Pantheon route", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["The Godtuner and system", "https://hollowknight.wiki/w/Godtuner"], ["Pantheon prerequisites", "https://hollowknight.wiki/w/Pantheons"], ["112% ledger", "https://pindrop.gg/hollow-knight/guides/112-percent-checklist"]],
  groups: [
    {
      title: "The Junk Pit and Hall of Gods",
      location: "Royal Waterways · Godhome",
      rows: [
        ["route-junk-pit", ["route"], "Reach the Junk Pit in the Royal Waterways", "From the Waterways bench, descend past the breakable floor and head west toward Flukemarm. Before you reach her room, climb and break the wall high on the northwest side. Pass the large Flukemungas in the tunnel beyond and cross the Junk Pit to the chained cocoon. Bring one Simple Key."],
        ["godtuner-godtuner", ["godtuner"], "Free the Godseeker and pick up the Godtuner", "Open the cocoon in the Junk Pit with a Simple Key and pick up the object she drops. Dream Nail the Godseeker to enter Godhome. This pickup earns one percentage point."],
        ["challenge-practice-gods", ["challenge"], "Practice troublesome bosses in the Hall of Gods", "Go through the lower entrance in Godhome and inspect the statues. Start at Attuned. Return here when a particular Pantheon fight ends several attempts. Read the Pantheon doors for any missing surface bosses before attempting a run."],
      ],
    },
    {
      title: "The four completion Pantheons",
      location: "Godhome",
      rows: [
        ["pantheon-master", ["pantheon"], "Clear the Pantheon of the Master", "Resolve the missing boss icons on the first door. Practice smaller early fights to conserve health for Oro and Mato. When they overlap, use spell damage or move away from the active brother and make safe hits."],
        ["pantheon-artist", ["pantheon"], "Clear the Pantheon of the Artist", "Check the second door’s prerequisites. Finish its earlier fights with enough health for Sheo. Use his paint-color tells to time dodges and take a few hits only in the open recovery."],
        ["pantheon-sage", ["pantheon"], "Clear the Pantheon of the Sage", "Complete the third set and practice Sly separately when possible. Let his multi-hit attack finish outside his range before punishing. In the fast final phase, move away from the slash then return for one hit. Grey Prince Zote joins the set only if unlocked by beating him outside Godhome."],
        ["pantheon-knight", ["pantheon"], "Clear the Pantheon of the Knight", "After the first three and the fourth door’s prerequisites, complete this run against Pure Vessel. Keep a safe gap, use Descending Dark when the area attacks overlap, and learn to react to the triple slash and spike cues. This is the last Pantheon that counts toward 112%."],
        ["achievement-pure-completion", ["achievement"], "Finish an ending with 112% on your file", "Check World Sense in the inventory. Once it reads 112%, return to an available Black Egg ending or complete a Godhome ending to record Pure Completion. Reloading after the credits keeps the save available."],
      ],
    },
    {
      title: "Optional Godhome and ending branches",
      location: "Godhome",
      rows: [
        ["challenge-hallownest", ["challenge"], "Attempt the Pantheon of Hallownest", "After the first four Pantheons, use the upper Godhome route and bring Void Heart. Practice any newly encountered variant in the Hall of Gods. Use the run’s bench breaks to switch builds. The fifth Pantheon and its bindings are optional for 112%."],
        ["ending-embrace-void", ["ending"], "Record Embrace the Void before gifting the flower", "Complete the fifth Pantheon and defeat its final encounter with the Godseeker still ungifted. Finish this ending before handing her a Delicate Flower to see both versions on one save."],
        ["quest-godseeker-flower", ["quest"], "Give the Godseeker a Delicate Flower after her first ending", "The Godseeker accepts it after you pick up the Godtuner and beat the first two Pantheons. Collect a replacement at the grave and return to the Junk Pit on foot without damage. Offer it only after the ungifted ending if you want both scenes."],
        ["ending-delicate-flower", ["ending"], "Record the flower version of the Godhome ending", "After giving the flower to the Godseeker, complete the fifth Pantheon again and defeat the final encounter. This is a variation of Embrace the Void."],
        ["challenge-bindings", ["challenge"], "Track optional Pantheon bindings and Godhome practice", "Use bindings after familiarizing yourself with the base runs. Collect binding rewards in the Lifeblood room when available. Attuned, Ascended and Radiant victories in the Hall of Gods are optional challenge goals."],
      ],
    },
  ],
} satisfies RawChapter;
