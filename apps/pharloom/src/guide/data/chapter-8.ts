import type { RawChapter } from "@hundo/core/types";

export default {
  id: 8,
  title: "The Slab and the Frozen Ascent",
  region: "The Slab · Mount Fay · High Halls · Memorium · Wisp Thicket · revisits",
  teaser: "Mount Fay",
  intro: "Cross the Slab's front hall to Mount Fay and climb it for the Faydown Cloak. With it, head for the High Halls and the Conductors' song, the last of the three, and the Rosary Bank. The double jump also opens the Memorium, where the last Cogheart piece wakes the Second Sentinel, then sends you back through Greymoor, Sinner's Road, the Blasted Steps, the Wormways and the Deep Docks for what was out of reach.",
  sources: [["The Slab's front door and its Bellway", "https://hollowknight.wiki/w/The_Slab"], ["Mount Fay: access, cold and heat sources", "https://hollowknight.wiki/w/Mount_Fay"], ["Faydown Cloak", "https://hollowknight.wiki/w/Faydown_Cloak"], ["High Halls, the Forum and the Rosary Bank", "https://hollowknight.wiki/w/High_Halls"], ["Simple Keys and their four locks", "https://hollowknight.wiki/w/Simple_Key_(Silksong)"], ["Memorium access and layout", "https://hollowknight.wiki/w/Memorium"], ["Second Sentinel and Final Audience", "https://hollowknight.wiki/w/Second_Sentinel"], ["Wisp Thicket access", "https://hollowknight.wiki/w/Wisp_Thicket"], ["Grindle's Blasted Steps shop", "https://hollowknight.wiki/w/Grindle"], ["Bellway and Ventrica tolls", "https://hollowknight.wiki/w/Fast_Travel_(Silksong)"], ["Memorium after Mount Fay (Nintendo Life)", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "The prison road and Mount Fay",
      location: "The Slab · Mount Fay",
      sources: [["The Slab's front door", "https://hollowknight.wiki/w/The_Slab"], ["Mount Fay's cold, heat sources and helpful tools", "https://hollowknight.wiki/w/Mount_Fay"], ["Faydown Cloak at the summit", "https://hollowknight.wiki/w/Faydown_Cloak"], ["Shakra's Mount Fay camp", "https://hollowknight.wiki/w/Shakra"]],
      rows: [
        ["route-slab", ["route"], "Reach The Slab by the Citadel bridge", "Cross the bridge one floor above the Citadel Spa bench into the Slab and open its Bellway. Coming in by this front door you get only a straight path down to the station, a bench beside it and the way on to Mount Fay; the door into the rest of the prison stays locked for now. If a Wardenfly carried you here earlier, you've already walked out this way.", {"reference": "https://hollowknight.wiki/w/The_Slab"}],
        ["route-fay-climb", ["route"], "Climb Mount Fay from the Slab Bellway", "The mountain starts west of the Slab's Bellway, and you need Clawline and the Drifter's Cloak for it. Away from a heat source you frost over in about 15 seconds, then lose a mask every couple of seconds, so hop from fire to fire. Don't strike the heat sources: some break and can leave a stretch impassable. The water is icy and hurts at once. Shakra's camp on the way up has a bench. Weavelight, Ascendant's Grip and the Plasmium Phial all make the climb easier.", {"reference": "https://hollowknight.wiki/w/Mount_Fay"}],
        ["mobility-faydown-cloak", ["mobility"], "Play the Needolin at the tuning fork to receive the Faydown Cloak", "At the summit, stand by the tuning fork and play the Needolin until a Fayforn comes down and lines your cloak with her down. You can now jump once more in mid-air, refreshed when you land, cling to a wall, bounce off something, catch a Clawline hoop or ride an updraft. The mountain's cold no longer hurts you, though icy water still does.", {"reference": "https://hollowknight.wiki/w/Faydown_Cloak"}],
      ],
    },
    {
      title: "The High Halls and the Conductor's Melody",
      location: "High Halls",
      sources: [["Forum gauntlet, Conductor Ballador and the Rosary Bank", "https://hollowknight.wiki/w/High_Halls"], ["Simple Keys and their four locks", "https://hollowknight.wiki/w/Simple_Key_(Silksong)"]],
      rows: [
        ["route-conductors-melody", ["route"], "Win the Forum gauntlet and learn the Conductor's Melody", "The High Halls sit above the upper-left Choral Chambers, and you'll want Clawline and the double jump to get in and around. On their east side, facing the Ventrica, the Forum holds an eleven-wave gauntlet; Garmond and Zaza join you if you won their duel. When the chandelier crashes down at the end, go through to the next room and talk to Conductor Ballador, who sings you the melody.", {"reference": "https://hollowknight.wiki/w/High_Halls"}],
        ["route-rosary-storage", ["pickup"], "Open the High Halls Rosary Bank with a Simple Key", "The bank beside the Forum, west of the Ventrica, takes a Simple Key: Pharloom has four keys for its four locks. Inside, look for dust falling from a breakable ceiling and climb that vent past its fans to the vault: 560 Rosaries all told, lying loose and in three chests, one of them holding a Pale Rosary Necklace. Clear it in one visit: once it's open, saving anywhere beyond the High Halls, Choral Chambers and Cogwork Core sends a Snitchfly in to take whatever you left.", {"reference": "https://hollowknight.wiki/w/High_Halls"}],
      ],
    },
    {
      title: "The Memorium and the Second Sentinel",
      location: "Memorium · Cogwork Core · High Halls",
      sources: [["Memorium access", "https://hollowknight.wiki/w/Memorium"], ["Memorium Cogheart piece", "https://hollowknight.wiki/w/Cogheart"], ["Where the Sentinel roams and when the Wish appears", "https://hollowknight.wiki/w/Second_Sentinel"], ["Final Audience prerequisites and pins", "https://hollowknight.wiki/w/Final_Audience"], ["Reserve Bind", "https://hollowknight.wiki/w/Reserve_Bind"]],
      rows: [
        ["route-memorium", ["route"], "Open the Memorium and its Ventrica station", "The Memorium opens off the long Choral Chambers hallway between Songclave and the Cogwork Core, and only with the double jump. Its floors are recreated habitats from across Pharloom, each stocked with that region's creatures. Pay 80 Rosaries at its Ventrica so you can come and go.", {"reference": "https://hollowknight.wiki/w/Memorium"}],
        ["pickup-cogheart-memorium", ["pickup"], "Get the Cogheart Piece in Memorium", "The last bell puzzle is in the eastern Memorium, in the room above the map room. These bells count from top to bottom: strike 7–2–4–6, then 4–2–1–4–3, then 1–5–6–2–7–3.", {"reference": "https://hollowknight.wiki/w/Cogheart"}],
        ["wish-final-audience", ["wish"], "Repair Second Sentinel and accept Final Audience", "With all three pieces you hold the Cogheart: fit it into the dormant Sentinel in the Cogwork Core. It then roams the Citadel fighting enemies, in the hallway east of the Dancers' arena, the long Choral Chambers hallway under the Core and the room west of the Spa (once its gauntlet is won). Meet it twice, resting at a bench in between. With the Conductor's Melody learnt and two Songclave Wishes done, Building Up Songclave among them, Final Audience appears on Songclave's Wishwall.", {"reference": "https://hollowknight.wiki/w/Second_Sentinel"}],
        ["boss-second-sentinel", ["boss"], "Defeat Second Sentinel in High Halls", "Accept Final Audience, then follow the Sentinel's pins through the Choral Chambers to a small room newly opened in the High Halls. Up close it braces and answers a blocked hit with a long flurry, so strike as its combos end, not into its guard. Watch for the charged X-shaped slash and the wind blade it fires along the ground or diagonally down from the air.", {"reference": "https://hollowknight.wiki/w/Final_Audience"}],
        ["tool-reserve-bind", ["tool"], "Reserve Bind", "The Sentinel gives it to you after the duel: one Bind that costs no Silk, refilled whenever you rest at a bench.", {"reference": "https://hollowknight.wiki/w/Reserve_Bind", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479254"]}],
      ],
    },
    {
      title: "Where the double jump reaches",
      location: "Greymoor · Wisp Thicket · Sinner's Road",
      sources: [["Wisp Thicket access, bench and Bone Scroll", "https://hollowknight.wiki/w/Wisp_Thicket"], ["Father of the Flame", "https://hollowknight.wiki/w/Father_of_the_Flame"], ["Lugoli's kitchen and the Pickled Muckmaggot", "https://hollowknight.wiki/w/Disgraced_Chef_Lugoli"]],
      rows: [
        ["route-wisp-thicket", ["route"], "Open Wisp Thicket above Greymoor", "From the tower beside Greymoor's Halfway Home, take the north exit and bounce along the balloons to the north-west, where a hidden passage in a room's ceiling leads up into Wisp Thicket. Before the double jump an invisible wall bars the way. The thicket's only bench hangs in a sack: strike it free.", {"reference": "https://hollowknight.wiki/w/Wisp_Thicket"}],
        ["boss-father-of-the-flame", ["boss"], "Defeat Father of the Flame", "Inside the huge empty bell at the thicket's west end, only the four lanterns on the totem's arms take damage, and they hang high: bounce off the hanging pouches with downward strikes to reach them, leaving the lower two for last since they help you reach the upper ones. With the arms gone the core opens and sprays fireballs; break it, then get clear of its final blast. Hits here give no Silk, so a Reserve Bind helps.", {"reference": "https://hollowknight.wiki/w/Father_of_the_Flame"}],
        ["boss-lugoli", ["boss"], "Defeat Disgraced Chef Lugoli", "Lugoli's kitchen in Sinner's Road can only be reached with the double jump. Ring the gong to start, kill the two Roachservers it calls, and dodge the chef's slams, leaps and ladle swings, plus the arcing muck globs that infest you like Muckmaggot water. From half health it also dives into the muck below. It drops the Pickled Muckmaggot: keep it.", {"reference": "https://hollowknight.wiki/w/Disgraced_Chef_Lugoli"}],
      ],
    },
    {
      title: "The long return circuit",
      location: "Blasted Steps · Wormways · Deep Docks",
      sources: [["Grindle's hideout and stock", "https://hollowknight.wiki/w/Grindle"], ["Weavenest Karn", "https://hollowknight.wiki/w/Wormways"], ["Sharpdart", "https://hollowknight.wiki/w/Sharpdart"], ["Forebrothers and their arena", "https://hollowknight.wiki/w/Forebrothers_Signis_%26_Gron"], ["Lower Deep Docks access", "https://hollowknight.wiki/w/Deep_Docks"], ["Simple Key locks", "https://hollowknight.wiki/w/Simple_Key_(Silksong)"]],
      rows: [
        ["kit-grindle", ["kit"], "Buy Grindle's Crafting Kit", "Grindle's hideout in the Blasted Steps can only be reached with the double jump. He sells his Kit for 700 Rosaries.", {"reference": "https://hollowknight.wiki/w/Grindle"}],
        ["skill-sharpdart", ["skill"], "Learn Sharpdart in Weavenest Karn", "At the far west of the Wormways, Clawline up to the high ledge with the Weaver door and play the Needolin to open Weavenest Karn. Cross its platforming to the Weaver Burial Spire at the end and Bind there for Sharpdart, a Silk Skill that dashes you through enemies.", {"reference": "https://hollowknight.wiki/w/Sharpdart"}],
        ["boss-forebrothers", ["boss"], "Defeat Forebrothers Signis and Gron", "In the southern Deep Docks, hang from the Clawline hook to open the locked door, then cross the lower Docks while Gron throws spears at you from the platforms. In the arena Signis fights first and calls in workers at set points: kill them quickly. Gron drops in later. Focus on one brother, since the survivor heals when the other falls, keep away from the lava walls at the edges, and hit them from the side: their helmets shrug off blows from above.", {"reference": "https://hollowknight.wiki/w/Forebrothers_Signis_%26_Gron"}],
        ["tool-flintslate", ["tool"], "Flintslate", "West of the Docks' lowest way in from the Far Fields, climb a tall room of hanging platforms; the Flintslate lies on a workbench in the little room at its top. It's in the lower Docks, through the Clawline gate on the Far Fields side.", {"reference": "https://hollowknight.wiki/w/Flintslate", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477986"]}],
        ["route-docks-keydoor", ["route"], "Open the lower Deep Docks lock if you want the shortcut", "The chained door south of Forge Daughter takes a Simple Key and opens onto the lower Docks, but the Far Fields side opens with Clawline, so this is the one lock you can skip. Pharloom has four keys for its four locks: spend one here only if it's spare.", {"reference": "https://hollowknight.wiki/w/Simple_Key_(Silksong)"}],
      ],
    },
    {
      title: "Collectibles and unlocks · The Slab",
      location: "The Slab",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["bellway-the-slab", ["bellway"], "Open The Slab Bellway", "Pay 40 Rosaries at the station's toll machine to open this stop.", {"reference": "https://hollowknight.wiki/w/Fast_Travel_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478390"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Mount Fay",
      location: "Mount Fay",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-memory-crystal", ["tool"], "Memory Crystal", "Break the wall right of Mount Fay's lower bench and follow the icy tunnel behind it, smashing through ice chunks that grow back every few seconds. Strike the crystal at the end for the tool.", {"reference": "https://hollowknight.wiki/w/Memory_Crystal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478947"]}],
        ["mask-shard-13", ["mask-shard"], "Mask Shard · Mount Fay", "In the mountain's south-west, west of the bench there. Double jump needed.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479038"]}],
        ["flea-mount-fay", ["flea"], "Lost Flea on Mount Fay", "This flea is frozen into a block of ice: strike it free with your needle. Cling Grip gets you to it.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478380"]}],
        ["map-mount-fay", ["map"], "Get the Mount Fay map", "Buy it for 40 Rosaries from Shakra at her camp on the climb. The camp packs up once you have the Faydown Cloak, but she sells the map later too.", {"reference": "https://hollowknight.wiki/w/Shakra"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Memorium",
      location: "Memorium",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-voltvessels", ["tool"], "Voltvessels", "Two Memoriae guard it in a hidden room at the Memorium's top right. Smash the breakable wall to get in, beat both and take the tool.", {"reference": "https://hollowknight.wiki/w/Voltvessels", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479121"]}],
        ["memory-locket-memorium", ["memory-locket"], "Memory Locket · Memorium", "In the left of the central rooms, the one made up like Shellwood.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479110"]}],
        ["mossberry-7", ["mossberry"], "Mossberry · Memorium", "In the room east of the Memorium bench.", {"reference": "https://hollowknight.wiki/w/Mossberry", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479108"]}],
        ["map-memorium", ["map"], "Get the Memorium map", "Use the machine in the Memorium's map room, below the bell puzzle. The map costs 70 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
        ["ventrica-memorium", ["ventrica"], "Open Memorium Ventrica", "Pay 80 Rosaries at the station's toll machine to open this stop.", {"reference": "https://hollowknight.wiki/w/Fast_Travel_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478425"]}],
        ["spool-fragment-16", ["spool-fragment"], "Spool Fragment · western Memorium", "From the floor just below the Ventrica, head west and work round the spikes into the side chamber. Afterwards, break the vines to the south for a short way back to the entrance. Clawline and the double jump needed.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479117"]}],
        ["flea-memorium-giant-flea", ["flea"], "Free and subdue the Huge Flea in the Memorium", "In the Memorium's aviary of Craw cages, one is far too small for the Huge Flea inside. Break it open and the flea turns on you, charging straight across the room until it hits a wall. Wear it down (it isn't killed) and it flies off to join the other fleas. It counts as one of the 30.", {"reference": "https://hollowknight.wiki/w/Huge_Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478413"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · High Halls",
      location: "High Halls",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-cogfly", ["tool"], "Cogfly", "In the Cogfly workshop in the High Halls, use the crafting bench: it takes one Craftmetal.", {"reference": "https://hollowknight.wiki/w/Cogfly", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478903"]}],
        ["tool-rosary-cannon", ["tool"], "Rosary Cannon", "Inside the Rosary Bank, break the west wall short of the vault door and hit the stringing machine's mechanism behind it. It falls apart into the cannon, and the machine stops working for good.", {"reference": "https://hollowknight.wiki/w/Rosary_Cannon", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478937"]}],
        ["relic-psalm-cylinder-high-halls", ["relic"], "Psalm Cylinder · High Halls", "North-west of the Ventrica, thread the maze of pipes to the cylinder.", {"reference": "https://hollowknight.wiki/w/Psalm_Cylinder", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478908"]}],
        ["map-high-halls", ["map"], "Get the High Halls map", "Use the map machine in the High Halls. The map costs 70 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
        ["ventrica-high-halls", ["ventrica"], "Open High Halls Ventrica", "Pay 80 Rosaries at the station's toll machine to open this stop.", {"reference": "https://hollowknight.wiki/w/Fast_Travel_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478445"]}],
        ["spool-fragment-15", ["spool-fragment"], "Spool Fragment · High Halls", "Climb the High Halls' western vertical room to its highest point. Clawline and the double jump needed.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478909"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Wisp Thicket",
      location: "Wisp Thicket",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-wispfire-lantern", ["tool"], "Wispfire Lantern", "Pick it out of the wrecked core once Father of the Flame falls.", {"reference": "https://hollowknight.wiki/w/Wispfire_Lantern", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479156"]}],
        ["mask-shard-14", ["mask-shard"], "Mask Shard · Wisp Thicket", "In the eastern thicket. Double jump needed.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479151"]}],
        ["craftmetal-7", ["craftmetal"], "Craftmetal · Wisp Thicket", "Behind a breakable ceiling in the thicket. Double jump needed.", {"reference": "https://hollowknight.wiki/w/Craftmetal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479157"]}],
        ["relic-bone-scroll-wisp-thicket", ["relic"], "Bone Scroll · Wisp Thicket", "Climb to the top of the tall room east of the thicket's bench.", {"reference": "https://hollowknight.wiki/w/Bone_Scroll", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479150"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Underworks from Wisp Thicket",
      location: "Underworks from Wisp Thicket",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["flea-underworks", ["flea"], "Lost Flea in the Underworks, from Wisp Thicket", "Off the route to Father of the Flame, a hidden path behind a breakable ceiling leads into a corner of the Underworks you can't reach from inside. A short platforming stretch, with Cling Grip and the double jump, ends at the flea.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478419"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Greymoor",
      location: "Greymoor",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memory-locket-greymoor-2", ["memory-locket"], "Memory Locket · Greymoor (#2)", "Inside the Halfway Home, double-jump up to the locket above the left-hand door.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478039"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Blasted Steps",
      location: "Blasted Steps",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-snitch-pick", ["tool"], "Snitch Pick", "Grindle sells it for 740 Rosaries once you have Clawline.", {"reference": "https://hollowknight.wiki/w/Grindle", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479201"]}],
        ["tool-thiefs-mark", ["tool"], "Thief's Mark", "Grindle sells it for 350 Rosaries.", {"reference": "https://hollowknight.wiki/w/Grindle", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478525"]}],
        ["mask-shard-16", ["mask-shard"], "Mask Shard · Blasted Steps revisit", "In the western Blasted Steps. Clawline and the double jump needed.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478498"]}],
        ["spool-fragment-17", ["spool-fragment"], "Spool Fragment · Blasted Steps", "Grindle sells it for 680 Rosaries.", {"reference": "https://hollowknight.wiki/w/Grindle", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478527"]}],
        ["relic-psalm-cylinder-blasted-steps", ["relic"], "Psalm Cylinder · Blasted Steps", "Grindle sells one for 240 Rosaries.", {"reference": "https://hollowknight.wiki/w/Psalm_Cylinder", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478530"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Far Fields",
      location: "Far Fields",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["mask-shard-11", ["mask-shard"], "Mask Shard · Far Fields revisit", "Clawline up the hooks to Skull Cave in the eastern Far Fields. The entrance caves in behind you: work down past spikes and exploding rocks, win the gauntlet on two sinking rocks over lava, then climb out ahead of the rising lava. An updraft by the way out lifts you to the shard's chamber.", {"reference": "https://hollowknight.wiki/w/Far_Fields", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478841"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Deep Docks",
      location: "Deep Docks",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["spool-fragment-14", ["spool-fragment"], "Spool Fragment · Deep Docks revisit", "In the south-east Docks, Clawline open the locked gate in the corner, open the hatch and drop into the cavern. Clawline to the far wall, blast the rock open and get through the hazards past it, spikes and lava among them, to the fragment at the end. Cling Grip needed, and the double jump helps.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478825"]}],
        ["flea-deep-docks-2", ["flea"], "Lost Flea beyond the lower Docks gauntlet", "In the lower Docks, behind the door Clawline opens, win the enemy gauntlet guarding this flea.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478437"]}],
        ["memory-locket-deep-docks", ["memory-locket"], "Memory Locket · Deep Docks", "Once the Forebrothers are beaten, the way past their arena opens: the locket is west of the big bell there.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478836"]}],
      ],
    },
  ],
} satisfies RawChapter;
