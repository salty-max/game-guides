import type { RawChapter } from "@hundo/core/types";

export default {
  id: 1,
  title: "The Well and the Forgotten Crossroads",
  region: "King’s Pass · Dirtmouth · Forgotten Crossroads",
  teaser: "Dirtmouth",
  intro: "Break into Dirtmouth and go down its well. In the Forgotten Crossroads, buy the map, open the Stag Station, wake the lost shopkeeper, beat the False Knight and learn the spell that clears the road west.",
  sources: [["Steam guide ch 1–2 · opening route, Crossroads, Sly, False Knight, Vengeful Spirit", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Wiki · Forgotten Crossroads landmarks and the Ancestral Mound", "https://hollowknight.wiki/w/Forgotten_Crossroads"]],
  groups: [
    {
      title: "King’s Pass and Dirtmouth",
      location: "King’s Pass · Dirtmouth",
      sources: [["Wiki · King’s Pass and Dirtmouth", "https://hollowknight.wiki/w/Dirtmouth"], ["Wiki · Fury of the Fallen’s spike room", "https://hollowknight.wiki/w/Fury_of_the_Fallen"], ["Wiki · Elderbug", "https://hollowknight.wiki/w/Elderbug"], ["Wiki · Quirrel at the Black Egg, and when he leaves", "https://hollowknight.wiki/w/Quirrel"]],
      rows: [
        ["charm-fury-of-the-fallen", ["charm"], "Take Fury of the Fallen from King’s Pass", "Go right from the start until the floor collapses under you. Where the road then forks, take the lower branch: a spike bed too wide to jump blocks it, so strike down at the spikes in mid-air to bounce across. Drop into the hidden room past its end and open the chest."],
        ["route-pass", ["route"], "Break through King’s Pass", "Back at the fork, take the upper branch to the large gate at its end. Hit it until it gives way, then drop down into Dirtmouth."],
        ["quest-elderbug", ["quest"], "Speak to Elderbug at the Dirtmouth bench", "Elderbug sits by the bench in the middle of town. Rest there and hear him out; he has views on the places you’ve been. The well at the town’s far edge leads underground."],
        ["quest-quirrel-temple", ["quest"], "Meet Quirrel near the Black Egg", "Where the well drops you, the way right leads into a vast temple built from an old shell. Quirrel stands inside, gazing at the Black Egg. Talk to him before you head west past the False Knight, which sends him on his way, then come back and take the left-hand road."],
      ],
    },
    {
      title: "A map, a merchant and a way home",
      location: "Forgotten Crossroads",
      sources: [["Steam guide ch 1 · Cornifer, the Stag Station, Gruz Mother and Sly", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Wiki · Cornifer’s humming, papers and prices", "https://hollowknight.wiki/w/Cornifer"], ["Wiki · Stag tolls and the Dirtmouth station", "https://hollowknight.wiki/w/Fast_Travel_(Hollow_Knight)"], ["Wiki · Gruz Mother", "https://hollowknight.wiki/w/Gruz_Mother"], ["Wiki · Sly’s rescue and stock", "https://hollowknight.wiki/w/Sly"], ["Wiki · Iselda’s shop and the Quill", "https://hollowknight.wiki/w/Iselda"], ["Wiki · Myla", "https://hollowknight.wiki/w/Myla"]],
      rows: [
        ["map-crossroads", ["map"], "Buy Cornifer’s Crossroads map", "Head left from the foot of the well and down the tall shaft of platforms. Cornifer is in the room under it: follow his humming and the papers he leaves, and buy the map for 30 Geo. If he has moved on, Iselda sells it in Dirtmouth for more."],
        ["stag-crossroads", ["stag"], "Open the Forgotten Crossroads Stag Station", "Keep going down and right from Cornifer. The next big room locks you in until its Aspids are dead. Press on east through the rooms where Goams lunge from the walls and floor, to a sign pointing up and right; the station is behind the first door on the left. Pay 50 Geo and ring for the Stag."],
        ["stag-dirtmouth", ["stag"], "Unlock the Dirtmouth station door", "Ride the Stag up to Dirtmouth from any open station. Dirtmouth’s station opens only from the inside, so arriving this way unlocks it at no cost."],
        ["boss-gruz-mother", ["boss", "percent-boss"], "Defeat the Gruz Mother", "Down and east of the Stag Station, a huge Gruz sleeps in a small arena. Hit her to start the fight and stay clear of her charges and her floor-to-ceiling slams. When she dies her belly bursts into a swarm of Gruzzers: kill them all to open the way out."],
        ["quest-sly-rescue", ["quest"], "Rescue Sly beyond the Gruz Mother", "An abandoned village lies under the Gruz Mother’s arena. Only one house there stands open, and a dazed shopkeeper mutters inside. Talk to him until he comes to: he’s Sly, and he goes back to open his shop in Dirtmouth."],
        ["simple-key-sly", ["simple-key"], "Buy Sly’s Simple Key", "Once Sly is back in Dirtmouth, his Simple Key costs 950 Geo. Keep it for whichever key lock you want to open first."],
        ["route-iseldas-shop", ["route"], "Buy the Quill from Iselda", "Iselda opens her map shop in Dirtmouth once you’ve listened to Cornifer. Buy the Quill for 120 Geo: your map only fills in new rooms if you carry it. Her Wayward Compass is a separate charm."],
        ["quest-myla-intro", ["quest"], "Visit Myla the miner", "Myla is mining and singing at the upper east edge of the Crossroads. Talk to her, and visit again once you’ve learned Vengeful Spirit: her song changes."],
      ],
    },
    {
      title: "The city crest and first spell",
      location: "Forgotten Crossroads · Ancestral Mound",
      sources: [["Steam guide ch 1–2 · False Knight, the mound and the way west", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Wiki · False Knight’s slam, stagger and drops", "https://hollowknight.wiki/w/False_Knight"], ["Wiki · the Elder Baldur on Greenpath’s door", "https://hollowknight.wiki/w/Greenpath"]],
      rows: [
        ["boss-false-knight", ["boss", "percent-boss"], "Defeat False Knight", "His arena is the huge hall in the middle of the Crossroads, reached up the right side of the big room west of the Stag Station. Jump the shockwave from each mace slam, and hit the maggot inside whenever his armour topples. Take the City Crest he drops, then the Geo chest up and left past the arena’s gate."],
        ["spell-vengeful-spirit", ["spell"], "Learn Vengeful Spirit from the Snail Shaman", "West of the False Knight’s hall, go up into the Ancestral Mound and talk to the Snail Shaman for the spell."],
        ["charm-soul-catcher", ["charm"], "Take Soul Catcher from the Ancestral Mound", "After the spell you wake behind a locked gate. An Elder Baldur holds the passage and can only be hurt while it’s uncurled, so hit it with Vengeful Spirit from a distance. Its death opens the gate, and Soul Catcher lies just past it."],
        ["route-goams", ["route"], "Open the road west to Greenpath", "Greenpath lies west of the Crossroads’ main shaft, behind an Elder Baldur that only a spell can kill. From the mound, a lever down and to the left opens onto the shaft; leave the shaft by its leafy west exit and cross the bridge to the Baldur. Shoot it with Vengeful Spirit until it dies."],
      ],
    },
    {
      title: "Early purchases and Crossroads pickups",
      location: "Forgotten Crossroads · Dirtmouth",
      sources: [["Wiki · Sly’s prices", "https://hollowknight.wiki/w/Sly"], ["Wiki · Iselda’s Wayward Compass", "https://hollowknight.wiki/w/Iselda"], ["Wiki · Mask Shard locations", "https://hollowknight.wiki/w/Mask_Shard_(Hollow_Knight)"], ["Steam guide ch 18 · the shard through the first Goam room’s ceiling", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"]],
      compact: true,
      rows: [
        ["charm-wayward-compass", ["charm"], "Buy Wayward Compass", "Buy from Iselda in Dirtmouth for 220 Geo. Equip it at a bench to see where you are on the map."],
        ["charm-gathering-swarm", ["charm"], "Buy Gathering Swarm", "Buy from Sly in Dirtmouth for 300 Geo. While it’s equipped, it collects loose Geo for you."],
        ["charm-stalwart-shell", ["charm"], "Buy Stalwart Shell", "Buy from Sly in Dirtmouth for 200 Geo."],
        ["mask-shard-sly-first", ["mask-shard"], "Buy Sly’s first Mask Shard", "Pay Sly 150 Geo in Dirtmouth."],
        ["mask-shard-sly-second", ["mask-shard"], "Buy Sly’s second Mask Shard", "After the first, pay 500 Geo for the next shard."],
        ["vessel-fragment-sly-first", ["vessel-fragment"], "Buy Sly’s first Vessel Fragment", "Pay Sly 550 Geo in Dirtmouth."],
        ["mask-shard-goams", ["mask-shard"], "Take the Mask Shard beyond the Goams", "South of the False Knight’s hall, find a way up through the ceiling of the first room of Goams; the shard waits at the end of that passage. It’s easier with a later ability, so leave it for now if the climb beats you."],
      ],
    },
    {
      title: "First Crossroads Grubs",
      location: "Forgotten Crossroads",
      sources: [["Steam guide ch 1 · the first three Crossroads jars", "https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947"], ["Wiki · Grub locations", "https://hollowknight.wiki/w/Grub"]],
      map: ["ScriptersWar", "https://scripterswar.com/hollowknight/map"],
      compact: true,
      rows: [
        ["grub-crossroads-spikes", ["grub"], "Free the Grub above the eastern spike platforms", "This jar sits past a row of spiked platforms, in the room left of the one above Sly’s village. Pogo off the spikes to get over them."],
        ["grub-crossroads-aspids", ["grub"], "Free the Grub behind the Aspid wall", "In the room outside the Stag Station, a cracked wall a little up and to the left hides two Aspid Hunters and a jar. Break it open and kill both."],
        ["grub-crossroads-husk", ["grub"], "Free the Grub guarded by the Husk Guard", "A big Husk Guard stands over this jar up and right of the Stag Station’s room, through the lever shortcut. You can break the jar without killing him."],
      ],
    },
  ],
} satisfies RawChapter;
