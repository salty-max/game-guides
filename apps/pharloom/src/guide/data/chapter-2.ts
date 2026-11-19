import type { RawChapter } from "@hundo/core/types";

export default {
  id: 2,
  title: "The Forges at Deep Docks",
  region: "Deep Docks · Far Fields approach",
  teaser: "Deep Docks",
  intro: "Learn to dash at the Docks' Weaver spire, have Forge Daughter make your first tools, then duel Lace and ring the Bellshrine that opens the way to the Far Fields.",
  sources: [["Wiki · Deep Docks: access, hazards, the locked lower Docks", "https://hollowknight.wiki/w/Deep_Docks"], ["Wiki · Far Fields: the way in past Lace's arena", "https://hollowknight.wiki/w/Far_Fields"], ["Wiki · Lace: Docks attacks and when the fight is skipped", "https://hollowknight.wiki/w/Lace"], ["Wiki · Swift Step", "https://hollowknight.wiki/w/Swift_Step"], ["Wiki · Forge Daughter's shop", "https://hollowknight.wiki/w/Forge_Daughter"], ["Neoseeker · Deep Docks walkthrough", "https://www.neoseeker.com/hollow-knight-silksong/Deep_Docks"], ["Neoseeker · first steps in the Far Fields", "https://www.neoseeker.com/hollow-knight-silksong/Far_Fields"], ["Nintendo Life · area order", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "The upper foundry",
      location: "Deep Docks",
      sources: [["Neoseeker · the gauntlet to Forge Daughter, the gate to Lace, the Bellshrine", "https://www.neoseeker.com/hollow-knight-silksong/Deep_Docks"], ["Wiki · Weaver Burial Spires", "https://hollowknight.wiki/w/Weaver_Burial_Spire"], ["Wiki · Bellshrines", "https://hollowknight.wiki/w/Bench_(Silksong)"]],
      rows: [
        ["route-docks-enter", ["route"], "Enter Deep Docks from the Marrow", "With the Bell Beast free, cross the north of the Marrow to its southeast exit, which opens straight onto the Deep Docks. Lava here hurts badly, and hot Flintstone floors burn you if you stand on them, so keep hopping as you cross. Buy the area map from Shakra and open the Bellway as you pass (rows below).", {"reference": "https://hollowknight.wiki/w/Deep_Docks"}],
        ["ability-swift-step", ["ability"], "Learn Swift Step at the Deep Docks Weaver spire", "Climb to the Weaver Burial Spire in the northernmost part of the Docks and Bind the Weaver there. Tap the sprint button to dash, on the ground or in mid-air; hold it to run fast and jump farther. The longest gaps from here on take a running jump finished with a dash.", {"reference": "https://hollowknight.wiki/w/Swift_Step"}],
        ["route-forge-daughter", ["route"], "Open Forge Daughter's shop", "From the bottom of Shakra's shaft, go right: a lever in the middle of the floor drops you into a bunker. Work down and right to the arena that locks you in and beat every wave. Then climb back to the gated bench, pull its lever and go right to Forge Daughter, who builds tools for Rosaries and Craftmetal. Her Sting Shard, Magma Bell and Crafting Kit come to 430 Rosaries and two Craftmetals.", {"reference": "https://hollowknight.wiki/w/Forge_Daughter"}],
        ["boss-lace-docks", ["boss"], "Duel Lace above Forge Daughter", "Above the bench by Forge Daughter the way right is shut: sprint from the bottom left of the room and jump to the lever in the upper right to open it. Lace waits beyond, with lava on both sides. Jump her long lunge and strike as she lands, and don't hit her while she holds her pin up on guard, which sets off a flurry. From halfway, a white circle marks where her whirlwind will land; get out of it. Fight her on this visit: if you travel on to the regions beyond the Far Fields before you do, the Docks duel never happens.", {"reference": "https://hollowknight.wiki/w/Lace"}],
        ["route-docks-shrine", ["bellshrine"], "Ring the Bellshrine after Lace", "In the room past her arena, strike the lever on the floor: the bell rings, a bench rises and the gate on the right opens. Rest, then sprint through the gate and dash across the lava gap into the Far Fields.", {"reference": "https://hollowknight.wiki/w/Far_Fields"}],
      ],
    },
    {
      title: "Forge purchases",
      location: "Deep Docks",
      compact: true,
      rows: [
        ["kit-forge-daughter", ["kit"], "Buy Forge Daughter's Crafting Kit", "It costs 180 Rosaries at her workshop and makes your damage-dealing red and blue tools hit harder.", {"reference": "https://hollowknight.wiki/w/Tool_Pouch_%26_Crafting_Kit"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Deep Docks",
      location: "Deep Docks",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      sources: [["Wiki · flea locations", "https://hollowknight.wiki/w/Flea"], ["Neoseeker · the flea past Swift Step, the hidden flea, the Spool Fragment room", "https://www.neoseeker.com/hollow-knight-silksong/Deep_Docks"], ["Neoseeker · the Craftmetal chest from the Far Fields side", "https://www.neoseeker.com/hollow-knight-silksong/Far_Fields"], ["Wiki · Craftmetal locations", "https://hollowknight.wiki/w/Craftmetal"], ["Wiki · Shakra's Docks map and Bone Bottom ledge", "https://hollowknight.wiki/w/Shakra"], ["Wiki · Simple Key locks", "https://hollowknight.wiki/w/Simple_Key_(Silksong)"]],
      rows: [
        ["tool-sting-shard", ["tool"], "Sting Shard", "Forge Daughter builds it for 140 Rosaries and a Craftmetal. It's a red tool: a hanging trap of blades that stabs whatever touches it, and bursts outward if you strike it.", {"reference": "https://hollowknight.wiki/w/Sting_Shard", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477917"]}],
        ["tool-magma-bell", ["tool"], "Magma Bell", "Forge Daughter builds it for 110 Rosaries and a Craftmetal. It's a blue tool that softens fire and lava damage and lets you stand on hot floors a little longer.", {"reference": "https://hollowknight.wiki/w/Magma_Bell", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477918"]}],
        ["spool-fragment-2", ["spool-fragment"], "Spool Fragment · Deep Docks", "Leave Forge Daughter's workshop by the southwest exit and go down the shaft; the first door east opens onto a big room with a burning floor. Keep hopping, hit the lever at the far side to shift the platforms, then climb them back to the fragment.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477926"]}],
        ["craftmetal-3", ["craftmetal"], "Craftmetal · Deep Docks", "Once you're through to the Far Fields, find the dark tunnel at the foot of the windy shaft below Shakra's room there (the Warding Bell row). Break the false wall at its lower left and you're in the lowest room of the Docks. Work down and left past the bombers, smash the wooden beams on the lower path to open the upper one, and follow it left to a chest. Opening it brings two bomb-throwing flyers down on you.", {"reference": "https://www.neoseeker.com/hollow-knight-silksong/Far_Fields", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477937"]}],
        ["flea-deep-docks", ["flea"], "Lost Flea in upper Deep Docks", "From the Swift Step spire, sprint left along the moving platforms to the far wall. Hit the lever there to lower a weight, ride it up and jump to the ledge above, where the flea waits.", {"reference": "https://www.neoseeker.com/hollow-knight-silksong/Deep_Docks", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477916"]}],
        ["flea-deep-docks-bellway", ["flea"], "Lost Flea behind the Deep Docks Bellway", "In the Deep Docks Bellway station, break the wall on the left. In the hidden room behind it, time your crossing of the lavafalls and follow the upper platforms right through them to the flea. Walk on past it and the floor gives way, an easy way out.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477907"]}],
        ["map-deep-docks", ["map"], "Get the Deep Docks map", "Shakra waits low in a tall shaft of the Docks, and a ring hanging in the shaft means she's near. The map costs 50 Rosaries. If you miss her, she sells it at her Bone Bottom ledge once you've rung the Docks Bellshrine.", {"reference": "https://hollowknight.wiki/w/Shakra"}],
        ["bellway-deep-docks", ["bellway"], "Open Deep Docks Bellway", "The station is the room beside Shakra's shaft. Pay its toll machine 40 Rosaries to add the stop.", {"reference": "https://hollowknight.wiki/w/Fast_Travel_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477905"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Far Fields",
      location: "Far Fields",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      sources: [["Neoseeker · the dark tunnel below Shakra's Far Fields room", "https://www.neoseeker.com/hollow-knight-silksong/Far_Fields"]],
      rows: [
        ["tool-warding-bell", ["tool"], "Warding Bell", "In the Far Fields, drop down the right side of the windy shaft below Shakra's room and go left into a dark tunnel. Jump up toward the light to a dead Smelt Shoveller and take its bell. It's a blue tool that blocks damage while you Bind.", {"reference": "https://hollowknight.wiki/w/Warding_Bell", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477935"]}],
      ],
    },
  ],
} satisfies RawChapter;
