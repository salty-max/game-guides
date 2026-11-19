import type { RawChapter } from "@hundo/core/types";

export default {
  id: 10,
  title: "Through the Abyss",
  region: "Grand Bellway · Ruined Chapel · Deep Docks · The Abyss",
  teaser: "The Abyss",
  intro: "Restore travel, take the diving bell, and bring back the ability that opens Pharloom's highest paths.",
  sources: [["Beast in the Bells", "https://hollowknight.wiki/w/Beast_in_the_Bells"], ["The Abyss (Silksong)", "https://hollowknight.wiki/w/The_Abyss_(Silksong)"], ["Silk Soar", "https://hollowknight.wiki/w/Silk_Soar"], ["Farsight", "https://hollowknight.wiki/w/Farsight"], ["Route reference", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "A changed Pharloom and the diving bell",
      location: "Grand Bellway · Bone Bottom · Deep Docks",
      rows: [
        ["boss-bell-eater", ["boss"], "Defeat Bell Eater to restore the Bellways", "Reload after Snared Silk and go to a Bellway. Follow the Beast in the Bells objective into the tunnels. Read the attack from the disturbed floor, then strike while Bell Eater is above ground. Return to the station after the fight."],
        ["wish-ruined-chapel", ["quest"], "Meet the Snail Shamans at the Ruined Chapel", "Follow the Caretaker's lead from Songclave back toward the chapel by Bone Bottom. Speak to the Shamans and follow The Dark Below to Deep Docks."],
        ["route-diving-bell", ["route"], "Get Ballow's key and ride the diving bell", "Speak to Ballow in Deep Docks, then descend to the diving bell in the lower foundry. With the key, operate the bell to enter the Abyss. Bring your preferred Crest and tools. The first descent cannot be reversed at the bell."],
      ],
    },
    {
      title: "Weavenest Absolom and the escape",
      location: "The Abyss",
      rows: [
        ["ability-silk-soar", ["ability"], "Learn Silk Soar inside Weavenest Absolom", "Follow the lower route into the Weaver structure and reach the ability shrine. Bind to learn it. Hold Down plus the harpoon input and release after charging. Use it beneath the old lift openings to climb."],
        ["pickup-farsight", ["pickup"], "Take the Farsight from the upper east Absolom passage", "Explore the upper eastern branch before leaving the Abyss. Take the item and open the nearby map tablet if needed. Missed items can be collected once the diving bell is usable again later."],
        ["route-abyss-escape", ["route"], "Escape to Deep Docks with Silk Soar", "Use Silk Soar up through the marked openings and climb as the route collapses behind you. Get out of each movement sequence before pausing. Return to the Shamans and get Elegy of the Deep so you can enter the heart memories."],
        ["route-farsight-bellhome", ["route"], "Build the Farsight in the Bellhome", "Go back to your unlocked Bellhome in Bellhart and construct the Farsight. It displays your in-game percentage and helps identify missing entries when viewing your inventory."],
      ],
    },
    {
      title: "Silk Soar revisits",
      location: "Ruined Chapel · Weavenest Atla",
      compact: true,
      rows: [
        ["crest-shaman", ["crest"], "Bind the Shaman Crest above the Ruined Chapel", "Enter the Shamans' room. Before the Flickering Flame tablet, charge Silk Soar to reach the ceiling passage. Break through the closed walls and Bind at the large shell."],
        ["wish-eva-vesticrest", ["quest"], "Upgrade the Vesticrest with Eva", "Visit Eva with 12 eligible unlocked slots for the yellow Vesticrest slot, 20 for the blue slot, and 27 for the second Hunter Crest upgrade. Slots opened on Hunter do not count toward these thresholds."],
        ["ability-sylphsong", ["ability"], "Bind Eva in Weavenest Atla to learn Sylphsong", "Unlock at least 32 slots across Crests other than Hunter, counting inherent slots and those opened with Memory Lockets. Return to Eva in Atla and accept her offer. If short, unlock the Shaman Crest and spend your spare Lockets on the other Crests.", {"reference": "https://hollowknight.wiki/w/Eva"}],
        ["challenge-curvesickle", ["challenge"], "Clear the Far Fields Curveclaw target room", "In Act 3, take the updraft above the Far Fields Bellway, then head right to the practice room with Curveclaw equipped. Remove Pollip Pouch first. Hit every target in a single throw and let the scout take the tool. Use a bench and return to pick up Curvesickle, which restores the slot's percentage point.", {"reference": "https://hollowknight.wiki/w/Curveclaw"}],
        ["wish-advanced-alchemy", ["quest"], "Continue Zylotol's Advanced Alchemy in Act 3", "Return to the Wormways after Alchemist's Assistant. Read the new Wish and follow it into the Plasmium rooms. Use the phial for the requested Alchemy work."],
        ["boss-plasmified-zango", ["boss"], "Defeat Plasmified Zango in the western Wormways", "Follow the Advanced Alchemy chain into the secret western room. Clear the spreading Plasmium hazards and defeat Zango.", {"reference": "https://hollowknight.wiki/w/Plasmified_Zango"}],
      ],
    },
    {
      title: "Collectibles and unlocks · Brightvein",
      location: "Brightvein",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["mask-shard-20", ["mask-shard"], "Mask Shard · Brightvein", "Climb Mount Fay's Brightvein branch after learning Silk Soar. Use the rising line from the high cave to reach the uppermost shard.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479460"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Bellhart",
      location: "Bellhart",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memory-locket-bellhart-2", ["memory-locket"], "Memory Locket · Bellhart (#2)", "Stand under the town roof opening and Silk Soar into the hidden upper space for the locket.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478212"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Whiteward",
      location: "Whiteward",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["relic-choral-commandment-whiteward-2", ["relic"], "Choral Commandment · Whiteward (#2)", "Use Silk Soar to reach the high room above Whiteward's hidden passage. Search the far end for the Choral Commandment.", {"reference": "https://hollowknight.wiki/w/Items_(Silksong)#Tradables", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478919"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · High Halls",
      location: "High Halls",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["relic-rune-harp-high-halls", ["relic"], "Rune Harp · High Halls", "Return to Conductor Ballador's room during Act 3 and look for the Rune Harp.", {"reference": "https://hollowknight.wiki/w/Items_(Silksong)#Tradables", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479495"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · The Abyss",
      location: "The Abyss",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["relic-arcane-egg", ["relic"], "Arcane Egg", "Complete the mapped side platforming sequence below the Deep Docks for the Arcane Egg.", {"reference": "https://hollowknight.wiki/w/Items_(Silksong)#Tradables", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479281"]}],
        ["map-the-abyss", ["map"], "Get the The Abyss map", "Read the map tablet in the Abyss during the first dive, before using the escape route.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
      ],
    },
  ],
} satisfies RawChapter;
