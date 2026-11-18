import type { RawChapter } from "@hundo/core/types";

export default {
  id: 12,
  title: "Godhome and the Final Percentage",
  region: "Royal Waterways · Junk Pit · Godhome",
  teaser: "Godhome",
  intro: "Break into the Junk Pit under the Royal Waterways, free the Godseeker with a Simple Key and clear the first four Pantheons. With everything else done, finish an ending at 112% for Pure Completion.",
  sources: [["Steam guide ch 30 · the Junk Pit and Godhome’s layout", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Hollow Knight wiki · the Godtuner from the Godseeker’s coffin", "https://hollowknight.wiki/w/Godtuner"], ["Hollow Knight wiki · Pantheons: unlocks, final bosses and bindings", "https://hollowknight.wiki/w/Pantheons"], ["pindrop · the Godtuner and four Pantheons in the 112%", "https://pindrop.gg/hollow-knight/guides/112-percent-checklist"]],
  groups: [
    {
      title: "The Junk Pit and Hall of Gods",
      location: "Royal Waterways · Godhome",
      sources: [["Hollow Knight wiki · the Junk Pit: the roof by Flukemarm and the sarcophagus", "https://hollowknight.wiki/w/Royal_Waterways"], ["Hollow Knight wiki · Godhome: the way in, its floors and rooms", "https://hollowknight.wiki/w/Godhome"], ["Hollow Knight wiki · the Godseeker freed with a Simple Key", "https://hollowknight.wiki/w/Godseeker"], ["Hollow Knight wiki · Hall of Gods: statues and difficulties", "https://hollowknight.wiki/w/Hall_of_Gods"]],
      rows: [
        ["route-junk-pit", ["route"], "Reach the Junk Pit in the Royal Waterways", "From the Waterways bench, dive through the floor below it and head west toward Flukemarm. In the square room beside hers, break the roof in the north-west corner and go up. Mind the Flukemungas in the tunnel beyond, which hit for two masks, then cross the Junk Pit to the golden sarcophagus at its far side. Bring a Simple Key."],
        ["godtuner-godtuner", ["godtuner"], "Free the Godseeker and pick up the Godtuner", "Unlock the golden sarcophagus with a Simple Key. The Godseeker inside drops the Godtuner, worth one percent: pick it up, then strike her with the Dream Nail to enter Godhome."],
        ["challenge-practice-gods", ["challenge"], "Practice troublesome bosses in the Hall of Gods", "The Hall of Gods, on Godhome’s lowest floor, has a statue for each boss you’ve beaten, and a few more. Fight any of them at Attuned or Ascended, and at Radiant once you’ve won its Ascended fight; losing there costs nothing. Practice whichever boss keeps ending your Pantheon runs."],
      ],
    },
    {
      title: "The four completion Pantheons",
      location: "Godhome",
      note: "A Pantheon’s door shows a lock for each of its bosses you haven’t yet beaten in Hallownest; beat those first.",
      sources: [["Hollow Knight wiki · each Pantheon’s final boss and how it unlocks", "https://hollowknight.wiki/w/Pantheons"], ["Hollow Knight wiki · the Godtuner and four Pantheons in the 112%, and achievements after an ending", "https://hollowknight.wiki/w/Completion_(Hollow_Knight)"], ["Hollow Knight wiki · where the save loads after an ending", "https://hollowknight.wiki/w/Endings_(Hollow_Knight)"], ["Steam guide ch 30 · the order of the doors in Godhome", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"]],
      rows: [
        ["pantheon-master", ["pantheon"], "Clear the Pantheon of the Master", "Its door is the first, on the left of Godhome’s middle floor. The run ends against Brothers Oro & Mato."],
        ["pantheon-artist", ["pantheon"], "Clear the Pantheon of the Artist", "The second door. Paintmaster Sheo is its last fight."],
        ["pantheon-sage", ["pantheon"], "Clear the Pantheon of the Sage", "The third door, ending with Great Nailsage Sly. Grey Prince Zote is in it only if you beat him in Bretta’s basement; otherwise the run skips him."],
        ["pantheon-knight", ["pantheon"], "Clear the Pantheon of the Knight", "Its door opens to the right of the other three once they’re cleared. The last fight is Pure Vessel, a harder, faster Hollow Knight. This is the last Pantheon that counts toward 112%."],
        ["achievement-pure-completion", ["achievement"], "Finish an ending with 112% on your file", "Once your inventory reads 112%, finish any ending: the completion achievements are only given after one. Your save loads again afterward, at the Temple bench or, after a Godhome ending, in Godhome."],
      ],
    },
    {
      title: "Optional Godhome and ending branches",
      location: "Godhome",
      sources: [["Hollow Knight wiki · Pantheon of Hallownest: entry, 42 bosses, rest rooms", "https://hollowknight.wiki/w/Pantheon_of_Hallownest"], ["Hollow Knight wiki · Godhome’s upper area and the Lifeblood door", "https://hollowknight.wiki/w/Godhome"], ["Hollow Knight wiki · who accepts a Delicate Flower, and the grave’s new flowers", "https://hollowknight.wiki/w/Delicate_Flower"], ["Hollow Knight wiki · what breaks a Delicate Flower", "https://hollowknight.wiki/w/Delicate_Flower_(Quest)"], ["Hollow Knight wiki · the two Godhome endings", "https://hollowknight.wiki/w/Endings_(Hollow_Knight)"]],
      rows: [
        ["challenge-hallownest", ["challenge"], "Attempt the Pantheon of Hallownest", "Clearing the Pantheon of the Knight opens Godhome’s upper area: strike the structure above its door and climb to the fifth Pantheon at the very top. You need Void Heart to enter. It runs 42 bosses, with rest rooms between sets, each with a bench and a hot spring. Neither it nor its bindings give any percentage."],
        ["ending-embrace-void", ["ending"], "Record Embrace the Void before gifting the flower", "Clear the Pantheon of Hallownest and defeat Absolute Radiance at its end before you give the Godseeker a flower. She’ll accept one once you hold the Godtuner and have cleared the Pantheons of the Master and the Artist, and after that this ending only plays in the flower’s version, so keep the flower back until you’ve seen it."],
        ["quest-godseeker-flower", ["quest"], "Give the Godseeker a Delicate Flower after Embrace the Void", "Since the Grey Mourner’s quest, new flowers grow by the grave in Queen’s Gardens after you rest at a bench. Pick one and carry it to the Godseeker in the Junk Pit without taking a hit, riding a Stag or warping by Dreamgate; trams are safe. Give it to her once Embrace the Void is done."],
        ["ending-delicate-flower", ["ending"], "Record the flower version of the Godhome ending", "With the flower given, clear the Pantheon of Hallownest again. The ending now plays the flower’s scene; it’s a version of Embrace the Void and shares its achievement."],
        ["challenge-bindings", ["challenge"], "Track optional Pantheon bindings and Godhome practice", "Bindings are optional handicaps for any Pantheon run: Nail, Shell, Charms and Soul. Each binding you clear on a Pantheon for the first time fills a notch around the locked door left of the Hall of Gods; the first major notch opens it and adds Lifeblood masks to your Pantheon runs. Bound clears also add Lifeblood cocoons to each Pantheon’s hot spring room. Like Ascended and Radiant wins in the Hall of Gods, none of it counts toward 112%."],
      ],
    },
  ],
} satisfies RawChapter;
