import type { RawChapter } from "@hundo/core/types";

export default {
  id: 3,
  title: "Across the Far Fields and Greymoor",
  region: "Far Fields · Greymoor · Halfway Home",
  teaser: "Greymoor",
  intro: "Get the Seamstress's help, ride the Far Fields updrafts, and open the Pilgrim road through Greymoor.",
  sources: [["Far Fields", "https://hollowknight.wiki/w/Far_Fields"], ["Flexile Spines", "https://hollowknight.wiki/w/Flexile_Spines"], ["Fourth Chorus", "https://hollowknight.wiki/w/Fourth_Chorus"], ["Greymoor", "https://hollowknight.wiki/w/Greymoor"], ["Route reference", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "The Seamstress and the updrafts",
      location: "Far Fields",
      rows: [
        ["wish-flexile-spines", ["quest"], "Collect 25 Spine Cores for the Seamstress", "Enter the Seamstress's home in the Far Fields and accept her Wish. To the east, bait Hokers into shooting spines. Hit the loose spines and pick up the cores. Leave and re-enter the area if you need more."],
        ["mobility-drifters-cloak", ["mobility"], "Collect the Drifter's Cloak", "Return the cores and let the Seamstress finish the cloak. Hold the jump input after a jump to slow your fall and catch the Far Fields' thermal currents."],
        ["boss-fourth-chorus", ["boss"], "Defeat Fourth Chorus", "At the updraft arena, strike the body after dodging its arm or ground attacks. Ride the rising air into the sides of the room once the arena opens upward. Break the restraints on the stone above to finish the fight."],
        ["route-greymoor-enter", ["route"], "Follow the updraft route into Greymoor", "Use the new cloak across the upper Far Fields. Open the trapdoor shortcut where the paths reconnect. Look for Shakra and the Bellway in Greymoor before going west through the moor."],
        ["wish-garmond-greymoor", ["quest"], "Talk to Garmond and Zaza before entering the Citadel", "Speak when you meet the pair along the Greymoor road. If you encounter Moorwing first, look for them above Moorwing's arena. You can also speak to them on Sinner's Road later. A conversation outside the Citadel opens their duel later.", {"reference": "https://hollowknight.wiki/w/Garmond_and_Zaza"}],
      ],
    },
    {
      title: "The moor, the caravan, and the road west",
      location: "Greymoor",
      rows: [
        ["boss-moorwing", ["boss"], "Defeat Moorwing before moving the Flea Caravan", "Find the arena on the western Greymoor route. Keep some distance from the swoops and watch the returning blades before closing. If the caravan already occupies this arena, fight Moorwing later by the Greymoor Bellway in Act 2."],
        ["wish-fleas-greymoor", ["quest"], "Move the Flea Caravan to Greymoor", "After rescuing five fleas, return to Mooshka in the Marrow and agree to travel. Talk to Grishkin after arriving to get Flea Brew. The number rescued is cumulative across caravan moves."],
        ["wish-bugs-of-pharloom", ["quest"], "Start Nuu's Bugs of Pharloom wish", "Find Nuu at Halfway Home, accept the Wish, and take the Hunter's Journal. Fight different enemies throughout the route. Return when you have 100 unique Journal entries for the Tool Pouch reward."],
        ["route-greymoor-shrine", ["bellshrine"], "Ring the Greymoor Bellshrine", "Find the large bell on the Greymoor route, strike its floor lever, and rest. Explore Craw Lake and the Chapel of the Reaper before following the road toward Bellhart."],
        ["skill-thread-storm", ["skill"], "Learn Thread Storm above Craw Lake", "Climb the upper Greymoor route beyond the Craw Lake platforms. Reach the Weaver Burial Spire and Bind to learn the skill.", {"reference": "https://hollowknight.wiki/w/Thread_Storm"}],
      ],
    },
    {
      title: "Greymoor and Pilgrim's Rest side paths",
      location: "Far Fields · Greymoor",
      compact: true,
      rows: [
        ["pouch-mort", ["pouch"], "Buy Mort's Tool Pouch", "Pay 220 Rosaries at Pilgrim's Rest in the Far Fields. If you miss Mort before Act 3, buy it from Grindle in Blasted Steps."],
        ["crest-reaper", ["crest"], "Bind the Reaper Crest in Greymoor", "Find the Chapel of the Reaper off the Greymoor road. Clear the chapel gauntlet and Bind at the crest shrine."],
      ],
    },
    {
      title: "Collectibles and unlocks · Greymoor",
      location: "Greymoor",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-threefold-pin", ["tool"], "Threefold Pin", "At Craw Lake, walk through the false wall at the right end of the room. Open the hidden pickup beyond.", {"reference": "https://hollowknight.wiki/w/Threefold_Pin", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478058"]}],
        ["tool-flea-brew", ["tool"], "Flea Brew", "Rescue five fleas and move the Caravan from the Marrow to Greymoor. Talk to Grishkin in the new camp for the tool.", {"reference": "https://hollowknight.wiki/w/Flea_Brew", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478025"]}],
        ["flea-greymoor", ["flea"], "Lost Flea above Craw Lake", "Climb the platforms northeast of Craw Lake and listen for the flea above the water route.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478145"]}],
        ["flea-greymoor-2", ["flea"], "Lost Flea inside the Greymoor tower", "Climb over the top of the tower and enter its upper opening. Look inside for the call and the cage.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478287"]}],
        ["memory-locket-greymoor", ["memory-locket"], "Memory Locket · Greymoor", "Find the ledge directly above the Mitemother and climb to its pickup.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478035"]}],
        ["relic-bone-scroll-greymoor", ["relic"], "Bone Scroll · Greymoor", "Enter the mapped concealed room and swim right to the end. Search the body in the hidden recess for the Bone Scroll.", {"reference": "https://hollowknight.wiki/w/Items_(Silksong)#Tradables", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478142"]}],
        ["map-greymoor", ["map"], "Get the Greymoor map", "Follow Shakra's rings through Greymoor until you reach her map post. The map costs 70 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
        ["bellway-greymoor", ["bellway"], "Open Greymoor Bellway", "Find the station mechanism and pay 60 Rosaries to unlock this stop.", {"reference": "https://hollowknight.wiki/w/Bellway#Bellways", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478037"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Far Fields",
      location: "Far Fields",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-weighted-belt", ["tool"], "Weighted Belt", "Buy it from Mort at Pilgrim's Rest for 160 Rosaries. If you reach Act 3 first, search the nearby Mort location for the dropped belt.", {"reference": "https://hollowknight.wiki/w/Weighted_Belt", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477946"]}],
        ["mask-shard-3", ["mask-shard"], "Mask Shard · Far Fields", "Check the hidden left-side route near the Seamstress's home. Use her Drifter's Cloak to stay over the hazards along the way.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477975"]}],
        ["flea-far-fields", ["flea"], "Lost Flea beside the Far Fields trap", "Explore the lower trap corridor near the marked side room. Jump the pressure plate on your way to the cage.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477940"]}],
        ["memory-locket-far-fields", ["memory-locket"], "Memory Locket · Far Fields", "Buy the locket in Pilgrim's Rest from Mort for 150 Rosaries. Grindle sells the unsold stock for 250 Rosaries after the act changes.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477953"]}],
        ["relic-bone-scroll-far-fields", ["relic"], "Bone Scroll · Far Fields", "Use Drifter's Cloak to cross into the marked hidden room and pick up the Bone Scroll.", {"reference": "https://hollowknight.wiki/w/Items_(Silksong)#Tradables", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478213"]}],
        ["map-far-fields", ["map"], "Get the Far Fields map", "Find Shakra along the Far Fields traversal route and buy the local map. The map costs 50 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
        ["bellway-far-fields", ["bellway"], "Open Far Fields Bellway", "Find the station mechanism and pay 40 Rosaries to unlock this stop.", {"reference": "https://hollowknight.wiki/w/Bellway#Bellways", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477933"]}],
      ],
    },
  ],
} satisfies RawChapter;
