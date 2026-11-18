import type { RawChapter } from "@hundo/core/types";

export default {
  id: 1,
  title: "The Well and the Forgotten Crossroads",
  region: "King’s Pass · Dirtmouth · Forgotten Crossroads",
  teaser: "Dirtmouth",
  intro: "Reach the surface town, open the first Stag Station and learn the spell that opens the western road. Save enough Geo for the map and the first station.",
  sources: [["Opening route and first pickups", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Forgotten Crossroads landmarks", "https://hollowknight.wiki/w/Forgotten_Crossroads"]],
  groups: [
    {
      title: "King’s Pass and Dirtmouth",
      location: "King’s Pass · Dirtmouth",
      rows: [
        ["route-pass", ["route"], "Break through King’s Pass", "Follow the upper route when the floor surprises you. Cut vines and practice down-striking while airborne. Follow the marked path to the wooden gate, strike it to break through and drop to the town."],
        ["charm-fury-of-the-fallen", ["charm"], "Take Fury of the Fallen from King’s Pass", "Before the town gate, explore the lower side of King’s Pass and find the chest beyond the spikes. Down-strike the spikes to bounce across or return with Mothwing Cloak for the safer jump."],
        ["quest-elderbug", ["quest"], "Speak to Elderbug at the Dirtmouth bench", "Rest beside him and exhaust the conversation. The well to the right leads underground. Return to his dialogue after major visits if you want his reactions."],
        ["quest-quirrel-temple", ["quest"], "Meet Quirrel near the Black Egg", "From the bottom of Dirtmouth’s well, take the passage right and enter the large rounded temple. Speak to Quirrel, then return to the well junction and take the western route."],
      ],
    },
    {
      title: "A map, a merchant and a way home",
      location: "Forgotten Crossroads",
      sources: [["First station, route to Sly and Myla", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"]],
      rows: [
        ["map-crossroads", ["map"], "Buy Cornifer’s Crossroads map", "From the well junction, head left and drop the wide vertical shaft. Listen for humming just below the bottom and buy the map for 30 Geo. If he leaves, check Iselda’s shop in Dirtmouth."],
        ["stag-crossroads", ["stag"], "Open the Forgotten Crossroads Stag Station", "Take the lower route east past the Aspid room and the Goams. Follow the station sign toward the eastern shaft, pay 50 Geo and ring the bell. Use the Stag once to open the Dirtmouth station entrance from within."],
        ["stag-dirtmouth", ["stag"], "Unlock the Dirtmouth station door", "Ride up from an unlocked station and strike the interior switch to open the front door. This stop is free."],
        ["boss-gruz-mother", ["boss", "percent-boss"], "Defeat the Gruz Mother", "From the station junction, continue down and east to the sleeping Gruz. Strike to start the fight, then keep clear of her bouncing slams. After the larger Gruz falls, clear the hatchlings to open the exit."],
        ["quest-sly-rescue", ["quest"], "Rescue Sly beyond the Gruz Mother", "Drop to the abandoned village after the Gruz Mother and enter the small house with an open door. Talk to the shopkeeper until he responds. Return to Dirtmouth for his stock, including the Lantern."],
        ["pickup-lantern", ["pickup"], "Buy the Lumafly Lantern before the dark routes", "Save 1,800 Geo for the Lantern. Buy the Quill and open the stations you need, then prioritize the Lantern over Sly’s optional stock and Simple Key. It helps in Deepnest and Stone Sanctuary and opens the paid mine entrance. The route uses Desolate Dive to enter Crystal Peak first if you cannot afford it yet.", {"reference": "https://hollowknight.wiki/w/Lumafly_Lantern"}],
        ["simple-key-sly", ["simple-key"], "Buy Sly’s Simple Key", "After rescuing Sly, buy the Simple Key for 950 Geo. Save it for whichever key door you want to open first."],
        ["route-iseldas-shop", ["route"], "Buy the Quill from Iselda", "Visit the map shop in Dirtmouth after meeting Cornifer. Buy the Quill for 120 Geo so bench rests update your explored maps. Wayward Compass is a separate charm and must be equipped at a bench."],
        ["quest-myla-intro", ["quest"], "Visit Myla by the Crystal Peak entrance", "Follow the mining sounds east from the upper Crossroads and talk to Myla while she is still singing. Visit again after learning to break floors if you want to hear the change in her dialogue."],
      ],
    },
    {
      title: "The city crest and first spell",
      location: "Ancestral Mound",
      rows: [
        ["boss-false-knight", ["boss", "percent-boss"], "Defeat False Knight", "Climb from the Stag Station corridor into the large central chamber. Back away from the raised mace, hop shockwaves and hit the exposed head whenever he collapses. Stay out of falling debris during his tantrums. Take the City Crest and open the nearby Geo chest."],
        ["spell-vengeful-spirit", ["spell"], "Learn Vengeful Spirit from the Snail Shaman", "Enter the Ancestral Mound to the left of False Knight’s arena and speak to the shaman. In his test, bait an Elder Baldur open from a distance and fire the spell before it curls up. Other small enemies can refill SOUL."],
        ["charm-soul-catcher", ["charm"], "Take Soul Catcher from the Ancestral Mound", "After passing the Elder Baldur in the shaman’s test, check the end of the passage for the charm. Speak to the shaman again if you want the follow-up."],
        ["route-goams", ["route"], "Open the western gate toward Greenpath", "Take the downward exit from the mound and use the lever that reconnects the Crossroads shaft. Enter the leafy road on its west wall. Use Vengeful Spirit on the Elder Baldur from outside its curl-up range."],
      ],
    },
    {
      title: "Early purchases and Crossroads pickups",
      location: "Forgotten Crossroads · Dirtmouth",
      sources: [["Shop prices and pickup routes", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Mask and vessel sources", "https://teemo.dev/game-design/hollow-knight/systems/collectibles-and-completion-reference/"]],
      compact: true,
      rows: [
        ["charm-wayward-compass", ["charm"], "Buy Wayward Compass", "Buy from Iselda in Dirtmouth for 220 Geo. Equip at a bench to see your own position on the map."],
        ["charm-gathering-swarm", ["charm"], "Buy Gathering Swarm", "Buy from Sly after his rescue for 300 Geo. The swarm gathers loose Geo while it is equipped."],
        ["charm-stalwart-shell", ["charm"], "Buy Stalwart Shell", "Buy from Sly for 200 Geo after he opens the Dirtmouth shop."],
        ["mask-shard-sly-first", ["mask-shard"], "Buy Sly’s first Mask Shard", "Pay 150 Geo at Sly’s shop once he is awake and back in Dirtmouth."],
        ["mask-shard-sly-second", ["mask-shard"], "Buy Sly’s second Mask Shard", "After the first purchase, pay 500 Geo for the next shard."],
        ["vessel-fragment-sly-first", ["vessel-fragment"], "Buy Sly’s first Vessel Fragment", "Pay 550 Geo at the Dirtmouth shop after rescuing Sly."],
        ["mask-shard-goams", ["mask-shard"], "Take the Mask Shard beyond the Goams", "Find the low Crossroads passage south of False Knight with Goams rising through the floor. Cross between thrusts, or return with Mantis Claw to go over the harder gaps."],
      ],
    },
    {
      title: "First Crossroads Grubs",
      location: "Forgotten Crossroads",
      note: "For a late sweep, use the Collector’s Map to check which jars remain. Follow the landmark for each individual jar.",
      sources: [["First Crossroads jar directions", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"]],
      map: ["ScriptersWar", "https://scripterswar.com/hollowknight/map"],
      compact: true,
      rows: [
        ["grub-crossroads-spikes", ["grub"], "Free the Grub above the eastern spike platforms", "From the abandoned village behind Gruz Mother, climb to the passage above it and take the side exit left. Down-strike the spikes to cross the low obstacle course to the jar."],
        ["grub-crossroads-aspids", ["grub"], "Free the Grub behind the Aspid wall", "Find the cracked wall off the main eastern vertical corridor near the Stag Station. Break through and defeat the Aspids guarding the jar."],
        ["grub-crossroads-husk", ["grub"], "Free the Grub guarded by the Husk Guard", "Go up the eastern Crossroads shaft toward the Crystal Peak approach. Enter the room with the large Husk Guard and break the jar behind it."],
      ],
    },
  ],
} satisfies RawChapter;
