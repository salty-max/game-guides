import type { RawChapter } from "@hundo/core/types";

export default {
  id: 2,
  title: "The Forges at Deep Docks",
  region: "Deep Docks · Far Fields approach",
  teaser: "Deep Docks",
  intro: "Learn to dash and open the road through the foundries. Come back for the lower forge passages after you can handle longer gaps.",
  sources: [["Deep Docks", "https://hollowknight.wiki/w/Deep_Docks"], ["Lace", "https://hollowknight.wiki/w/Lace"], ["Swift Step", "https://hollowknight.wiki/w/Swift_Step"], ["Forge Daughter", "https://hollowknight.wiki/w/Forge_Daughter"], ["Route reference", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "The upper foundry",
      location: "Deep Docks",
      rows: [
        ["route-docks-enter", ["route"], "Enter Deep Docks from the Marrow", "Follow the route east into the lava foundry. Buy the area map from Shakra, open the Bellway, and use a bench before crossing the suspended platforms. Wait for the moving lifts to return after hazards block your approach."],
        ["ability-swift-step", ["ability"], "Learn Swift Step at the Deep Docks Weaver shrine", "Explore the upper Deep Docks through the suspended platforms and climb to the Weaver Burial Spire. Bind at the shrine. Short taps give you a dash on the ground or in the air. Hold the dash input to sprint on the ground."],
        ["route-forge-daughter", ["route"], "Open Forge Daughter's shop", "Find the workshop below Lace's arena, near the upper foundry paths. Budget up to 430 Rosaries for her two counted tools and Crafting Kit, plus two Craftmetals. The tools are permanent once made."],
        ["boss-lace-docks", ["boss"], "Duel Lace above Forge Daughter", "Enter the chamber north of the workshop. Give her room to finish lunges and step back if she stops to parry. When she takes to the air, wait for the landing before chasing. Use a short punish so you can get out of the next dash."],
        ["route-docks-shrine", ["bellshrine"], "Ring the Bellshrine after Lace", "Go past the duel arena, strike the lever at the large bell, and keep going toward the Far Fields. This is the shrine the Grand Gate objective lists on the Far Fields route. Use Swift Step to clear the lava gap beyond it."],
      ],
    },
    {
      title: "Forge purchases",
      location: "Deep Docks",
      compact: true,
      rows: [
        ["kit-forge-daughter", ["kit"], "Buy Forge Daughter's Crafting Kit", "Pay 180 Rosaries at the workshop below Lace's arena. The Crafting Kit increases damage for affected tools."],
      ],
    },
    {
      title: "Collectibles and unlocks · Deep Docks",
      location: "Deep Docks",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-sting-shard", ["tool"], "Sting Shard", "Bring Forge Daughter 140 Rosaries and a Craftmetal in her shop beneath Lace's arena.", {"reference": "https://hollowknight.wiki/w/Sting_Shard", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477917"]}],
        ["tool-flintslate", ["tool"], "Flintslate", "From the lowest Far Fields entrance, travel west into the tall hanging-platform room. Climb the platforms and take the Flintslate from the workbench.", {"reference": "https://hollowknight.wiki/w/Flintslate", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477986"]}],
        ["tool-magma-bell", ["tool"], "Magma Bell", "Bring Forge Daughter 110 Rosaries and one Craftmetal to commission the bell.", {"reference": "https://hollowknight.wiki/w/Magma_Bell", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477918"]}],
        ["spool-fragment-2", ["spool-fragment"], "Spool Fragment · Deep Docks", "Follow the long foundry room marked on the map to its far end and pick up the fragment.", {"reference": "https://hollowknight.wiki/w/Spool_Fragment", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477926"]}],
        ["craftmetal-3", ["craftmetal"], "Craftmetal · Deep Docks", "Break the blockade and open the chest it hides. A projectile from a nearby explosive enemy can help clear the barrier.", {"reference": "https://hollowknight.wiki/w/Craftmetal", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477937"]}],
        ["flea-deep-docks", ["flea"], "Lost Flea in upper Deep Docks", "Hit the lever on the lower side first. Dash up through the resulting opening and climb to the high cage.", {"reference": "https://hollowknight.wiki/w/Flea", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477916"]}],
        ["map-deep-docks", ["map"], "Get the Deep Docks map", "Follow the rings to Shakra on the foundry path, or visit her later for the map. The map costs 50 Rosaries.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
        ["bellway-deep-docks", ["bellway"], "Open Deep Docks Bellway", "Find the station mechanism and pay 40 Rosaries to unlock this stop.", {"reference": "https://hollowknight.wiki/w/Bellway#Bellways", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477905"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Far Fields",
      location: "Far Fields",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-warding-bell", ["tool"], "Warding Bell", "Search the dead Smelt Shoveller by the bottom entrance from Far Fields into Deep Docks.", {"reference": "https://hollowknight.wiki/w/Warding_Bell", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477935"]}],
      ],
    },
  ],
} satisfies RawChapter;
