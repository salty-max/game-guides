import type { RawChapter } from "@hundo/core/types";

export default {
  id: 1,
  title: "From the Grotto to Bone Bottom",
  region: "Moss Grotto · Bone Bottom · The Marrow",
  teaser: "Moss Grotto",
  intro: "Climb out of the Moss Grotto to the pilgrims' camp at Bone Bottom, then head east into the Marrow: buy maps from Shakra, learn Silkspear in Mosshome and free the Bell Beast to open the Bellways.",
  sources: [["Wiki · Moss Grotto and the Ruined Chapel", "https://hollowknight.wiki/w/Moss_Grotto"], ["Wiki · Bone Bottom, Mosshome and Bonegrave", "https://hollowknight.wiki/w/Bone_Bottom"], ["Wiki · the Marrow's landmarks", "https://hollowknight.wiki/w/The_Marrow"], ["Wiki · Bell Beast", "https://hollowknight.wiki/w/Bell_Beast"], ["Neoseeker · Marrow route to Shakra and Mosshome", "https://www.neoseeker.com/hollow-knight-silksong/The_Marrow"], ["Neoseeker · Bell Beast, Bellshrine and the eastern Marrow", "https://www.neoseeker.com/hollow-knight-silksong/The_Marrow_Revisited"], ["Nintendo Life · area order", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "From the fallen cage to Bone Bottom",
      location: "Moss Grotto · Bone Bottom",
      sources: [["Wiki · Bind and healing", "https://hollowknight.wiki/w/Bind"], ["Wiki · Moss Mother's attacks", "https://hollowknight.wiki/w/Moss_Mother"], ["Wiki · Chapel Maid", "https://hollowknight.wiki/w/Chapel_Maid"], ["Wiki · Flick and the unfinished Wishwall", "https://hollowknight.wiki/w/Flick_the_Fixer"], ["Wiki · Berry Picking", "https://hollowknight.wiki/w/Berry_Picking"], ["Wiki · Moss Druid's cave", "https://hollowknight.wiki/w/Moss_Druid"]],
      rows: [
        ["route-escape", ["route"], "Climb out of the Moss Grotto", "You wake at the bottom of the Grotto, still worn from the fall, and you suffer short bouts of exhaustion until you leave it. Work your way up to the Ruined Chapel at the top and rest at the bench on its left as you go in. Striking enemies fills your Silk. Once the spool glows, Bind to heal three masks, but only out of reach: a hit before the Bind finishes throws the Silk away.", {"reference": "https://hollowknight.wiki/w/Moss_Grotto"}],
        ["boss-moss-mother", ["boss"], "Defeat the Moss Mother in the Ruined Chapel", "On the chapel's upper floor a room locks around you. Break a chrysalis or hit her cocoon to wake her. Jump over her swooping dives, or bounce off her with a down-strike. When she rams the ceiling, puffs of dust show where rocks or Mossgrubs will drop; kill the grubs quickly, they give plenty of Silk. Beating her opens the climb up into Bone Bottom.", {"reference": "https://hollowknight.wiki/w/Moss_Mother"}],
        ["wish-chapel-maid", ["route"], "Meet the Chapel Maid above the Ruined Chapel", "She finds you collapsed as you stagger out at the top of the chapel; stop and talk on your way past. Bone Bottom lies just west. Rest at its bench and meet Flick, who is still putting up the camp's Wishwall. He only finishes it once you've beaten the Bell Beast, so Wishes start appearing there after that fight.", {"reference": "https://hollowknight.wiki/w/Chapel_Maid"}],
      ],
    },
    {
      title: "Maps and the Bell Beast",
      location: "The Marrow",
      sources: [["Neoseeker · Mooshka's caravan, Shakra and the way into Mosshome", "https://www.neoseeker.com/hollow-knight-silksong/The_Marrow"], ["Wiki · Quill and maps", "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)"], ["Wiki · The Lost Fleas", "https://hollowknight.wiki/w/The_Lost_Fleas"], ["Wiki · fleas' sounds and traps", "https://hollowknight.wiki/w/Flea"], ["Wiki · Silkspear", "https://hollowknight.wiki/w/Silkspear"], ["Wiki · Weaver Burial Spires", "https://hollowknight.wiki/w/Weaver_Burial_Spire"], ["Wiki · Silk Hearts and their memories", "https://hollowknight.wiki/w/Silk_Heart"], ["Wiki · Bellshrines", "https://hollowknight.wiki/w/Bench_(Silksong)"], ["Neoseeker · Bell Beast's Silk Heart and the Marrow Bellshrine", "https://www.neoseeker.com/hollow-knight-silksong/The_Marrow_Revisited"]],
      rows: [
        ["pickup-quill", ["pickup"], "Buy the Quill from Shakra", "Go east from Bone Bottom into the Marrow and keep climbing. Where you hear singing, Shakra sits in the upper left of the room, selling maps. The Quill costs 50 Rosaries, and without it your maps never fill in when you rest at a bench.", {"reference": "https://www.neoseeker.com/hollow-knight-silksong/The_Marrow"}],
        ["wish-the-lost-fleas", ["wish"], "Meet Fleamaster Mooshka in the Marrow", "Up a side path in the middle of the Marrow, the Flea Caravan has stopped. Talk to Mooshka to take The Lost Fleas. A lost flea often snores or whimpers when you're close; free it from its cage, vines or other trap. Come back and talk to Mooshka once five are free.", {"reference": "https://hollowknight.wiki/w/The_Lost_Fleas"}],
        ["skill-silkspear", ["skill"], "Learn Silkspear in Mosshome", "Past Shakra, take the lower path left into Mosshome and climb to the Weaver Burial Spire at its very top. Bind the dead Weaver there to learn Silkspear, which hurls your needle forward for a cost in Silk. It also cuts the silk walls around Mosshome, including the way to the Moss Druid, and the strands holding the Bell Beast.", {"reference": "https://hollowknight.wiki/w/Silkspear"}],
        ["wish-berry-picking", ["wish"], "Bring three Mossberries to the Moss Druid", "The Moss Druid brews in a cave up in Mosshome's northeast corner, behind silk threads that Silkspear now cuts. Bring the Druid three Mossberries: the two in the Moss Grotto and the one an Aknid carries in the room below the cave (all in the lists below). Once the Wishwall is up you can also take the Wish there. The Druid's Eye is the reward.", {"reference": "https://hollowknight.wiki/w/Berry_Picking"}],
        ["boss-bell-beast", ["boss"], "Free and defeat the Bell Beast", "Back in the Marrow, the Bell Beast hangs in silk in the long hall full of bells, her station. Throw Silkspear at the strands to free her, and she turns on you. She spends most of the fight under the floor, and dust shows where she'll burst out: jump her charges and leaps, and hop the pair of bells she rolls out from the middle. After her roar at the halfway point, bells also drop from the ceiling.", {"reference": "https://hollowknight.wiki/w/Bell_Beast"}],
        ["silk-heart-bell-beast", ["silk-heart"], "Take the Bell Beast's Silk Heart", "The arena stays shut until you take the Silk Heart floating in it. Touching it pulls you into a memory: climb to the end to claim the heart, and from then on your Silk slowly refills by itself. Leave the room and the Bell Beast comes back as your ride, with Bone Bottom and the Marrow open as Bellway stops.", {"reference": "https://hollowknight.wiki/w/Silk_Heart"}],
        ["route-marrow-shrine", ["bellshrine"], "Ring the Marrow Bellshrine", "From the Marrow's station, go right into the next room and strike the lever on the floor. The great bell swings and rings, a bench rises beside it, and the gate on the right opens.", {"reference": "https://hollowknight.wiki/w/Bench_(Silksong)"}],
      ],
    },
    {
      title: "Upgrades and settlements around Bone Bottom",
      location: "Moss Grotto · Bone Bottom · The Marrow",
      compact: true,
      sources: [["Wiki · Bone Bottom Repairs", "https://hollowknight.wiki/w/Bone_Bottom_Repairs"], ["Wiki · Pebb's shop", "https://hollowknight.wiki/w/Pebb"]],
      rows: [
        ["wish-bone-bottom-repairs", ["wish"], "Fund the first Bone Bottom repairs", "With the Bell Beast beaten, Flick finishes the Wishwall and pins up a Wish of his own: donate 200 Shell Shards at the wall so he can patch up the camp.", {"reference": "https://hollowknight.wiki/w/Bone_Bottom_Repairs"}],
        ["key-pebb", ["simple-key"], "Buy Pebb's Simple Key", "Pebb's shop stands just left of the Wishwall, and her Simple Key costs 500 Rosaries. It breaks after opening one simple lock, so keep it until you've picked which door.", {"reference": "https://hollowknight.wiki/w/Pebb"}],
      ],
    },
    {
      title: "Collectibles and unlocks · The Marrow",
      location: "The Marrow",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      sources: [["Neoseeker · Straight Pin, Craftmetal tunnel and flea", "https://www.neoseeker.com/hollow-knight-silksong/The_Marrow_Revisited"], ["Wiki · Shakra's shop and Bone Bottom ledge", "https://hollowknight.wiki/w/Shakra"], ["Wiki · Bellway tolls", "https://hollowknight.wiki/w/Fast_Travel_(Silksong)"]],
      rows: [
        ["tool-straight-pin", ["tool"], "Straight Pin", "In the building with a bench in the eastern Marrow, a thief sits locked in a cell above the entrance. Hit the bars until they give, then climb up inside the cell and take the pin.", {"reference": "https://hollowknight.wiki/w/Straight_Pin", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477899"]}],
        ["tool-compass", ["tool"], "Compass", "Shakra sells it for 70 Rosaries. It's a yellow tool: equip it at a bench and your map marks where you're standing.", {"reference": "https://hollowknight.wiki/w/Compass", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477851"]}],
        ["tool-shard-pendant", ["tool"], "Shard Pendant", "It lies in a small room off to the side of the chamber under the Marrow Bellshrine, past a large skull-shelled enemy. Wear it and defeated enemies drop more Shell Shards.", {"reference": "https://hollowknight.wiki/w/Shard_Pendant", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477848"]}],
        ["craftmetal-2", ["craftmetal"], "Craftmetal · The Marrow", "In the big room in the Marrow's northeast, hit the glowing orange spot low on the left and back away: it blows open a rock tunnel. Strike the next glowing spot inside and stand clear while the blasts chain through, then hit the glowing ore at the end until the Craftmetal comes loose.", {"reference": "https://hollowknight.wiki/w/Craftmetal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477894"]}],
        ["flea-the-marrow", ["flea"], "Lost Flea above the Marrow", "Ring the Marrow Bellshrine first. Go through the gate it opens, then up: cross the vanishing platforms out to the left wall and back right past a large skull-shelled enemy, then drop through a vanishing platform on the right to the flea caught in vines.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477890"]}],
        ["map-mosslands", ["map"], "Get the Mosslands map", "Shakra's Mosslands map covers the Moss Grotto and Bone Bottom for 40 Rosaries. Buy it when you meet her in the Marrow, or later from her ledge above Bone Bottom's Wishwall.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)"}],
        ["map-the-marrow", ["map"], "Get the Marrow map", "Shakra sells the Marrow map for 50 Rosaries, in the Marrow or at her ledge in Bone Bottom.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)"}],
        ["bellway-the-marrow", ["bellway"], "Open the Marrow Bellway", "This station costs nothing: it opens when you beat the Bell Beast inside it.", {"reference": "https://hollowknight.wiki/w/Fast_Travel_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477882"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Mosshome",
      location: "Mosshome",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-druids-eye", ["tool"], "Druid's Eye / Druid's Eyes", "Finish Berry Picking with three Mossberries for the Druid's Eye. Bring four more, seven in all, and the Druid upgrades it to the Druid's Eyes; either one ticks this row.", {"reference": "https://hollowknight.wiki/w/Druid's_Eye", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478255"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Bone Bottom",
      location: "Bone Bottom",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      sources: [["Wiki · Pebb's prices", "https://hollowknight.wiki/w/Pebb"], ["Wiki · Mossberry locations", "https://hollowknight.wiki/w/Mossberry"], ["Neoseeker · the Aknid by the lift above Bone Bottom", "https://www.neoseeker.com/hollow-knight-silksong/Berry_Picking"]],
      rows: [
        ["tool-magnetite-brooch", ["tool"], "Magnetite Brooch", "Pebb sells it for 120 Rosaries. It's a yellow tool that draws loose Rosaries to you.", {"reference": "https://hollowknight.wiki/w/Magnetite_Brooch", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477841"]}],
        ["mask-shard-1", ["mask-shard"], "Mask Shard · Bone Bottom", "Pebb sells a Mask Shard for 300 Rosaries. Every four shards make one more mask of health.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477840"]}],
        ["spool-fragment-1", ["spool-fragment"], "Spool Fragment · Bone Bottom", "In the mossy rooms above the settlement, break through a false wall to find it. Two fragments make a spool, which holds one more Silk.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478080"]}],
        ["craftmetal-1", ["craftmetal"], "Craftmetal · Bone Bottom", "Pebb sells one Craftmetal for 60 Rosaries. Keep it: some tools can't be made without it.", {"reference": "https://hollowknight.wiki/w/Craftmetal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477838"]}],
        ["mossberry-3", ["mossberry"], "Mossberry · Mosshome", "An Aknid carries this berry in the room below the Moss Druid's cave. Strike it down and pick up what it drops.", {"reference": "https://hollowknight.wiki/w/Mossberry", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478141"]}],
        ["mossberry-4", ["mossberry"], "Mossberry · Bone Bottom", "Once the lift above the town is unlocked, another Aknid flies with a berry high above it, to the right of the lift and under the floating ledges. Bring it down and the berry falls into the settlement.", {"reference": "https://www.neoseeker.com/hollow-knight-silksong/Berry_Picking", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477877"]}],
        ["bellway-bone-bottom", ["bellway"], "Open Bone Bottom Bellway", "Free as well: it opens along with the Marrow's when you beat the Bell Beast.", {"reference": "https://hollowknight.wiki/w/Fast_Travel_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477883"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Moss Grotto",
      location: "Moss Grotto",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      sources: [["Wiki · Mossberry locations", "https://hollowknight.wiki/w/Mossberry"], ["Neoseeker · bouncing up to the eastern berry", "https://www.neoseeker.com/hollow-knight-silksong/Berry_Picking"]],
      rows: [
        ["mossberry-1", ["mossberry"], "Mossberry · Moss Grotto", "Go up and left from where you first wake and climb that room to the top. The berry glows up by the ceiling: knock it down and take it.", {"reference": "https://hollowknight.wiki/w/Mossberry", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=476900"]}],
        ["mossberry-2", ["mossberry"], "Mossberry · Moss Grotto", "This one hangs near the top of the Grotto's eastern room. If the jump is too high, bounce off an enemy with a down-strike to reach it, then knock it loose.", {"reference": "https://www.neoseeker.com/hollow-knight-silksong/Berry_Picking", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=476909"]}],
      ],
    },
  ],
} satisfies RawChapter;
