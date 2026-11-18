import type { RawChapter } from "@hundo/core/types";

export default {
  id: 6,
  title: "Deepnest and the Tram",
  region: "Fungal Wastes · Deepnest · Beast’s Den",
  teaser: "Deepnest",
  intro: "Open a western route into Deepnest, find the Tram Pass and reach the den. Pack the Lumafly Lantern before the dark rooms.",
  sources: [["Deepnest approach and den", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Deepnest encounters and routes", "https://hollowknight.wiki/w/Deepnest"], ["Tram access", "https://hollowknight.wiki/w/Tram_Pass"]],
  groups: [
    {
      title: "Enter Deepnest from the Mantis Village",
      location: "Mantis Village · West Deepnest",
      rows: [
        ["boss-mantis-lords", ["boss", "percent-boss"], "Defeat the Mantis Lords", "In the chamber below the village, challenge the seated lords. Jump across the ground dash and watch wall throws. The later pair alternate attacks, so make one short punish at a time. Claim the opened Deepnest door."],
        ["charm-mark-of-pride", ["charm"], "Enter the guarded village treasury for Mark of Pride", "After the lords bow, return to the village route and pass the guard who now opens the room. Open the chest for the charm and check the neighboring chests."],
        ["map-deepnest", ["map"], "Buy Cornifer’s Deepnest map", "Beyond the Mantis Lords door, look for Cornifer hiding close to the eastern approach. His location can depend on which entrance you take. Use the hum and paper trail or purchase it from Iselda later."],
        ["route-hot-spring", ["route"], "Find the Deepnest hot spring", "Take the lower routes across the dark maze, probing walls on cramped ledges. Rest at the Hot Spring near the lower passages. The bench is a useful return point before Nosk, the tram and the upper maze."],
        ["quest-quirrel-deepnest", ["quest"], "Talk to Quirrel at the Deepnest hot spring", "Check the Hot Spring after entering Deepnest. Let him finish his dialogue before heading into lower tunnels. If he has moved on, keep going with the route."],
        ["warrior-dream-galien", ["warrior-dream"], "Defeat Galien below the Failed Tramway", "Take the western passages off the Hot Spring’s upper route into the cave with the large body. Dream Nail Galien. Keep moving under the large spinning blade and punish from farther away when the small ones appear. Claim 200 Essence."],
        ["pickup-tram-pass", ["pickup"], "Collect the Tram Pass in the Failed Tramway", "Climb into the Failed Tramway above Deepnest. Activate the bench near the entrance and cross the Dirtcarver rooms to the broken tram car at the far end. Pick up the pass inside the car."],
        ["quest-zote-deepnest", ["quest"], "Cut Zote free in upper Deepnest", "After the Greenpath rescue, search the webbed rooms below the Failed Tramway. Loop around the adjacent vertical passages to reach the captive from the opposite side, cut his bindings and speak to him."],
        ["boss-nosk", ["boss", "percent-boss"], "Defeat Nosk in the hidden lair", "From the Hot Spring, go west and inspect the breakable walls on the side route. Follow the figure into the arena. Use the central platform as cover against the ground charge, move away from ceiling drops, then take the passage beyond."],
      ],
    },
    {
      title: "Distant Village and the Beast’s Den",
      location: "Distant Village",
      rows: [
        ["stag-distant-village", ["stag"], "Open Distant Village’s Stag Station", "From the Hot Spring, continue through the westward passages toward the houses. Find the Stag Station in the upper part of the village and pay 250 Geo. Rest there before entering the den."],
        ["route-beasts-den", ["route"], "Enter the Beast’s Den and find the upper exit", "Enter the building where residents tell you to rest. Sitting on the bench triggers the trap. Break out and use the Lantern to navigate the webbed passages, checking upper side rooms before passing through the exit tunnel."],
        ["dreamer-herrah", ["dreamer"], "Reach Herrah in the Beast’s Den", "Find Herrah in the upper chamber, use the Dream Nail and complete the dream interaction. Follow the opened route back out of the den and take the Stag onward."],
      ],
    },
    {
      title: "Deepnest’s movement detours",
      location: "Deepnest",
      sources: [["Mawlek, tram and Deepnest return pickups", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Gear and piece locations", "https://teemo.dev/game-design/hollow-knight/systems/collectibles-and-completion-reference/"]],
      compact: true,
      rows: [
        ["pale-ore-nosk", ["pale-ore"], "Take the Pale Ore behind Nosk", "Use the far exit from Nosk’s arena and take the ore in the chamber beyond. A breakable shortcut reconnects the approach to the Hot Spring."],
        ["charm-sharp-shadow", ["charm"], "Return through the Deepnest shade gate for Sharp Shadow", "From the lower Deepnest route near the working tram, find the shade gate. Return after earning Shade Cloak and cross the room of fast Garpedes and spikes to claim the charm."],
        ["charm-weaversong", ["charm"], "Find Weaversong in the Weavers’ Den", "Climb into the hidden upper-side room near the approach to Distant Village. Break through the concealed wall and search past the webbed passages for the charm."],
        ["vessel-fragment-deepnest-tram", ["vessel-fragment"], "Collect the Vessel Fragment above the Deepnest tram", "Climb the rooms above the working tram and down-strike the Garpedes to cross the spike passages. Bounce off the vertical Garpede into the upper-left corridor for the fragment."],
        ["mask-shard-fungal-core", ["mask-shard"], "Drop from the Fungal Core to the Deepnest Mask Shard", "With Wings, enter the high Fungal Core passage from Fungal Wastes, west of Mantis Village. Descend through its floor connection into Deepnest to reach the isolated shard."],
      ],
    },
    {
      title: "Deepnest jars",
      location: "Deepnest",
      note: "For a late sweep, use the Collector’s Map to check which jars remain. Follow the landmark for each individual jar.",
      sources: [["Deepnest den, shaft and mimic jar routes", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"]],
      map: ["ScriptersWar", "https://scripterswar.com/hollowknight/map"],
      compact: true,
      rows: [
        ["grub-deepnest-mimics", ["grub"], "Free the real Grub in the four-jar room", "Near the eastern Deepnest entrance below the Fungal Wastes, reach the side passage off the falling shaft and break through the wall. The third jar from the entrance holds the real Grub. The others are mimics."],
        ["grub-deepnest-den", ["grub"], "Free the Grub inside the Beast’s Den", "While working through the den’s upper corridors toward Herrah, take the connected webbed alcove off the climbing route to the jar."],
        ["grub-deepnest-floor", ["grub"], "Free the Grub beneath the collapsing floor", "On the route between Distant Village and the lower Deepnest rooms, pass the Stalking Devout corridor and fall through the breakable floor. Free the jar in the small chamber below."],
        ["grub-deepnest-zote", ["grub"], "Free the Grub below the Zote route", "From the room with Zote’s web trap, loop toward the western passage and drop to the next room. The jar is immediately to the left before the spike floor."],
        ["grub-deepnest-nosk", ["grub"], "Free the Grub on the Nosk approach", "From the Deepnest Hot Spring, go west. Charge Crystal Heart from the high side to reach the cracked wall across the room. Open it and drop to the jar before taking the hidden route farther."],
      ],
    },
  ],
} satisfies RawChapter;
