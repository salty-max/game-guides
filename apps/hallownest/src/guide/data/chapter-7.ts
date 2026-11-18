import type { RawChapter } from "@hundo/core/types";

export default {
  id: 7,
  title: "Kingdom’s Edge and the Abyss",
  region: "City of Tears · Kingdom’s Edge · Ancient Basin",
  teaser: "Kingdom’s Edge",
  intro: "Open the east City routes, gain the King’s Brand and return to the Basin for the shadow dash. Save a second visit for routes that depend on the Love Key or Isma’s Tear.",
  sources: [["Eastern City, Kingdom’s Edge and Abyss route", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Kingdom’s Edge entrances", "https://hollowknight.wiki/w/Kingdom%27s_Edge"], ["Shadow gates and Brand", "https://hollowknight.wiki/w/Abyss"]],
  groups: [
    {
      title: "King’s Station and the Watcher’s Spire",
      location: "City of Tears",
      rows: [
        ["route-east-city", ["route"], "Reach the City’s eastern half", "Use a working tram to the Ancient Basin if starting in Deepnest, then climb the ruined shaft to the City. You can also use the opened Waterways and east City connections. Follow the lower corridors east to King’s Station."],
        ["stag-kings-station", ["stag"], "Open King’s Station", "Follow the station sign on the eastern edge of the City and pay 300 Geo. The lower flooded station room contains a hidden passage to Kingdom’s Edge through the water."],
        ["route-watcher-spire", ["route"], "Climb the Watcher’s Spire and drop the chandelier", "Take the tower route up from the east City. Use Monarch Wings to reach the upper ledge. Before entering the fight, break the ceiling on the way to the arena and cut the chandelier rope to remove one knight."],
        ["boss-watcher-knights", ["boss", "percent-boss"], "Defeat the Watcher Knights", "Stay near the center and read whether each roll bounces or travels straight. When two are active, line up a spell to strike both. Descending Dark gives you an opening if both close in. Heal between reinforcements when safe."],
        ["dreamer-lurien", ["dreamer"], "Reach Lurien above the Watcher Knights", "Take the elevator beyond the arena to the upper room. Dream Nail Lurien and finish the dream interaction. Return to King’s Station for the eastern caves."],
      ],
    },
    {
      title: "The upper cliffs and the Brand",
      location: "Kingdom’s Edge",
      rows: [
        ["route-edge-tunnel", ["route"], "Enter Kingdom’s Edge through the flooded station route", "Find the unlit lower station room near King’s Station. Swim to the right under the low wall and follow the tunnel. Climb into the ash-filled vertical cavern."],
        ["map-kingdoms-edge", ["map"], "Buy Cornifer’s Kingdom’s Edge map", "Find the humming cartographer in a pipe off the lower-west side of the main vertical cavern. Take the map for 112 Geo and follow the cliff paths upward."],
        ["nail-art-oro", ["nail-art"], "Learn Dash Slash from Nailmaster Oro", "Head to the far southeast on the long Kingdom’s Edge road. Reach Oro’s house beyond the hoppers and pay 800 Geo. Practice holding the attack, dashing and releasing the charge."],
        ["boss-hornet-sentinel", ["boss", "percent-boss"], "Defeat Hornet at Kingdom’s Edge", "Reach the upper-east arena via the cliffs. Avoid the lunge recovery traps and knock hanging spike balls away before they fill the arena. Save SOUL for windows when she pauses or for Descending Dark if you need space."],
        ["equipment-kings-brand", ["equipment"], "Collect King’s Brand from the Cast-Off Shell", "Go deeper into the shell beyond Hornet and take the Brand. Follow the exit as the shell shakes, then return to the Ancient Basin. The Brand opens the sealed door at its bottom."],
      ],
    },
    {
      title: "Beyond the Basin door",
      location: "The Abyss",
      rows: [
        ["route-abyss-door", ["route"], "Open the Abyss with King’s Brand", "Descend from the Basin’s main shaft to the large sealed door and let it recognise the Brand. Descend carefully and use the ledges to avoid unnecessary fall-backtracking."],
        ["equipment-shade-cloak", ["equipment"], "Collect Shade Cloak across the Void lake", "At the bottom, travel east and climb the lighthouse to turn on the light. Cross the now-safe lake with Crystal Heart, then stand in the bowl at the end to upgrade your dash. Practice dashing through a shade gate before leaving."],
        ["spell-abyss-shriek", ["spell"], "Upgrade Howling Wraiths to Abyss Shriek", "Stand in the western room at the Abyss floor and cast Howling Wraiths upward among the faces on the raised platform. If you skipped the Overgrown Mound in chapter 5, get its spell first."],
        ["warrior-dream-markoth", ["warrior-dream"], "Defeat Markoth in the eastern cliff grave", "Now you have Shade Cloak, return to the eastern Kingdom’s Edge shade gate and Dream Nail the grave. Land on the platforms between attacks and use spells while he holds position. Claim 250 Essence."],
      ],
    },
    {
      title: "High ledges and secret rooms in the East",
      location: "Kingdom’s Edge · City of Tears",
      sources: [["Kingdom’s Edge and eastern City collectibles", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Vessel locations", "https://teemo.dev/game-design/hollow-knight/systems/collectibles-and-completion-reference/"]],
      compact: true,
      rows: [
        ["charm-quick-slash", ["charm"], "Find Quick Slash near Oro’s hut", "Check the ruined side passage on the lower Kingdom’s Edge road near Nailmaster Oro. Break the fragile floor east of the hut to get into the hidden lower network, then reach the room with the dead Ancient Nailsmith for the charm."],
        ["vessel-fragment-kings-station", ["vessel-fragment"], "Collect the fragment above King’s Station", "Climb the shaft in the City above the station. Check the high ledge near the elevator for the fragment."],
      ],
    },
    {
      title: "East City and Kingdom’s Edge jars",
      location: "City of Tears · Kingdom’s Edge",
      note: "For a late sweep, use the Collector’s Map to check which jars remain. Follow the landmark for each individual jar.",
      sources: [["Kingdom’s Edge and east City jar route", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"]],
      map: ["ScriptersWar", "https://scripterswar.com/hollowknight/map"],
      compact: true,
      rows: [
        ["grub-city-belfly", ["grub"], "Free the Grub below the Belfly ledge", "From the flooded lower King’s Station entrance, swim underneath the low wall to the east. Take the jar on the recessed ledge before the passage opens onto Kingdom’s Edge. Watch for Belflies launching from the ceiling."],
        ["grub-edge-cracked-wall", ["grub"], "Free the Grub behind the low eastern wall", "From the tall east-side Kingdom’s Edge shaft, take the lower fork of the room to the right. Look for a cracked wall at the bottom of the right side and climb behind it to the jar."],
        ["grub-edge-oro", ["grub"], "Free the Grub below the brittle floors beside Oro", "Go east of Oro’s hut and break the shaking floor, then use more downward spells on the fragile floors below. At the bottom take the route east past Great Hoppers and spikes to the jar."],
        ["grub-city-great-husk", ["grub"], "Free the Grub behind the Great Husk Sentry", "Exit King’s Station to the west at the lower level, then use the door on the raised platform directly above that exit. Defeat the Great Husk Sentry in the room and break the jar."],
        ["grub-city-watcher", ["grub"], "Free the Grub on the Watcher’s Spire side route", "Climb the eastern City tower and open the levers on the way. Take the upper-right exit and climb through the right-hand ceiling opening before continuing to the Watcher Knights."],
      ],
    },
  ],
} satisfies RawChapter;
