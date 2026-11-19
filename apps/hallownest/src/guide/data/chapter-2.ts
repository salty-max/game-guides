import type { RawChapter } from "@hundo/core/types";

export default {
  id: 2,
  title: "Greenpath and the First Dash",
  region: "Greenpath · Fog Canyon · Queen’s Station",
  teaser: "Greenpath",
  intro: "Cross Greenpath and beat Hornet for the Mothwing Cloak, then go down through Fog Canyon to Queen’s Station. Free Zote and talk to Quirrel at the station while you’re here: both chances close later.",
  sources: [["Steam guide ch 2–3 · Greenpath, Hornet and the way on", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Wiki · Greenpath, the Lake of Unn and the Fog Canyon side", "https://hollowknight.wiki/w/Greenpath"]],
  groups: [
    {
      title: "Through the leafy road",
      location: "Greenpath · Forgotten Crossroads",
      sources: [["Steam guide ch 2–3 · Cornifer, Zote, the Stagway, Hornet and Quirrel by the lake", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Steam guide ch 5 · Salubra’s hut by the Gruz Mother’s arena", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Steam guide ch 13 · the way into the Thorns of Agony corridor", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Wiki · Cornifer’s Greenpath map price", "https://hollowknight.wiki/w/Cornifer"], ["Wiki · Zote and the Vengefly King", "https://hollowknight.wiki/w/Zote_the_Mighty"], ["Wiki · Stag tolls", "https://hollowknight.wiki/w/Fast_Travel_(Hollow_Knight)"], ["Wiki · Hornet’s needle throw", "https://hollowknight.wiki/w/Hornet_Protector"], ["Wiki · Mothwing Cloak", "https://hollowknight.wiki/w/Mothwing_Cloak"], ["Wiki · Quirrel by the Lake of Unn", "https://hollowknight.wiki/w/Quirrel"], ["Wiki · Thorns of Agony’s thorn maze (map read in the browser)", "https://hollowknight.wiki/w/Thorns_of_Agony"], ["Wiki · Salubra’s shop and how to reach it", "https://hollowknight.wiki/w/Charm_Lover_Salubra"]],
      rows: [
        ["map-greenpath", ["map"], "Buy Cornifer’s Greenpath map", "Past the Elder Baldur, head down and right, following the scattered papers and the humming to Cornifer. His map costs 60 Geo."],
        ["quest-zote-greenpath", ["choice"], "Free Zote from the Vengefly King", "In the north of Greenpath, beyond the room where a Moss Knight locks you in, follow the sounds of a struggle to a Vengefly King with Zote in its jaws. Kill it to free him. Do it on this trip: once you have the next movement ability after the cloak, he dies in the trap."],
        ["stag-greenpath", ["stag"], "Open the Greenpath Stag Station", "Below the Vengefly King’s room, a big room has a sign at its bottom left pointing down to the Stagway. Pay 140 Geo to open the station, and rest on its bench before you go after Hornet."],
        ["boss-hornet-protector", ["boss", "percent-boss"], "Defeat Hornet in Greenpath", "Hornet waits in a large chamber reached by the left-hand path out of that big room. Her thrown needle flies back to her, and it hurts on the way back too."],
        ["equipment-mothwing-cloak", ["equipment"], "Collect the Mothwing Cloak", "When Hornet leaves, take the cloak from the body lying in her arena. It lets you dash along the ground or in mid-air."],
        ["quest-lake-quirrel", ["quest"], "Meet Quirrel at the first Lake of Unn visit", "Past Hornet’s arena, keep left to the Lake of Unn in Greenpath’s north-west. Quirrel sits by the bench inside the stone shrine before the dock; mind the Moss Knight at the dock’s end. Talk to him now: he’s gone once you have the next movement ability."],
        ["charm-thorns-of-agony", ["charm"], "Pick up Thorns of Agony", "In the lower middle of Greenpath, the bottom exit in the east wall of a tall room opens into a corridor of thorns and Charged Lumaflies. With the cloak, dash through it to the charm at the far end."],
        ["route-salubra", ["route"], "Find Salubra’s charm shop", "Salubra’s hut is just right of the Gruz Mother’s arena in the Crossroads, above the old village, and the dash is what gets you to it. Follow the laughter in. She sells charms now, and Charm Notches once you own enough of them."],
      ],
    },
    {
      title: "Reach Queen’s Station",
      location: "Fog Canyon · Queen’s Station",
      sources: [["Wiki · Fog Canyon’s Greenpath door and the bank near the station", "https://hollowknight.wiki/w/Fog_Canyon"], ["Wiki · Queen’s Station, reached from Fog Canyon", "https://hollowknight.wiki/w/Fungal_Wastes"], ["Wiki · Massive Moss Charger, west of the Fog Canyon entrance", "https://hollowknight.wiki/w/Massive_Moss_Charger"], ["Wiki · Quirrel at Queen’s Station, and when he leaves", "https://hollowknight.wiki/w/Quirrel"], ["Wiki · Stag tolls", "https://hollowknight.wiki/w/Fast_Travel_(Hollow_Knight)"], ["Steam guide ch 3–4 · Quirrel’s first-visit rule and the Stagway platform", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Steam guide ch 13 and 19 · the drop into Fog Canyon, the canyon’s door into the station and the shard above the thorns", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"]],
      rows: [
        ["route-fog-first-trip", ["route"], "Go down through Fog Canyon to Queen’s Station", "Fog Canyon opens off the bottom of Greenpath, just east of the Massive Moss Charger’s arena: where bubbles start to line the walls, drop down into it. Work your way to the canyon’s south end, where Queen’s Station opens to the east. Leave the rest of the canyon for later."],
        ["quest-quirrel-station", ["quest"], "Talk to Quirrel at Queen’s Station", "Quirrel sits on a ledge high on the left of the station’s hall, above the way into the Stagway. Talk to him before you leave the station: he’s here only on your first visit, and not at all once you have the next movement ability."],
        ["stag-queens-station", ["stag"], "Open Queen’s Station", "The Stagway is on the station’s lowest left platform: pay 120 Geo there to open it, and rest on its bench. The Mask Shard on the hall’s right side, above the thorns, needs a later ability."],
      ],
    },
    {
      title: "Greenpath side chambers",
      location: "Greenpath",
      sources: [["Steam guide ch 2 · the Hunter’s door", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Steam guide ch 13 · past the Moss Charger to the fragment", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Wiki · the Hunter’s Journal", "https://hollowknight.wiki/w/Hunter%27s_Journal_(Hollow_Knight)"], ["Wiki · Vessel Fragment locations and requirements", "https://hollowknight.wiki/w/Vessel_Fragment"], ["Wiki · Massive Moss Charger", "https://hollowknight.wiki/w/Massive_Moss_Charger"]],
      compact: true,
      rows: [
        ["pickup-hunter-journal", ["pickup"], "Receive the Hunter’s Journal", "One room below Cornifer, a doorway on the right is framed by big grey teeth. Follow it to the Hunter and hear him out; he leaves his journal on the ground for you. Kills fill it in."],
        ["vessel-fragment-greenpath", ["vessel-fragment"], "Collect the Vessel Fragment on the lower Greenpath route", "The fragment hides above the west end of a long corridor beyond the Massive Moss Charger’s arena, west of the Fog Canyon drop. Beat the Charger, follow the corridor to its end, then jump up through the ceiling and go right."],
      ],
    },
    {
      title: "Greenpath’s early jars and one Crossroads return",
      location: "Greenpath · Forgotten Crossroads",
      sources: [["Steam guide ch 2–3 · the first Greenpath jars and the dash ledge", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Wiki · Grub locations", "https://hollowknight.wiki/w/Grub"], ["Wiki · the Grubfather’s Mask Shard", "https://hollowknight.wiki/w/Mask_Shard_(Hollow_Knight)"], ["Wiki · Grubhome in the north-west Crossroads", "https://hollowknight.wiki/w/Forgotten_Crossroads"]],
      map: ["ScriptersWar", "https://scripterswar.com/hollowknight/map"],
      compact: true,
      rows: [
        ["grub-greenpath-cornifer", ["grub"], "Free the Grub above Cornifer in Greenpath", "Above Cornifer’s spot, knock down the moss block in the way and climb to the jar."],
        ["grub-greenpath-moss-knight", ["grub"], "Free the Grub behind the second Moss Knight", "This jar is on the right side of the big room above the Stag Station, behind a Moss Knight. Beat the knight to reach it."],
        ["grub-crossroads-ledge", ["grub"], "Dash to the Crossroads Grub ledge", "The jar waits on a high ledge just off the Crossroads’ main shaft, in the first opening on its right side below the passage from the well. Climb the small platforms in there and dash the gap a jump can’t clear."],
        ["mask-shard-grubfather-five", ["mask-shard"], "Claim Grubfather’s Mask Shard at five rescues", "With five jars broken, visit the Grubfather at his home in the north-west Crossroads. He rewards you with a Mask Shard."],
      ],
    },
  ],
} satisfies RawChapter;
