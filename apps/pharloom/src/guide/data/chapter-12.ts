import type { RawChapter } from "@hundo/core/types";

export default {
  id: 12,
  title: "The Last Dive",
  region: "Red Memory · The Cradle · Nameless Town · The Abyss",
  teaser: "The Cradle",
  intro: "Finish the percentage ledger, follow the last story route, and return for the optional epilogue and keepsakes.",
  sources: [["Everbloom", "https://hollowknight.wiki/w/Everbloom"], ["The Cradle", "https://hollowknight.wiki/w/The_Cradle"], ["Lost Lace", "https://hollowknight.wiki/w/Lost_Lace"], ["Mister Mushroom (Silksong)", "https://hollowknight.wiki/w/Mister_Mushroom_(Silksong)"], ["Completion (Silksong)", "https://hollowknight.wiki/w/Completion_(Silksong)"], ["Route reference", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "The Red Memory and the summit",
      location: "Moss Grotto · The Cradle",
      rows: [
        ["item-everbloom", ["item"], "Complete the Red Memory to obtain the Everbloom", "After handing over the Old Hearts, follow the chapel objective into the Red Memory in Moss Grotto. Complete the memory and speak to the White Lady. The Everbloom lets you travel through the Void for the last dive."],
        ["skill-pale-nails", ["skill"], "Learn Pale Nails from the arm at the top of the Cradle", "Return to the Cradle in Act 3. Use Silk Soar from the high rooms to reach Grand Mother Silk's severed arm and Bind it for the final Silk Skill."],
        ["route-nameless-town", ["route"], "Find Nameless Town above the Cradle", "Use Silk Soar up from the summit and follow the surface trail. Check the far-right house for the Surface Memento. The caves below the town hold one more optional encounter."],
        ["route-percentage", ["route"], "Check the Farsight reads 100% before the final dive", "Use the full checklist to audit the missing point. In particular, count a Mask only every four Shards and a Spool only every two Fragments. Check the Curveclaw trade and Eva's Sylphsong if all other tools and upgrades appear complete."],
        ["boss-summoned-saviour", ["boss"], "Fight Summoned Saviour on a Steel Soul file", "This encounter is exclusive to Steel Soul. Follow the Bonegrave route to the breakable wall at the extreme southwest and enter the shrine. Keep this check separate from the standard-save percentage.", {"reference": "https://hollowknight.wiki/w/Summoned_Saviour"}],
      ],
    },
    {
      title: "Passing of the Age",
      location: "Pharloom",
      rows: [
        ["wish-mushroom-riddle", ["quest"], "Read the Mushroom riddle in the Putrified Ducts", "From the Ducts' eastern cave, Silk Soar into the hidden room and inspect the tablet. Start Passing of the Age. Visit the seven locations in order and play the Needolin until the buried Mushroom emerges. Then talk to him."],
        ["wish-mushroom-grotto", ["quest"], "Meet Mister Mushroom below the Ruined Chapel", "Return to the Moss Mother area below the chapel in Moss Grotto. Look for the small mushroom patch in the fight room and play the Needolin there."],
        ["wish-mushroom-bone-bottom", ["quest"], "Meet Mister Mushroom above Bone Bottom", "Climb the right side of the ruined settlement, above Shakra's earlier map post. Find the patch on the upper ledge and play before speaking."],
        ["wish-mushroom-far-fields", ["quest"], "Meet Mister Mushroom near Weavenest Cindril", "Go to the far east of the Far Fields and find him on the platform just to the left of the Cindril entrance. Play and talk before heading back to Greymoor."],
        ["wish-mushroom-greymoor", ["quest"], "Meet Mister Mushroom on the upper Greymoor towers", "Climb the Greymoor towers below Wisp Thicket. Look for the patch along the upper route and play the Needolin.", {"reference": "https://hollowknight.wiki/w/Passing_of_the_Age_(Wish)"}],
        ["wish-mushroom-slab", ["quest"], "Meet Mister Mushroom outside First Sinner's arena", "Return to the Slab and unlock the route from the Key of Apostate area. Play the Needolin at the patch outside First Sinner's arena.", {"reference": "https://hollowknight.wiki/w/Passing_of_the_Age_(Wish)"}],
        ["wish-mushroom-fay", ["quest"], "Speak to Mister Mushroom beside Fayforn", "Climb Mount Fay to the tuning fork. He is already above ground beside Fayforn. Speak to him before making the last visit."],
        ["wish-mushroom-surface", ["quest"], "Meet Mister Mushroom below Nameless Town", "Silk Soar above the Cradle and look along the approach before Nameless Town. Finish the last exchange and then clear the Act 3 ending for the extra scene."],
      ],
    },
    {
      title: "The final ending",
      location: "The Abyss",
      rows: [
        ["boss-lost-lace", ["boss"], "Defeat Lost Lace at the bottom of the Abyss", "After obtaining the Everbloom, return to the reinforced diving bell. Follow the route to the Void sea and dive into the encounter. Learn the gaps after Lace's lunges first, then take short hits. Save Bind for the long recoveries as the Void attacks begin to cover more of the arena."],
        ["ending-sister-of-the-void", ["ending"], "Finish the last ascent and record Sister of the Void", "After beating Lost Lace, follow the rescue and escape sequence to the credits. Check the completion result and reload later if you want to finish optional collections."],
        ["challenge-completion-achievement", ["challenge"], "Record the Completion achievement", "If your file is at 100%, finish the final ending. If the file was short when you cleared it, complete the missing upgrades and fight Lost Lace again to record a finish at 100%.", {"reference": "https://hollowknight.wiki/w/Endings_(Silksong)"}],
        ["ending-passing-of-the-age", ["ending"], "See the Passing of the Age epilogue", "Finish the final ending after all seven Mushroom encounters. Let the ending run through the extra scene."],
      ],
    },
    {
      title: "Optional keepsakes and Bellhome",
      location: "Pharloom",
      compact: true,
      rows: [
        ["wish-final-race", ["quest", "challenge"], "Beat Sprintmaster Swift's final six-lap race", "After obtaining the Everbloom and winning Fastest in Pharloom, return to Swift for the longer race. Run the last course for six laps and collect Sprintmaster Memento."],
        ["wish-hunters-memento", ["quest"], "Complete Nuu's required Hunter's Journal entries", "Consult the linked Journal list for the complete requirements, including encounters that have Act 3 substitutes. Return to Nuu for the Hunter's Memento after completing the Journal. The Act 2 optional duels are separate entries.", {"reference": "https://hollowknight.wiki/w/Hunter's_Journal_(Silksong)"}],
        ["route-surface-memento", ["pickup"], "Take the Surface Memento from the last Nameless Town house", "Go all the way right on the surface and play the Needolin inside the far house. Collect the keepsake that drops from above."],
      ],
    },
    {
      title: "Collectibles and unlocks · Nameless Town",
      location: "Nameless Town",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memento-surface-memento", ["memento"], "Surface Memento", "At the surface above the Cradle, play the Needolin inside the house on the far right.", {"reference": "https://hollowknight.wiki/w/Bellhome", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479542"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Halfway Home",
      location: "Halfway Home",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memento-hunters-memento", ["memento"], "Hunter's Memento", "Show Nuu the completed required Hunter's Journal entries in Greymoor. Claim the Hunter's Memento.", {"reference": "https://hollowknight.wiki/w/Bellhome", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479635"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Far Fields",
      location: "Far Fields",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memento-sprintmaster-memento", ["memento"], "Sprintmaster Memento", "After the Everbloom, win the six-lap race against Sprintmaster Swift for the Sprintmaster Memento.", {"reference": "https://hollowknight.wiki/w/Bellhome", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479634"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Pharloom",
      location: "Pharloom",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memento-heart-memento", ["memento"], "Heart Memento", "Collect all four Old Hearts, then deliver any three to the Shamans. Display the one you retain as the Heart Memento.", {"reference": "https://hollowknight.wiki/w/Bellhome", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479631"]}],
      ],
    },
  ],
} satisfies RawChapter;
