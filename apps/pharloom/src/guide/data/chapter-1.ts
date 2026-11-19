import type { RawChapter } from "@hundo/core/types";

export default {
  id: 1,
  title: "From the Grotto to Bone Bottom",
  region: "Moss Grotto · Bone Bottom · The Marrow",
  teaser: "Moss Grotto",
  intro: "Find your first bench, learn how Bind works, then open the Bellways before heading deeper into Pharloom.",
  sources: [["Moss Grotto", "https://hollowknight.wiki/w/Moss_Grotto"], ["Bone Bottom", "https://hollowknight.wiki/w/Bone_Bottom"], ["The Marrow", "https://hollowknight.wiki/w/The_Marrow"], ["Bell Beast", "https://hollowknight.wiki/w/Bell_Beast"], ["Route reference", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "From the fallen cage to Bone Bottom",
      location: "Moss Grotto",
      rows: [
        ["route-escape", ["route"], "Follow the lit passage out of the Moss Grotto", "Head along the grassy platforms, then climb toward the ruined chapel. Use the early bench when you find it. Needle hits build Silk. Hold Bind when the meter allows it and leave enough space for the heal to finish."],
        ["boss-moss-mother", ["boss"], "Defeat Moss Mother below the ruined chapel", "Move under or over her dives, then hit when she settles. When she shakes the ceiling, keep moving away from the debris and clear the spawned enemies for Silk."],
        ["wish-chapel-maid", ["quest"], "Speak to the Chapel Maid in Bone Bottom", "Climb out of the grotto into the settlement, rest at the bench, and talk to the Chapel Maid. Use the Wishwall and the shops as you return from later regions."],
        ["wish-berry-picking", ["quest"], "Bring three Mossberries to the Moss Druid", "Find the Druid's home in Mosshome. Take two berries in the early grotto, one high in the room northwest of the start and one above the eastern cavern. Take another from a flying Aknid below the Druid's home. Return with three berries and collect the tool.", {"reference": "https://hollowknight.wiki/w/Mossberry"}],
      ],
    },
    {
      title: "Maps and the Bell Beast",
      location: "The Marrow",
      rows: [
        ["pickup-quill", ["pickup"], "Buy the Quill from Shakra", "Go east from Bone Bottom into the Marrow. Listen for singing and look for her golden rings. Pay 50 Rosaries for the Quill so bench rests fill in bought maps. Compass uses a yellow slot and is sold separately."],
        ["wish-the-lost-fleas", ["quest"], "Meet Fleamaster Mooshka in the Marrow", "Take the side passage to the caravan in the Marrow and speak to Mooshka. Keep checking side ledges for the fleas' calls and strike their cages. Return once you have saved five."],
        ["skill-silkspear", ["skill"], "Learn Silkspear in Mosshome", "Follow the upper Marrow connection back into Mosshome and reach the Weaver shrine. Bind at the statue. Try the projectile on the silk binding the Bell Beast. Save Silk for healing when you need it."],
        ["boss-bell-beast", ["boss"], "Free and defeat the Bell Beast", "Return to the Marrow station and cut the silk with Silkspear. Jump across the Beast's charges, then attack the short pauses. Watch for falling bells and avoid binding while it is lined up to charge."],
        ["silk-heart-bell-beast", ["silk-heart"], "Take the Bell Beast's Silk Heart", "Follow the floating heart after the fight and finish its platforming memory. Mark it after you return. Bone Bottom and the Marrow are now available as Bellway stops."],
        ["route-marrow-shrine", ["bellshrine"], "Ring the Marrow Bellshrine", "Find the large bell mechanism on the road through the Marrow, strike the floor lever, and use the bench it reveals. The Bellshrine and the Bell Beast station serve different purposes."],
      ],
    },
    {
      title: "Upgrades and settlements around Bone Bottom",
      location: "Moss Grotto · Bone Bottom · The Marrow",
      compact: true,
      rows: [
        ["wish-bone-bottom-repairs", ["quest"], "Fund the first Bone Bottom repairs", "Once the Bone Bottom Wishwall is active, donate 200 Shell Shards to repair the settlement and prepare the later bridge Wish."],
        ["key-pebb", ["simple-key"], "Buy Pebb's Simple Key", "Pay 500 Rosaries at the Bone Bottom shop. In Act 3 the unsold key moves to Grindle for 600. Use it at the lower Wormways gate if you want the Alchemist's quest first."],
      ],
    },
    {
      title: "Collectibles and unlocks · The Marrow",
      location: "The Marrow",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-straight-pin", ["tool"], "Straight Pin", "Climb to the ledge above Grindle inside his cell and take the tool from its resting place.", {"reference": "https://hollowknight.wiki/w/Straight_Pin", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477899"]}],
        ["tool-compass", ["tool"], "Compass", "Buy the Compass from Shakra for 70 Rosaries. Equip it at a bench in a yellow slot to show Hornet on the map.", {"reference": "https://hollowknight.wiki/w/Compass", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477851"]}],
        ["tool-shard-pendant", ["tool"], "Shard Pendant", "Check the side chamber off the room one level below the Marrow Bellshrine.", {"reference": "https://hollowknight.wiki/w/Shard_Pendant", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477848"]}],
        ["craftmetal-2", ["craftmetal"], "Craftmetal · The Marrow", "Find the secret tunnel with pressure plates. Bait or hop its traps and pick up the ore at the end.", {"reference": "https://hollowknight.wiki/w/Craftmetal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477894"]}],
        ["flea-the-marrow", ["flea"], "Lost Flea above the Marrow", "Climb high above the main Marrow route. Listen for the call on the ledges and strike the cage on the upper shelf.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477890"]}],
        ["flea-the-marrow-2", ["flea"], "Lost Flea in the Marrow lavafall", "Find the false wall left of the Bellway approach. Cross the little chamber with lavafalls and rescue the flea hiding in the corner.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477907"]}],
        ["map-mosslands", ["map"], "Get the Mosslands map", "Shakra's Mosslands map covers Moss Grotto and Bone Bottom. Buy it during the first encounter in the Marrow or at her later post. The map costs 40 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
        ["map-the-marrow", ["map"], "Get the The Marrow map", "Buy the Marrow map from Shakra at her initial post by the golden rings. The map costs 50 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
        ["bellway-the-marrow", ["bellway"], "Open The Marrow Bellway", "The stop becomes available when you defeat the Bell Beast in the Marrow. Visit it on the travel map.", {"reference": "https://hollowknight.wiki/w/Bellway#Bellways", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477882"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Mosshome",
      location: "Mosshome",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-druids-eye", ["tool"], "Druid's Eye / Druid's Eyes", "Bring the Moss Druid the three berries for Berry Picking. Four more later turn the Eye into Eyes. Either version counts in the same slot.", {"reference": "https://hollowknight.wiki/w/Druid's_Eye", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478255"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Bone Bottom",
      location: "Bone Bottom",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-magnetite-brooch", ["tool"], "Magnetite Brooch", "Buy it from Pebb for 120 Rosaries in Acts 1 or 2. In Act 3, check Grindle's fallback stock in Blasted Steps for 220.", {"reference": "https://hollowknight.wiki/w/Magnetite_Brooch", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477841"]}],
        ["mask-shard-1", ["mask-shard"], "Mask Shard · Bone Bottom", "Pay Pebb 300 Rosaries in Acts 1 or 2. Check Grindle in Blasted Steps for the 320-Rosary fallback in Act 3.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477840"]}],
        ["spool-fragment-1", ["spool-fragment"], "Spool Fragment · Bone Bottom", "Climb the platforms above the settlement and search along the upper ledges over the town.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478080"]}],
        ["craftmetal-1", ["craftmetal"], "Craftmetal · Bone Bottom", "Buy Pebb's ore for 60 Rosaries. If it remains unsold in Act 3, check Grindle's Blasted Steps shop for 120.", {"reference": "https://hollowknight.wiki/w/Craftmetal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477838"]}],
        ["mossberry-3", ["mossberry"], "Mossberry · Bone Bottom", "Look for the flying carrier below the Moss Druid's home, strike it, and collect the berry before leaving.", {"reference": "https://hollowknight.wiki/w/Mossberry", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478141"]}],
        ["mossberry-4", ["mossberry"], "Mossberry · Bone Bottom", "Search the high cavern above the settlement for another flying carrier. Check the eastward fallback room in Act 3.", {"reference": "https://hollowknight.wiki/w/Mossberry", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477877"]}],
        ["bellway-bone-bottom", ["bellway"], "Open Bone Bottom Bellway", "The stop becomes available when you defeat the Bell Beast in the Marrow. Visit it on the travel map.", {"reference": "https://hollowknight.wiki/w/Bellway#Bellways", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477883"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Moss Grotto",
      location: "Moss Grotto",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["mossberry-1", ["mossberry"], "Mossberry · Moss Grotto", "Climb the room northwest of the starting area all the way to the berry near its ceiling.", {"reference": "https://hollowknight.wiki/w/Mossberry", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=476900"]}],
        ["mossberry-2", ["mossberry"], "Mossberry · Moss Grotto", "Check high in the eastern cavern. Down-strike a nearby flying bug to bounce up if you cannot jump to the shelf.", {"reference": "https://hollowknight.wiki/w/Mossberry", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=476909"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Bonegrave",
      location: "Bonegrave",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["mossberry-5", ["mossberry"], "Mossberry · Bonegrave", "Look above the Bonegrave route for a flying bug carrying the berry. Hit it and follow the drop.", {"reference": "https://hollowknight.wiki/w/Mossberry", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478237"]}],
      ],
    },
  ],
} satisfies RawChapter;
