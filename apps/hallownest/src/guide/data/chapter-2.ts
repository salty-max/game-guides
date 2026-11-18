import type { RawChapter } from "@hundo/core/types";

export default {
  id: 2,
  title: "Greenpath and the First Dash",
  region: "Greenpath · Fog Canyon · Queen’s Station",
  teaser: "Greenpath",
  intro: "Follow the leafy road and get your first dash. Help the traveller you find before leaving Greenpath if you want his full quest.",
  sources: [["Greenpath route and first Hornet encounter", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Greenpath entrances and landmarks", "https://hollowknight.wiki/w/Greenpath"]],
  groups: [
    {
      title: "Through the leafy road",
      location: "Greenpath",
      rows: [
        ["map-greenpath", ["map"], "Find Cornifer beyond the Greenpath entrance", "Follow the path through the entry caverns until you find his papers on a side ledge below the main route. Buy the map for 60 Geo and mark the route upward toward Hornet’s trail."],
        ["quest-zote-greenpath", ["quest"], "Free Zote from the Vengefly King", "On the upper Greenpath route, look for Zote in a Vengefly King’s jaws. Fight from underneath or nail-bounce over the dives. Rescue him before obtaining Mantis Claw if you want his later scenes."],
        ["quest-lake-quirrel", ["quest"], "Meet Quirrel at the first Lake of Unn visit", "Explore the stone shelter beside the Lake of Unn in western Greenpath and talk to Quirrel if he is there. The bench offers a useful checkpoint on that side of the area."],
        ["stag-greenpath", ["stag"], "Open the Greenpath Stag Station", "Follow the station sign below the Hornet arena approach and pay 140 Geo at the ticket machine. Rest on the station bench before attempting the fight."],
        ["boss-hornet-protector", ["boss", "percent-boss"], "Defeat Hornet in Greenpath", "Fight in the chamber on the northwest route. Jump her ground lunge and step out of the returning needle’s path. Punish the recovery after a lunge or a throw. Heal during a safely spaced recovery if you have SOUL."],
        ["equipment-mothwing-cloak", ["equipment"], "Collect the Mothwing Cloak", "After the fight, approach the body at the arena’s left side and pick up the cloak. Dash in the air to cross Greenpath gaps. Use a bench before changing charms."],
        ["route-salubra", ["route"], "Find Salubra beyond the village", "Use the dash to reach her hut northeast of Sly’s old room in the Crossroads. Rest on her bench. Her notch inventory unlocks as your charm collection grows."],
        ["charm-thorns-of-agony", ["charm"], "Pick up Thorns of Agony", "Revisit the eastern Greenpath side passage full of Charged Lumaflies and thorns with the cloak. Dash through gaps during safe beats and take the charm at the end."],
      ],
    },
    {
      title: "Reach Queen’s Station",
      location: "Fog Canyon · Queen’s Station",
      rows: [
        ["route-fog-first-trip", ["route"], "Descend Fog Canyon without attacking the large jellies", "From lower Greenpath, take the southern passage into Fog Canyon. Drop down the chain of jellyfish rooms and pass Millibelle’s alcove toward Queen’s Station. Leave the archive and Cornifer’s side of the canyon for a later return."],
        ["quest-quirrel-station", ["quest"], "Talk to Quirrel at Queen’s Station", "At the bottom of Fog Canyon, speak to Quirrel in the station complex if he is present. Use the bench near the Stag stop to checkpoint the next area."],
        ["stag-queens-station", ["stag"], "Open Queen’s Station", "Find the ticket machine at the bottom of the station and pay 120 Geo. The right side leads into Fungal Wastes. The mask shard over the thorns can wait until Mantis Claw."],
      ],
    },
    {
      title: "Greenpath side chambers",
      location: "Greenpath",
      sources: [["Greenpath pickups and southwest crossing", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Vessel locations", "https://teemo.dev/game-design/hollow-knight/systems/collectibles-and-completion-reference/"]],
      compact: true,
      rows: [
        ["pickup-hunter-journal", ["pickup"], "Receive the Hunter’s Journal", "Find the Hunter’s den off the early Greenpath network east of the main central routes. Follow the low opening into the creature’s chamber and accept the journal. It fills through exploration and enemy kills."],
        ["vessel-fragment-greenpath", ["vessel-fragment"], "Collect the Vessel Fragment on the lower Greenpath route", "Pass the Massive Moss Charger road toward the sealed Queen’s Gardens connection. Follow the long lower corridor west and use the ceiling opening close to the far end for the fragment. Return later if you cannot reach the ledge."],
      ],
    },
    {
      title: "Greenpath’s early jars and one Crossroads return",
      location: "Greenpath · Forgotten Crossroads",
      note: "For a late sweep, use the Collector’s Map to check which jars remain. Follow the landmark for each individual jar.",
      sources: [["First Greenpath and dash return jars", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"]],
      map: ["ScriptersWar", "https://scripterswar.com/hollowknight/map"],
      compact: true,
      rows: [
        ["grub-greenpath-cornifer", ["grub"], "Free the Grub above Cornifer in Greenpath", "After buying the map, climb above Cornifer’s ledge and use the platforms to reach the jar. Check it before following the higher Hornet trail."],
        ["grub-greenpath-moss-knight", ["grub"], "Free the Grub behind the second Moss Knight", "On the upper route just before the station descent, explore the right side of the room with the Moss Knights. Clear the guard and take the jar behind it."],
        ["grub-crossroads-ledge", ["grub"], "Dash to the Crossroads Grub ledge", "Back at the main Crossroads shaft, enter the first right passage below the well route. Jump along the small platforms and dash across to the high ledge."],
        ["mask-shard-grubfather-five", ["mask-shard"], "Claim Grubfather’s Mask Shard at five rescues", "Visit the Grubfather in the northwest Crossroads after breaking five jars. Stand close enough for the reward to land and pick it up."],
      ],
    },
  ],
} satisfies RawChapter;
