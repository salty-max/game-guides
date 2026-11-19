import type { RawChapter } from "@hundo/core/types";

export default {
  id: 7,
  title: "The Threefold Melody",
  region: "Cogwork Core · Whispering Vaults · High Halls",
  teaser: "Cogwork Core",
  intro: "Get past the Cogwork Dancers into the Citadel's clockwork heart, then gather the three songs its statues ask for: the Vaultkeepers' from the Whispering Vaults and the Stage, the Architects' from the top of the Core, and the Conductors' from the High Halls. The lift the statues guard can wait: there's plenty to do first.",
  sources: [["Threefold Melody: where each part is learnt", "https://hollowknight.wiki/w/Threefold_Melody"], ["Cogwork Core access and its upper half", "https://hollowknight.wiki/w/Cogwork_Core"], ["Whispering Vaults access and the Stage", "https://hollowknight.wiki/w/Whispering_Vaults"], ["High Halls, the Forum and the Rosary Bank", "https://hollowknight.wiki/w/High_Halls"], ["Psalm and Sacred Cylinders", "https://hollowknight.wiki/w/Psalm_Cylinder"], ["Cogheart pieces and bell solutions", "https://hollowknight.wiki/w/Cogheart"], ["Melody order and the skills each needs", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "The Cogwork Dancers",
      location: "Cogwork Core · Choral Chambers",
      sources: [["Dancers' attacks and phases", "https://hollowknight.wiki/w/Cogwork_Dancers"], ["Upper halls leading to the Core", "https://hollowknight.wiki/w/Choral_Chambers"], ["Green Prince's moves through the Citadel", "https://hollowknight.wiki/w/Green_Prince"], ["Choral Chambers Cogheart piece", "https://hollowknight.wiki/w/Cogheart"]],
      rows: [
        ["boss-cogwork-dancers", ["boss"], "Defeat the Cogwork Dancers", "The long upper halls of the Choral Chambers end at their arena, the way into the Cogwork Core. Before each dash a dancer shines a beam along its path, so step off that line. When both leave and a web of beams appears, they'll rush along every one; when both beams point at a circle in the middle, stay out of it. The fight runs in four phases, and in the last only one dancer is left, much slower than before. Their fall uncovers a lift and three statues, who ask you for the Threefold Melody.", {"reference": "https://hollowknight.wiki/w/Cogwork_Dancers"}],
        ["wish-green-prince-citadel", ["wish"], "Meet the Green Prince in the Citadel", "Once you've freed him from his cell, he waits in the long hallway west of the Citadel Spa, but only after you've won the Choral Chambers gauntlet there. Talk to him, visit Songclave, and with the Dancers beaten he moves to the short hallway left of their arena: meet him there too.", {"reference": "https://hollowknight.wiki/w/Green_Prince"}],
        ["pickup-cogheart-choral", ["pickup"], "Get the Cogheart Piece in the Choral Chambers", "In the western Choral Chambers, a row of bells plays a tune for you to copy. Count them from the left and strike 1–5–4–6, then 3–6–5–1–7, then 2–4–6–3–5–1. A wrong note only restarts that round.", {"reference": "https://hollowknight.wiki/w/Cogheart"}],
      ],
    },
    {
      title: "The Vaults and the Stage",
      location: "Whispering Vaults",
      sources: [["Vaults access, the Stage and Trobbio's lift", "https://hollowknight.wiki/w/Whispering_Vaults"], ["The rotating hallway", "https://hollowknight.wiki/w/Choral_Chambers"], ["Garmond and Zaza's duel and their help in the Forum", "https://hollowknight.wiki/w/Garmond_and_Zaza"], ["Trobbio's attacks", "https://hollowknight.wiki/w/Trobbio"], ["Sacred Cylinder and Vaultkeeper Cardinius", "https://hollowknight.wiki/w/Psalm_Cylinder"], ["Cardinius's listening room", "https://hollowknight.wiki/w/Vaultkeeper_Cardinius"], ["Twisted Bud room", "https://hollowknight.wiki/w/Twisted_Bud"], ["Vaults Cogheart piece", "https://hollowknight.wiki/w/Cogheart"]],
      rows: [
        ["route-vault-entry", ["route"], "Turn the rotating hall toward the Whispering Vaults", "The Vaults open off the Cogwork Core's south-east side, through the great rotating hallway in the eastern Choral Chambers. Hit the lever at its entrance and the hall turns to join the Core to the Vaults; hit it again and it swings back toward the upper east chambers.", {"reference": "https://hollowknight.wiki/w/Choral_Chambers"}],
        ["wish-garmond-zaza-act-two", ["boss"], "Duel Garmond and Zaza above the Whispering Vaults", "If you've ever spoken to Garmond, opening the shortcut onto the roof above the Vaults brings him there, keen for a friendly duel. Beat the pair (knocking them into the spikes round the platform hurts them) and they'll wait outside the High Halls Forum to fight beside you in its gauntlet. On Steel Soul, losing the duel is safe, but dying on those spikes isn't. The offer ends once you hold the whole Threefold Melody and have finished Fine Pins: they settle at Songclave and stop asking.", {"reference": "https://hollowknight.wiki/w/Garmond_and_Zaza"}],
        ["boss-trobbio", ["boss"], "Defeat Trobbio at the Stage", "The Stage lies between the Vaults and the Choral Chambers. Trobbio whirls across the floor in a spin you have to jump (it can still be hit from above), throws glitter bombs that burst into lines of smoke, and scatters sparkling circles that explode a moment later. From half health he also erupts from fire pillars, each given away by a fizzle under the boards. He drops the Claw Mirror, his defeat opens a lift down to the Underworks, and if you skipped Shakra's Quill, his desk by the arena holds one.", {"reference": "https://hollowknight.wiki/w/Trobbio"}],
        ["route-vaultkeepers-melody", ["route"], "Have Cardinius play the Sacred Cylinder for the Vaultkeeper's Melody", "Take the lift Trobbio's defeat opens down to the Underworks: the lowest Vaults are reached from there, and the Sacred Cylinder lies with their dead pontiff. Carry it to Vaultkeeper Cardinius's listening room, hand it over and say yes when asked to play it. Cardinius rages at the sacrilege but plays it, and the melody is yours. It pays you 320 Rosaries for the cylinder too.", {"reference": "https://hollowknight.wiki/w/Vaultkeeper_Cardinius"}],
        ["pickup-twisted-bud", ["pickup"], "Collect the Twisted Bud below the eastern Vaults", "At the Vaults' easternmost edge, a hidden passage drops you into a closed room where the Twisted Bud sits in a crib-shaped knot of roots. This drop is the only way in, as the room's gate only opens from above. Take the bud: it has no use yet, and a later chapter says where it goes.", {"reference": "https://hollowknight.wiki/w/Twisted_Bud"}],
        ["pickup-cogheart-vaults", ["pickup"], "Get the Cogheart Piece in the Whispering Vaults", "The second bell puzzle is in a room below the Stage's entrance. Count these bells from the left too and strike 1–2–7–4, then 7–5–6–4–5, then 2–7–3–5–6–1.", {"reference": "https://hollowknight.wiki/w/Cogheart"}],
      ],
    },
    {
      title: "The Core's summit and the High Halls",
      location: "Cogwork Core · High Halls",
      sources: [["Architect's Melody and the climb to the Core's top", "https://hollowknight.wiki/w/Cogwork_Core"], ["Architect's Melody puzzle", "https://hollowknight.wiki/w/Threefold_Melody"], ["Twelfth Architect's stock and its end", "https://hollowknight.wiki/w/Twelfth_Architect"], ["Forum gauntlet, Conductor Ballador and the Rosary Bank", "https://hollowknight.wiki/w/High_Halls"], ["Simple Keys and their four locks", "https://hollowknight.wiki/w/Simple_Key_(Silksong)"]],
      rows: [
        ["route-architects-melody", ["route"], "Learn the Architect's Melody at the top of the Cogwork Core", "The Core's upper half is one long platforming climb. Drop down the lower central area's left-hand side, climb its right-hand side again and take the door at the top into the upper section, where a Clawline hook opens a shortcut back from the Dancers' arena. At the very top, solve the room's puzzle to set the old constructs working, and they play the Architect's Melody for you.", {"reference": "https://hollowknight.wiki/w/Cogwork_Core"}],
        ["challenge-architect-shop", ["challenge"], "Collect the Architect's workshop stock", "Buy what the Twelfth Architect sells as your Rosaries and Craftmetal allow. Once everything is bought (its repair work aside) and you've learnt the Architect's Melody, one more talk brings its end: later it sits motionless at its desk, with a Pristine Core on the floor for you. Leave one item unbought if you'd rather keep it working.", {"reference": "https://hollowknight.wiki/w/Twelfth_Architect"}],
        ["route-conductors-melody", ["route"], "Win the Forum gauntlet and learn the Conductor's Melody", "The High Halls sit above the upper-left Choral Chambers, and you need Clawline to get in and around. On their east side, facing the Ventrica, the Forum holds an eleven-wave gauntlet; Garmond and Zaza join you if you won their duel. When the chandelier crashes down at the end, go through to the next room and talk to Conductor Ballador, who sings you the melody. If a gap on the way needs an ability you don't have yet, leave it and come back later.", {"reference": "https://hollowknight.wiki/w/High_Halls"}],
        ["route-rosary-storage", ["pickup"], "Open the High Halls Rosary Bank with a Simple Key", "The bank beside the Forum, west of the Ventrica, takes a Simple Key: Pharloom has four keys for its four locks. Inside, look for dust falling from a breakable ceiling and climb that vent past its fans to the vault: 560 Rosaries all told, lying loose and in three chests, one of them holding a Pale Rosary Necklace. Clear it in one visit: once it's open, saving anywhere beyond the High Halls, Choral Chambers and Cogwork Core sends a Snitchfly in to take whatever you left.", {"reference": "https://hollowknight.wiki/w/High_Halls"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Cogwork Core",
      location: "Cogwork Core",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["mask-shard-8", ["mask-shard"], "Mask Shard · Cogwork Core", "In the western Core, win the enemy gauntlet; the shard is past it.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478615"]}],
        ["spool-fragment-8", ["spool-fragment"], "Spool Fragment · Cogwork Core", "Down in the lower Core's south-east, get past the Cogwork Clapper (beat it or dodge it) and keep heading east and down.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478618"]}],
        ["map-cogwork-core", ["map"], "Get the Cogwork Core map", "Find and work the map mechanism inside the Core.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Whispering Vaults",
      location: "Whispering Vaults",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-claw-mirror", ["tool"], "Claw Mirror", "Trobbio drops it when he falls at the Stage.", {"reference": "https://hollowknight.wiki/w/Claw_Mirror", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478691"]}],
        ["mask-shard-9", ["mask-shard"], "Mask Shard · Whispering Vaults", "Solve the sliding-box puzzle in the central Vaults, shoving the boxes with needle strikes; the shard waits behind it.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478671"]}],
        ["flea-whispering-vaults", ["flea"], "Lost Flea above the Vaults box", "Push the box from the middle-left of its room into place and climb off it to the top, where the flea sleeps. Cling Grip needed.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478402"]}],
        ["memory-locket-whispering-vaults", ["memory-locket"], "Memory Locket · Whispering Vaults", "In the room just under the Vaults' way out to the open air.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478676"]}],
        ["relic-psalm-cylinder-whispering-vaults", ["relic"], "Psalm Cylinder · Whispering Vaults", "One lies in Vaultkeeper Cardinius's own room.", {"reference": "https://hollowknight.wiki/w/Psalm_Cylinder", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478650"]}],
        ["relic-psalm-cylinder-whispering-vaults-2", ["relic"], "Psalm Cylinder · Whispering Vaults (#2)", "In the far east of the Vaults, rise up the big wind shaft, then loop back round to the west for the cylinder.", {"reference": "https://hollowknight.wiki/w/Psalm_Cylinder", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478774"]}],
        ["relic-sacred-cylinder", ["relic"], "Sacred Cylinder", "Take Trobbio's lift to the Underworks, reach the lowest Vaults from there and take it from the dead pontiff. It's the one Cardinius plays for the melody, not an ordinary Psalm Cylinder.", {"reference": "https://hollowknight.wiki/w/Psalm_Cylinder", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479717"]}],
        ["map-whispering-vaults", ["map"], "Get the Whispering Vaults map", "Use the map machine in the Vaults. The map costs 70 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
      ],
    },
    {
      title: "Collectibles and unlocks · The curtained Vaults passage",
      location: "Whispering Vaults",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["flea-songclave", ["flea"], "Lost Flea behind the Vaults curtains", "In the room below Vaultkeeper Cardinius's, jump behind the curtains into a hidden passage. A long platforming run follows, needing Clawline and Cling Grip, and the flea sleeps at its end.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478404"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Whispering Vaults to Choral Chambers",
      location: "Whispering Vaults to Choral Chambers",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["pale-oil-1", ["pale-oil"], "Pale Oil · Whispering Vaults to Choral Chambers", "The oil is in a north-east Choral Chambers room that only opens from the Vaults room next to it. Cling Grip needed.", {"reference": "https://hollowknight.wiki/w/Pale_Oil", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478668"]}],
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
      ],
    },
  ],
} satisfies RawChapter;
