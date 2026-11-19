import type { RawChapter } from "@hundo/core/types";

export default {
  id: 5,
  title: "The Pilgrim Road to the Grand Gate",
  region: "Blasted Steps · Hunter's March · Sinner's Road · Wormways",
  teaser: "Blasted Steps",
  intro: "Take the main gate into the Citadel. Several useful detours branch off the pilgrim road, and you can leave the longest ones for later.",
  sources: [["Blasted Steps", "https://hollowknight.wiki/w/Blasted_Steps"], ["Grand Gate", "https://hollowknight.wiki/w/Grand_Gate"], ["Last Judge", "https://hollowknight.wiki/w/Last_Judge"], ["Pinstress", "https://hollowknight.wiki/w/Pinstress"], ["Route reference", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "Lower Pharloom detours",
      location: "Hunter's March · Sinner's Road · Wormways",
      rows: [
        ["route-march", ["route"], "Open the side path into Hunter's March", "Use the Marrow approach, or loop over from Far Fields when the connection opens. Bounce off the red springy pods with the downward Needle strike and buy the local map after you reach a safe platform."],
        ["boss-savage-beastfly", ["boss"], "Defeat Savage Beastfly in the Chapel of the Beast", "Find the Chapel off Hunter's March. Jump over charges while keeping enough room to react to the fly's turnaround. Clear the summoned foes before they build up, and Bind when the boss is far away."],
        ["route-sinners-road", ["route"], "Open the bench shortcut in Sinner's Road", "Enter the area above Greymoor. Check the paid bench north of the way in. If the mechanism jams, enter the hidden room to its left and cut the vines before resting."],
        ["wish-roach-guts", ["quest"], "Bring Roach Guts to Crull and Benjin", "Accept from Crull and Benjin and kill Muckroaches in Sinner's Road. Return with 10 Roach Guts for Tacks. If you reach Act 3 first, recover the tool from their hut.", {"reference": "https://hollowknight.wiki/w/Roach_Guts_(Wish)"}],
        ["wish-alchemists-assistant", ["quest"], "Collect Plasmium for Alchemist Zylotol", "Use a Simple Key to open the Wormways from lower Pharloom. Repeat the conversation with Zylotol in his lab. Use his temporary Needle Phial on the local Plasmium enemies and return for the permanent tool."],
        ["ability-needle-strike", ["ability"], "Train with the Pinstress at her Blasted Steps home", "Look for the house above the Blasted Steps route. Speak to the Pinstress to learn Needle Strike. Charge it while an enemy is out of range and release as it approaches."],
      ],
    },
    {
      title: "The main gate",
      location: "Blasted Steps",
      rows: [
        ["route-blasted-steps", ["route"], "Cross the sand and open the Blasted Steps Bellway", "From the west side of Shellwood, use Cling Grip to take the upper path and reach the windswept platforms. Secure the station and the bench before attempting the long climb to the gate."],
        ["boss-great-conchflies", ["boss"], "Defeat the Great Conchflies in Blasted Steps", "Look for the northwest chamber full of pink shells off the sand route. Let the pair finish their overlapping charges before going for a short punish.", {"reference": "https://hollowknight.wiki/w/Great_Conchflies"}],
        ["boss-last-judge", ["boss"], "Defeat the Last Judge at the Grand Gate", "Check the Grand Gate task for all five Bellshrines, then play the Needolin with the pilgrims at the gate to summon the Judge. Learn the censer swings and floor-flame gaps. When the Judge falls, move away from the body before the final explosion.", {"reference": "https://hollowknight.wiki/w/Last_Judge"}],
        ["route-act-two", ["route"], "Enter the Choral Chambers and begin Act 2", "Use the opened Grand Gate. Find the breakable wall along the upper part of the interior to reach the Choral Chambers and trigger the act. The alternative entry from Sinner's Road goes through Phantom in the Exhaust Organ."],
        ["route-wormways-keydoor", ["route"], "Keep one Simple Key for each locked route", "The four locks are the lower Bone Bottom entrance to the Wormways, the Green Prince's cage, the lower Deep Docks shortcut, and the High Halls Rosary Bank. High Halls holds a counted Tool.", {"reference": "https://hollowknight.wiki/w/Simple_Key_(Silksong)"}],
      ],
    },
    {
      title: "The chapels and locked paths",
      location: "Hunter's March · Sinner's Road",
      compact: true,
      rows: [
        ["crest-beast", ["crest"], "Bind the Beast Crest in Hunter's March", "After defeating Savage Beastfly, go farther inside the Chapel of the Beast and Bind at the shrine."],
        ["key-roachkeeper", ["simple-key"], "Collect the Roachkeeper's Simple Key", "Beat the Roachkeeper in the northeastern part of Sinner's Road and check its drop. It can open the Green Prince's cell."],
        ["wish-green-prince-cell", ["quest"], "Free the Green Prince in Sinner's Road", "Spend a Simple Key at his cage and speak to him after opening it. Follow his meetings later in the Citadel so the Verdania route is available."],
      ],
    },
    {
      title: "Collectibles and unlocks · Sinner's Road",
      location: "Sinner's Road",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-tacks", ["tool"], "Tacks", "Turn in Roach Guts to Crull and Benjin. If their shop is empty in Act 3, pick up the tool from the floor in their hut.", {"reference": "https://hollowknight.wiki/w/Tacks", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478365"]}],
        ["tool-barbed-bracelet", ["tool"], "Barbed Bracelet", "Explore the bottom-right branches, following the map pin to a side pickup off the main road.", {"reference": "https://hollowknight.wiki/w/Barbed_Bracelet", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478341"]}],
        ["flea-sinners-road", ["flea"], "Lost Flea in the Sinner's Road cage", "Jump over the first cage in the linked room, then strike the right side of the next cage to release the flea.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478360"]}],
        ["map-sinners-road", ["map"], "Get the Sinner's Road map", "Climb into Sinner's Road from Greymoor. Find Shakra's post near the bench route. The map costs 90 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Hunter's March",
      location: "Hunter's March",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-curveclaw", ["tool"], "Curveclaw / Curvesickle", "Buy Curveclaw from Mottled Skarr for 140 Rosaries, or find it in the room above his body if he is already gone. If you trade it in Act 3, sit at a bench and return for Curvesickle before counting this slot.", {"reference": "https://hollowknight.wiki/w/Curveclaw", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478604"]}],
        ["tool-fractured-mask", ["tool"], "Fractured Mask", "Buy it from Mottled Skarr for 260 Rosaries. If the merchant is gone late in the game, check the floor at the same location.", {"reference": "https://hollowknight.wiki/w/Fractured_Mask", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478607"]}],
        ["flea-hunters-march", ["flea"], "Lost Flea above Hunter’s March", "Use the vertical column of red pods as steps. Down-strike each and use the rebound to reach the next until you find the cage at the top.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477999"]}],
        ["memory-locket-hunters-march", ["memory-locket"], "Memory Locket · Hunter's March", "Follow the thorn passage at the far right and break the cage at the end to free the locket.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478017"]}],
        ["map-hunters-march", ["map"], "Get the Hunter's March map", "Meet Shakra in the March or buy the map from her after exploring the March. The map costs 70 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Wormways",
      location: "Wormways",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-plasmium-phial", ["tool"], "Plasmium Phial", "Complete Alchemist's Assistant for Zylotol. Turn in the extracted Plasmium to receive the permanent phial.", {"reference": "https://hollowknight.wiki/w/Plasmium_Phial", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478496"]}],
        ["tool-dead-bugs-purse", ["tool"], "Dead Bug's Purse / Shell Satchel", "Search the dead bug inside the small chamber guarded by two Gromlings. Steel Soul puts Shell Satchel in this spot instead.", {"reference": "https://hollowknight.wiki/w/Dead_Bug's_Purse", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479081"]}],
        ["mask-shard-2", ["mask-shard"], "Mask Shard · Wormways", "Find the pool and break the weak wall at its edge. Use Swift Step to make the crossing inside.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478091"]}],
        ["flea-wormways", ["flea"], "Lost Flea carried by an Aknid", "Break the wall to the hidden chamber and hit the Aknid carrying the flea. Pick up the rescue after the carrier drops.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478450"]}],
        ["memory-locket-wormways", ["memory-locket"], "Memory Locket · Wormways", "Search the corpse in the lower-right Wormways passage.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478493"]}],
        ["map-wormways", ["map"], "Get the Wormways map", "Find Shakra in the Wormways after entering from Bone Bottom. The map costs 70 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Blasted Steps",
      location: "Blasted Steps",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-magnetite-dice", ["tool"], "Magnetite Dice", "Play dice against Lumble and win back his lucky dice. If you move on to Choral Chambers first and Lumble leaves, check the ground at his old spot. Grindle also has them in Act 3.", {"reference": "https://hollowknight.wiki/w/Magnetite_Dice", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479309"]}],
        ["craftmetal-4", ["craftmetal"], "Craftmetal · Blasted Steps", "Follow the side passage through the worms and falling rocks. Wait for each to pass before crossing to the pickup.", {"reference": "https://hollowknight.wiki/w/Craftmetal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478541"]}],
        ["flea-blasted-steps", ["flea"], "Lost Flea above the Blasted Steps Bellway", "Climb above the Bellway toward the high Sands of Karak crossing. Check the lower side ledge before leaving the Steps.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478386"]}],
        ["memory-locket-blasted-steps", ["memory-locket"], "Memory Locket · Blasted Steps", "Look for the narrow ledge over the sand by the marker and jump down onto it from the path above.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478502"]}],
        ["map-blasted-steps", ["map"], "Get the Blasted Steps map", "Look for Shakra on the upper rocky route and buy the map. The map costs 70 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
        ["bellway-blasted-steps", ["bellway"], "Open Blasted Steps Bellway", "Find the station mechanism and pay 60 Rosaries to unlock this stop.", {"reference": "https://hollowknight.wiki/w/Bellway#Bellways", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478308"]}],
      ],
    },
  ],
} satisfies RawChapter;
