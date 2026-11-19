import type { RawChapter } from "@hundo/core/types";

export default {
  id: 8,
  title: "The Slab and the Frozen Ascent",
  region: "The Slab · Mount Fay · Whiteward and Far Fields revisits",
  teaser: "Mount Fay",
  intro: "Climb Mount Fay for the double jump, choose a permanent Silkshot variant, and return to the places the new cloak opens.",
  sources: [["The Slab", "https://hollowknight.wiki/w/The_Slab"], ["Mount Fay", "https://hollowknight.wiki/w/Mount_Fay"], ["Faydown Cloak", "https://hollowknight.wiki/w/Faydown_Cloak"], ["Silkshot", "https://hollowknight.wiki/w/Silkshot"], ["First Sinner", "https://hollowknight.wiki/w/First_Sinner"], ["Route reference", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "The prison road and Mount Fay",
      location: "The Slab · Mount Fay",
      rows: [
        ["route-slab", ["route"], "Reach The Slab by the Citadel bridge", "Take the Choral Chambers bridge a floor above the Spa bench and open the prison Bellway. From here you can reach Mount Fay. If a Wardenfly already captured you, reclaim the equipment near the upper bench, clear the arena, and join this route at the Bellway."],
        ["pickup-key-heretic", ["pickup"], "Find the Key of Heretic in The Slab", "Check the bottom room on the route after capture or return via the Key of Apostate. Use the linked Slab Keys reference to locate the prison locks.", {"reference": "https://hollowknight.wiki/w/Slab_Keys"}],
        ["route-fay-climb", ["route"], "Climb Mount Fay from the Slab Bellway", "Take the path west from the station and use Clawline on the first hoops. Move from shelter to shelter. The cold builds while exposed, so use benches and warm rooms as checkpoints. Use enemy bodies or hoops to extend jumps when the ledges are too far apart."],
        ["mobility-faydown-cloak", ["mobility"], "Play the Needolin at the tuning fork to receive the Faydown Cloak", "At Mount Fay's summit, stand by the fork and play until the Fayforn arrives. Take the cloak it gives you. The double jump makes the descent and remaining cliff ledges easier, and the cold now stops hurting you."],
      ],
    },
    {
      title: "Revisits for the upper cloak routes",
      location: "Blasted Steps · Sinner's Road · Wisp Thicket",
      rows: [
        ["route-wisp-thicket", ["route"], "Open Wisp Thicket from the Greymoor and Sinner's Road approach", "Use the Faydown Cloak to reach the high connection. Follow the lit paths between the Wisps and clear the breakable side passages. The far side connects back toward the Underworks."],
        ["boss-father-of-the-flame", ["boss"], "Defeat Father of the Flame", "Find the flame structure inside Wisp Thicket. Work up the sides, using aerial attacks to strike the pink weak points. Drop away from overlapping fire before charging back in, then collect the Wispfire Lantern."],
        ["boss-lugoli", ["boss"], "Defeat Disgraced Chef Lugoli", "Double-jump into the upper kitchen of Sinner's Road. Stay out from under the jumping chef, then close for a few hits. The Pickled Muckmaggot for the Citadel dinner is beyond the room."],
      ],
    },
    {
      title: "The long return circuit",
      location: "Blasted Steps · Weavenests",
      compact: true,
      rows: [
        ["kit-grindle", ["kit"], "Buy Grindle's Crafting Kit", "Visit his shop in Blasted Steps and buy it for 700 Rosaries."],
        ["skill-sharpdart", ["skill"], "Learn Sharpdart in Weavenest Karn", "Play the Needolin at the Weaver door in the Wormways, use Clawline to get through the room, and Bind at the shrine."],
        ["boss-forebrothers", ["boss"], "Defeat Forebrothers Signis and Gron", "Return to lower Deep Docks through the Far Fields connection with Clawline. At the arena, track both windups. Punish the brother who has landed without dashing into the other's swing."],
        ["route-docks-keydoor", ["route"], "Open the lower Deep Docks lock if you want the shortcut", "Spend your fourth Simple Key at the chained door south of Forge Daughter. You can also reach the lower Docks from Far Fields with Clawline and save the key.", {"reference": "https://hollowknight.wiki/w/Simple_Key_(Silksong)"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Mount Fay",
      location: "Mount Fay",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-memory-crystal", ["tool"], "Memory Crystal", "Go through the side tunnel to its dead end. Strike the large crystal there to get the tool.", {"reference": "https://hollowknight.wiki/w/Memory_Crystal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478947"]}],
        ["mask-shard-13", ["mask-shard"], "Mask Shard · Mount Fay", "After receiving Faydown Cloak, go left of the lowermost bench and climb into the large hollow cylinder.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479038"]}],
        ["flea-mount-fay", ["flea"], "Lost Flea on Mount Fay", "Climb the central mountain room with Cling Grip and Clawline. Check the highest ledge in that room before continuing to the summit.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478380"]}],
        ["map-mount-fay", ["map"], "Get the Mount Fay map", "Find Shakra at her sheltered post during the climb. Talk in shelter before continuing uphill. The map costs 40 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Blasted Steps",
      location: "Blasted Steps",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-snitch-pick", ["tool"], "Snitch Pick", "Buy the pick in Grindle's Blasted Steps shop for 740 Rosaries.", {"reference": "https://hollowknight.wiki/w/Snitch_Pick", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479201"]}],
        ["tool-thiefs-mark", ["tool"], "Thief's Mark", "Buy the mark in Grindle's Blasted Steps shop for 350 Rosaries.", {"reference": "https://hollowknight.wiki/w/Thief's_Mark", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478525"]}],
        ["mask-shard-16", ["mask-shard"], "Mask Shard · Blasted Steps revisit", "Return with Faydown Cloak and double-jump up the mapped high shaft near the region's outer boundary.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478498"]}],
        ["spool-fragment-17", ["spool-fragment"], "Spool Fragment · Blasted Steps", "Buy the fragment from Grindle for 680 Rosaries after reaching his shop.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478527"]}],
        ["relic-psalm-cylinder-blasted-steps", ["relic"], "Psalm Cylinder · Blasted Steps", "Pay Grindle 240 Rosaries for the Psalm Cylinder.", {"reference": "https://hollowknight.wiki/w/Items_(Silksong)#Tradables", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478530"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Wisp Thicket",
      location: "Wisp Thicket",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-wispfire-lantern", ["tool"], "Wispfire Lantern", "Finish the Father of the Flame encounter and collect the Wispfire Lantern from the arena.", {"reference": "https://hollowknight.wiki/w/Wispfire_Lantern", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479156"]}],
        ["mask-shard-14", ["mask-shard"], "Mask Shard · Wisp Thicket", "Double-jump through the rightmost platforming course. The shard is at its far end.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479151"]}],
        ["craftmetal-7", ["craftmetal"], "Craftmetal · Wisp Thicket", "Explore the upper-left branch near the Wisp spawners and follow the hidden path to its dead-end metal pickup.", {"reference": "https://hollowknight.wiki/w/Craftmetal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479157"]}],
        ["relic-bone-scroll-wisp-thicket", ["relic"], "Bone Scroll · Wisp Thicket", "Climb the high platforming route for the Bone Scroll at its far end.", {"reference": "https://hollowknight.wiki/w/Items_(Silksong)#Tradables", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479150"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Far Fields",
      location: "Far Fields",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["mask-shard-11", ["mask-shard"], "Mask Shard · Far Fields revisit", "Use Clawline to ascend Skull Cavern in the Far Fields. Search the high ledge for the shard.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478841"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · The Slab",
      location: "The Slab",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["spool-fragment-4", ["spool-fragment"], "Spool Fragment · The Slab", "Climb the frosted western branch of the prison. Time the exposed wall jumps between the safer ledges and take the fragment at the top.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478475"]}],
        ["flea-the-slab-2", ["flea"], "Lost Flea above the Slab bench", "With the double jump, climb immediately above the lower prison bench to the ledge with the cage.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478392"]}],
        ["bellway-the-slab", ["bellway"], "Open The Slab Bellway", "Find the station mechanism and pay 40 Rosaries to unlock this stop.", {"reference": "https://hollowknight.wiki/w/Bellway#Bellways", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478390"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Deep Docks",
      location: "Deep Docks",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["spool-fragment-14", ["spool-fragment"], "Spool Fragment · Deep Docks revisit", "With Clawline, return via Far Fields to the bottom-right forge paths and follow the marked lower branch to its fragment.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478825"]}],
        ["flea-deep-docks-2", ["flea"], "Lost Flea beyond the lower Docks arena", "Return to the Docks with Clawline and clear the arena on the mapped route. Explore the passage that opens after the fight.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478437"]}],
        ["memory-locket-deep-docks", ["memory-locket"], "Memory Locket · Deep Docks", "Break into the low lava chamber and search the corpse at the bottom of the hidden room.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478836"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Memorium",
      location: "Memorium",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["spool-fragment-16", ["spool-fragment"], "Spool Fragment · Memorium revisit", "Return with Faydown Cloak and climb into the southwestern Memorium's raised fragment route.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479117"]}],
        ["flea-memorium-giant-flea", ["flea"], "Lost Flea in the Memorium dome", "Double-jump into the dome at the top of Memorium. Rescue the Huge Flea there. It counts as one of the 30.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478413"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Underworks from Wisp Thicket",
      location: "Underworks from Wisp Thicket",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["flea-underworks", ["flea"], "Lost Flea past the Underworks saws", "Enter from Wisp Thicket and cross the long saw passage to the isolated part of the Underworks. Follow it to the cage.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478419"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Greymoor",
      location: "Greymoor",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memory-locket-greymoor-2", ["memory-locket"], "Memory Locket · Greymoor (#2)", "Double-jump at the Halfway Home to reach its upper interior locket.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478039"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Shellwood",
      location: "Shellwood",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["relic-weaver-effigy-shellwood", ["relic"], "Weaver Effigy · Shellwood", "Follow the Chapel of the Witch to the high right-hand ledge and collect the Weaver Effigy.", {"reference": "https://hollowknight.wiki/w/Items_(Silksong)#Tradables", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478794"]}],
      ],
    },
  ],
} satisfies RawChapter;
