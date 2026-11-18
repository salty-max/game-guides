import type { RawChapter } from "@hundo/core/types";

export default {
  id: 5,
  title: "Royal Waterways and Ancient Basin",
  region: "Royal Waterways · Ancient Basin · Palace Grounds",
  teaser: "Ancient Basin",
  intro: "Open the sewer hatch, gain acid immunity and reach the double jump. If you want Cloth’s full fight scene, meet her in the Basin before your later garden visit.",
  sources: [["Royal Waterways route and Isma’s Grove", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Acid route", "https://hollowknight.wiki/w/Isma%27s_Tear"], ["Basin paths and services", "https://hollowknight.wiki/w/Ancient_Basin"]],
  groups: [
    {
      title: "The City hatch and Isma’s Grove",
      location: "Royal Waterways",
      rows: [
        ["route-waterways-hatch", ["route"], "Open the Royal Waterways with a Simple Key", "From the lower City corridor under Lemm’s floor, use a Simple Key on the round sewer hatch and drop below. Reserve another key for the Junk Pit later. Open the bench route before exploring the sides."],
        ["map-waterways", ["map"], "Find Cornifer on the far west side", "Follow the lower sewer west past the Flukes, then clear the Hwurm room where the gates close. Find Cornifer past it and buy the map for 75 Geo. Open the adjoining shortcut toward Fungal Wastes if you pass it."],
        ["boss-dung-defender", ["boss", "percent-boss"], "Defeat Dung Defender and open the drain", "Find the arena east of the central passage. Watch for him surfacing under you and jump or use Descending Dark for safety. After the fight, hit the large switch in the room to the right. The drain change opens the route to Isma’s Grove."],
        ["charm-defenders-crest", ["charm"], "Collect Defender’s Crest from Dung Defender", "Pick up the charm in the arena. Wear it before talking to Leg Eater for lower prices if you have yet to buy his stock. A charm change needs a bench."],
        ["boss-flukemarm", ["boss"], "Find Flukemarm in the underground Fluke chambers", "Check the breakable floor on the Waterways bench route toward the low western tunnels. Follow the tunnels to the hanging Flukemarm. Use vertical spells or a sufficiently strong Nail to clear the two spawned Flukefeys before attacking safely."],
        ["charm-flukenest", ["charm"], "Collect Flukenest after Flukemarm", "Pick up the reward left beneath the Flukemarm after the side fight."],
        ["equipment-ismas-tear", ["equipment"], "Collect Isma’s Tear at Isma’s Grove", "With the drain switch activated, follow the lower-right Waterways route and use Crystal Heart over the long spike passage. Clear the sealed room of guard bugs, then follow the platforms down into the grove and take the tear."],
      ],
    },
    {
      title: "Ancient Basin and the hidden station",
      location: "Ancient Basin",
      rows: [
        ["route-basin-descent", ["route"], "Descend the broken lift shaft to the Basin", "Return to the City’s lower east edge and descend the broken elevator shaft, working along the side passages to avoid spikes. Continue past the tram platform to the Basin’s main vertical room."],
        ["simple-key-basin", ["simple-key"], "Collect the key in the Basin Mawlurk detour", "On the approach to Broken Vessel from the bench, Crystal Dash across the spikes, then take the hole in the floor. Pass the Mawlurks and drop to the corpse inside the large dead Mawlurk."],
        ["map-ancient-basin", ["map"], "Buy Cornifer’s Basin map", "Find Cornifer below the central shaft and buy the map for 112 Geo. The lower-west route leads to an optional paid bench and your next movement upgrade."],
        ["quest-cloth-basin", ["quest"], "Find Cloth in the Ancient Basin side cave", "Head west from the broken tram platform into the combat rooms with Lesser Mawleks. Clear the enemies and talk to Cloth when she emerges. Do this before Traitor Lord to take the route where she joins that fight. The alternative is in the quest notes."],
        ["boss-broken-vessel", ["boss", "percent-boss"], "Defeat Broken Vessel", "From the lower Basin bench road, Crystal Dash across the spike gap and follow the cavern into the fight. Jump the ground dash, watch the overhead slam and keep the Infected Balloons from crowding you."],
        ["equipment-monarch-wings", ["equipment"], "Collect Monarch Wings beyond Broken Vessel", "Continue west out of the arena to the pedestal. Test the double jump on your return. Re-entering Crossroads after this can reveal its changed corridors, so use the map for alternate routes."],
        ["stag-hidden-station", ["stag"], "Open the Hidden Station", "Take the path right from the Palace Grounds side of the Basin. Break the wall at the end of the eastern lower passage and pay 300 Geo to open the Hidden Station. The Palace Grounds just above are a later return."],
        ["dream-boss-lost-kin", ["dream-boss"], "Fight Lost Kin when your Nail is ready", "Dream Nail Broken Vessel’s body to enter the rematch. Prioritize clearing Balloons. Defender’s Crest can help damage them at close range. The reward is 400 Essence."],
      ],
    },
    {
      title: "Waterways and Basin pickups",
      location: "Royal Waterways · Ancient Basin",
      sources: [["Basin fountain and ore requirements", "https://teemo.dev/game-design/hollow-knight/systems/collectibles-and-completion-reference/"], ["Waterways and canyon directions", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"]],
      compact: true,
      rows: [
        ["mask-shard-waterways", ["mask-shard"], "Take the Waterways Mask Shard", "On the west side of the sewers, drop beneath the main path and swim west through the lower flooded passage. Follow it to the shard."],
        ["pale-ore-basin", ["pale-ore"], "Collect the Basin Pale Ore", "Go west of the lower tram platform, into the room with two Lesser Mawleks. Clear the room and check the ledge beyond them for the ore."],
        ["forge-channelled-nail", ["forge"], "Upgrade to the Channelled Nail", "Bring 800 Geo and 1 Pale Ore to the Nailsmith after the Sharpened Nail."],
        ["vessel-fragment-basin-fountain", ["vessel-fragment"], "Pay the Ancient Basin fountain", "Drop 3,000 Geo into the fountain in the Basin. The prompt may say all your Geo, but it takes only the amount needed. Collect the fragment it gives."],
        ["route-howling-wraiths-return", ["route"], "Open the west Fog Canyon route with Isma’s Tear", "Revisit western Fog Canyon off lower Greenpath with Isma’s Tear. Use the connected acid route to reach the Overgrown Mound before the later Abyss trip."],
        ["spell-howling-wraiths", ["spell"], "Learn Howling Wraiths in the Overgrown Mound", "Take the west side of Fog Canyon to the Overgrown Mound off the lower western rooms. Fight the waves of Squits, then continue through the mound and inspect the Snail Shaman remains. Take the spell back to the Abyss for its upgrade."],
      ],
    },
    {
      title: "Sewer and Basin jars",
      location: "Royal Waterways · Ancient Basin",
      note: "For a late sweep, use the Collector’s Map to check which jars remain. Follow the landmark for each individual jar.",
      sources: [["Waterways and Ancient Basin jar routes", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"]],
      map: ["ScriptersWar", "https://scripterswar.com/hollowknight/map"],
      compact: true,
      rows: [
        ["grub-waterways-bench", ["grub"], "Free the Grub behind the wall near the Waterways bench", "From the central sewer bench, climb and take the first western exit. Check the cracked wall below the entrance to the wider chamber."],
        ["grub-waterways-isma", ["grub"], "Free the Grub above Isma’s acid pool", "After taking Isma’s Tear, swim right in the grove and climb the wall to the jar. Return through the lower Waterways afterward."],
        ["grub-basin-mawlek", ["grub"], "Free the Grub beneath the Lesser Mawlek route", "West of the Basin tram, explore beyond the Pale Ore and follow the lower route east. Dive through the weak floor before climbing back to the entrance corridor. Free the jar beyond the Lesser Mawlek."],
        ["grub-basin-wings", ["grub"], "Free the Grub above the Mawlurk den", "After Wings, go east of Broken Vessel and double-jump into the opening near the ceiling by the lower Mawlurk drop. Reach the high-left corner and break the jar."],
      ],
    },
  ],
} satisfies RawChapter;
