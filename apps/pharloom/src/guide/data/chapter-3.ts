import type { RawChapter } from "@hundo/core/types";

export default {
  id: 3,
  title: "Across the Far Fields and Greymoor",
  region: "Far Fields · Greymoor · Halfway Home",
  teaser: "Greymoor",
  intro: "Earn the Seamstress's cloak, ride the Far Fields updrafts up into Greymoor, and cross the rain-soaked moor.",
  sources: [["Wiki · Far Fields, Pilgrim's Rest and the way up to Greymoor", "https://hollowknight.wiki/w/Far_Fields"], ["Wiki · Greymoor, Halfway Home, Craw Lake and the Chapel of the Reaper", "https://hollowknight.wiki/w/Greymoor"], ["Wiki · Flexile Spines and the Drifter's Cloak", "https://hollowknight.wiki/w/Flexile_Spines"], ["Wiki · Fourth Chorus and its optional finisher", "https://hollowknight.wiki/w/Fourth_Chorus"], ["Wiki · Moorwing, and where it waits if the Caravan skips it", "https://hollowknight.wiki/w/Moorwing"], ["Wiki · Mort's shop and prices", "https://hollowknight.wiki/w/Mort"], ["Nintendo Life · the order of the areas", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "The Seamstress and the updrafts",
      location: "Far Fields",
      sources: [["Wiki · Flexile Spines, the Seamstress's Wish", "https://hollowknight.wiki/w/Flexile_Spines"], ["Wiki · Spine Cores, how Hokers drop them and the cap of 25", "https://hollowknight.wiki/w/Spine_Core"], ["Wiki · Drifter's Cloak", "https://hollowknight.wiki/w/Drifter's_Cloak"], ["Wiki · Fourth Chorus's attacks, the ceiling explosives and the open arena", "https://hollowknight.wiki/w/Fourth_Chorus"], ["Wiki · Far Fields, the updraft out after Fourth Chorus", "https://hollowknight.wiki/w/Far_Fields"], ["Wiki · Greymoor's entrance and Halfway Home's doors", "https://hollowknight.wiki/w/Greymoor"], ["Wiki · Garmond and Zaza, where they're first met and where they move", "https://hollowknight.wiki/w/Garmond_and_Zaza"]],
      rows: [
        ["wish-flexile-spines", ["wish"], "Collect 25 Spine Cores for the Seamstress", "The Seamstress lives in the eastern Far Fields: visit her and take her Wish. In the caves beyond her home, hit a Hoker to make it fire its spines, then strike the spines before they vanish. Each one you break gives a Spine Core, and you can carry 25, which is all she asks for.", {"reference": "https://hollowknight.wiki/w/Spine_Core"}],
        ["mobility-drifters-cloak", ["mobility"], "Collect the Drifter's Cloak", "Bring the cores back and the Seamstress sews them into your cloak. Hold jump in mid-air to glide down slowly. Glide into a rising current and it lifts you, which is how you leave the Far Fields.", {"reference": "https://hollowknight.wiki/w/Drifter's_Cloak"}],
        ["boss-fourth-chorus", ["boss"], "Defeat Fourth Chorus", "Go back to the lava arena where the giant automaton lay buried: now that you have the cloak, it wakes. Only its head takes damage. A glowing hand warns you what's coming: a lower arm sweeps the whole floor, or an upper arm slams down and sinks platforms into the lava for a while. Later it pounds the ceiling to rain molten rocks. Near the end it breaks the outer platforms into updrafts: ride them up and hit both explosives in the ceiling to drop a boulder on its head, or simply keep hitting the head. The fight doesn't lock you in.", {"reference": "https://hollowknight.wiki/w/Fourth_Chorus"}],
        ["route-greymoor-enter", ["route"], "Follow the updraft route into Greymoor", "Past the automaton's arena, glide into the rising wind and ride it out of the Far Fields up to Greymoor. Halfway Home, the tavern in the middle of the moor, has a bench inside: you first get in by its west door, and a pressure plate inside opens the east door for good.", {"reference": "https://hollowknight.wiki/w/Greymoor"}],
        ["wish-garmond-greymoor", ["route"], "Talk to Garmond and Zaza in Greymoor", "Garmond, an old knight, and his companion Zaza first stand on a small outcrop up and to the left of the Greymoor Bellway station. Talk to them whenever you meet them: a word with Garmond matters for a later meeting. Once you've glimpsed Moorwing, speak to Garmond again (or enter its arena) and they move above the arena and offer to fight it with you.", {"reference": "https://hollowknight.wiki/w/Garmond_and_Zaza"}],
      ],
    },
    {
      title: "The moor, the caravan, and the road west",
      location: "Greymoor",
      sources: [["Wiki · Moorwing's arena, attacks, allies and the skipped fight", "https://hollowknight.wiki/w/Moorwing"], ["Wiki · The Lost Fleas, the Caravan's move to Greymoor", "https://hollowknight.wiki/w/The_Lost_Fleas"], ["Wiki · Flea Caravan, cumulative flea counts", "https://hollowknight.wiki/w/Flea_Caravan"], ["Wiki · Bugs of Pharloom, Nuu's Wish", "https://hollowknight.wiki/w/Bugs_of_Pharloom"], ["Wiki · Bellshrines and how they ring", "https://hollowknight.wiki/w/Bench_(Silksong)#Bellshrines"], ["Wiki · Thread Storm, the Craw Lake gauntlet and the balloons", "https://hollowknight.wiki/w/Thread_Storm"], ["Wiki · Shakra's shop, the Greymoor map's conditions", "https://hollowknight.wiki/w/Shakra"]],
      rows: [
        ["boss-moorwing", ["boss"], "Defeat Moorwing before moving the Flea Caravan", "Three rooms west of the Bellway, you first spot the winged beast circling far off behind the scenery. It waits in an arena where the road leaves Greymoor to the west, barring the town beyond; if you've spoken to Garmond and Zaza, accept their help on the way. It swoops low across the floor until it has passed you and throws spinning blades that roll along the ground before rising. From about two-thirds health it also flips over to send blades in from both sides. If the Flea Caravan already sits in this arena, or you entered the town from its far side, the fight is skipped for now and Moorwing waits for you later outside the Greymoor Bellway.", {"reference": "https://hollowknight.wiki/w/Moorwing"}],
        ["wish-fleas-greymoor", ["wish"], "Move the Flea Caravan to Greymoor", "Once you've freed five fleas, go back to Fleamaster Mooshka's Caravan in the Marrow and agree to ride with it to Greymoor; if you decline, the fleas set off without you. In the new camp, Grishkin gives you the Flea Brew. Fleas you free later keep adding to the same count.", {"reference": "https://hollowknight.wiki/w/The_Lost_Fleas"}],
        ["wish-bugs-of-pharloom", ["wish"], "Start Nuu's Bugs of Pharloom wish", "Nuu has a room in Halfway Home. Take her Wish and she hands you the Hunter's Journal. Defeat 100 different kinds of enemy to fill it in, one kill of each being enough, then come back to her for a Tool Pouch upgrade.", {"reference": "https://hollowknight.wiki/w/Bugs_of_Pharloom"}],
        ["route-greymoor-shrine", ["bellshrine"], "Ring the Greymoor Bellshrine", "Find Greymoor's great bell and hit the lever on the floor: the bell swings and rings, and a bench opens beside it for good. Ringing it also puts the Greymoor map in Shakra's stock if you haven't met her here yet. Craw Lake lies in the east of the moor, the Chapel of the Reaper in the west.", {"reference": "https://hollowknight.wiki/w/Bench_(Silksong)#Bellshrines"}],
        ["skill-thread-storm", ["skill"], "Learn Thread Storm above Craw Lake", "In the ruined building out on Craw Lake, fight off the Craws, Tallcraws and Squatcraws. A lever appears once they're dead: hit it to send balloons up around the lake, then bounce off them to the Weaver Burial Spire in the room above the water. Bind there for the skill.", {"reference": "https://hollowknight.wiki/w/Thread_Storm"}],
      ],
    },
    {
      title: "Greymoor and Pilgrim's Rest side paths",
      location: "Far Fields · Greymoor",
      compact: true,
      sources: [["Wiki · Mort, his door toll and the Tool Pouch", "https://hollowknight.wiki/w/Mort"], ["Wiki · Reaper Crest, the chapel above Moorwing's arena", "https://hollowknight.wiki/w/Reaper_Crest"], ["Wiki · Chapel of the Reaper's entrance and gauntlet", "https://hollowknight.wiki/w/Greymoor"]],
      rows: [
        ["pouch-mort", ["pouch"], "Buy Mort's Tool Pouch", "Mort keeps shop in Pilgrim's Rest in the Far Fields. His door takes 30 Rosaries each time you go in, which also gets you the bench inside; hit the cog on the inside of the open door to break the lock for good. The Tool Pouch upgrade costs 220 Rosaries.", {"reference": "https://hollowknight.wiki/w/Mort"}],
        ["crest-reaper", ["crest"], "Bind the Reaper Crest in Greymoor", "The Chapel of the Reaper is in western Greymoor, right above Moorwing's arena; its door is to the left of the big windmill where Silk Snippers stand guard. Get through the platforming and the gauntlet at the end, then Bind the corpse at the top for the crest. Once you leave with it, the chapel shuts for good.", {"reference": "https://hollowknight.wiki/w/Reaper_Crest"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Greymoor",
      location: "Greymoor",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      sources: [["Wiki · Threefold Pin", "https://hollowknight.wiki/w/Threefold_Pin"], ["Nintendo Life · Threefold Pin past the balloons, behind a big Craw", "https://www.nintendolife.com/guides/hollow-knight-silksong-all-tools-list-and-locations"], ["Wiki · Flea Brew and its refills", "https://hollowknight.wiki/w/Flea_Brew"], ["Wiki · Lost Flea locations", "https://hollowknight.wiki/w/Flea"], ["Wiki · Memory Locket locations", "https://hollowknight.wiki/w/Memory_Locket"], ["Wiki · Bone Scroll locations", "https://hollowknight.wiki/w/Bone_Scroll"], ["Wiki · Shakra's camp and map stock", "https://hollowknight.wiki/w/Shakra"], ["Wiki · Bellway tolls", "https://hollowknight.wiki/w/Fast_Travel_(Silksong)"]],
      rows: [
        ["tool-threefold-pin", ["tool"], "Threefold Pin", "After the Craw Lake gauntlet, use the balloons and ledges to reach the top right of the lake room, on Greymoor's eastern edge. A hidden cave there, behind a large Craw, holds the pin.", {"reference": "https://hollowknight.wiki/w/Threefold_Pin", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478058"]}],
        ["tool-flea-brew", ["tool"], "Flea Brew", "Move the Caravan from the Marrow to Greymoor after freeing five fleas, then talk to Grishkin in the new camp. Refills at the Caravan cost 30 Rosaries.", {"reference": "https://hollowknight.wiki/w/Flea_Brew", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478025"]}],
        ["flea-greymoor", ["flea"], "Lost Flea by Craw Lake", "Once the gauntlet's lever has raised the balloons, bounce across them and keep to the right-hand wall. The flea is to the right of the lake.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478145"]}],
        ["memory-locket-greymoor", ["memory-locket"], "Memory Locket · Greymoor", "It lies west of the Greymoor Bellway.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478035"]}],
        ["relic-bone-scroll-greymoor", ["relic"], "Bone Scroll · Greymoor", "It lies east of Halfway Home.", {"reference": "https://hollowknight.wiki/w/Bone_Scroll", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478142"]}],
        ["map-greymoor", ["map"], "Get the Greymoor map", "Shakra pitches camp where Craw Lake begins, with a bench she packs up once you clear the lake's gauntlet. Her Greymoor map costs 70 Rosaries; if you miss her here, she sells it at her Bone Bottom ledge.", {"reference": "https://hollowknight.wiki/w/Shakra"}],
        ["bellway-greymoor", ["bellway"], "Open Greymoor Bellway", "Pay the station's toll machine 60 Rosaries to open the stop.", {"reference": "https://hollowknight.wiki/w/Fast_Travel_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478037"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Far Fields",
      location: "Far Fields",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      sources: [["Wiki · Weighted Belt", "https://hollowknight.wiki/w/Weighted_Belt"], ["Wiki · Mask Shard locations", "https://hollowknight.wiki/w/Mask_Shard_(Silksong)"], ["Wiki · Lost Flea locations", "https://hollowknight.wiki/w/Flea"], ["Wiki · Memory Locket locations and prices", "https://hollowknight.wiki/w/Memory_Locket"], ["Wiki · Bone Scroll locations", "https://hollowknight.wiki/w/Bone_Scroll"], ["Wiki · Shakra's map stock and when it appears", "https://hollowknight.wiki/w/Shakra"], ["Wiki · Bellway tolls", "https://hollowknight.wiki/w/Fast_Travel_(Silksong)"]],
      rows: [
        ["tool-weighted-belt", ["tool"], "Weighted Belt", "Mort sells it in Pilgrim's Rest for 160 Rosaries.", {"reference": "https://hollowknight.wiki/w/Weighted_Belt", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477946"]}],
        ["mask-shard-3", ["mask-shard"], "Mask Shard · Far Fields", "It's in the area above the Seamstress's home, which the Drifter's Cloak lets you reach.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477975"]}],
        ["flea-far-fields", ["flea"], "Lost Flea beside the Far Fields trap", "The caged flea sits next to a pressure-plate trap. Stepping on the plate or hitting the cage brings out a Skarr Scout that guards it: beat the Scout, then free the flea.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477940"]}],
        ["memory-locket-far-fields", ["memory-locket"], "Memory Locket · Far Fields", "Mort sells it in Pilgrim's Rest for 150 Rosaries. Buy it now: it costs more later.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477953"]}],
        ["relic-bone-scroll-far-fields", ["relic"], "Bone Scroll · Far Fields", "East of the Seamstress's home, ride a tall updraft with the Drifter's Cloak to reach it.", {"reference": "https://hollowknight.wiki/w/Bone_Scroll", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478213"]}],
        ["map-far-fields", ["map"], "Get the Far Fields map", "Shakra sells it in the Far Fields for 50 Rosaries. If you pass her by, she has it in stock at her Bone Bottom ledge once you own the Drifter's Cloak.", {"reference": "https://hollowknight.wiki/w/Shakra"}],
        ["bellway-far-fields", ["bellway"], "Open Far Fields Bellway", "Pay the station's toll machine 40 Rosaries to open the stop.", {"reference": "https://hollowknight.wiki/w/Fast_Travel_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477933"]}],
      ],
    },
  ],
} satisfies RawChapter;
