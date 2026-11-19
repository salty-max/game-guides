import type { RawChapter } from "@hundo/core/types";

export default {
  id: 2,
  title: "The Lower Burg and Depths",
  region: "Lower Undead Burg · The Depths",
  teaser: "Lower Undead Burg",
  intro: "Rescue both spell trainers and return to Firelink after Capra. Finish the conversations between Reah’s party, Petrus and Lautrec before taking on the Gaping Dragon.",
  sources: [["Lower Burg route", "https://darksouls.wikidot.com/undead-burg"], ["Depths route and loot", "https://darksouls.wikidot.com/depths"]],
  groups: [
    {
      title: "Rescue Griggs and open the Depths",
      sources: [
        ["Basement Key door, Lower Burg shortcuts, merchant stock and Reah’s arrival", "https://steamcommunity.com/sharedfiles/filedetails/?id=2673148886"],
        ["Female merchant’s tunnel, shortcuts and stock", "https://darksouls.wikidot.com/undead-merchant-female"],
        ["Thief Set in Lower Burg", "https://darksouls.wikidot.com/thief-set"],
        ["Target Shield beside the Thief Set", "https://darksouls.wikidot.com/target-shield"],
        ["Capra Demon’s dogs and the stairs", "https://darksouls.wikidot.com/capra-demon"],
        ["Petrus’s spot at Firelink", "https://darksouls.wikidot.com/petrus-of-thorolund"],
        ["Petrus returning alone after a reset", "https://darksouls.wikidot.com/knight-lautrec-of-carim"],
      ],
      rows: [
        ["route-lower-shortcuts", ["route"], "Open the Lower Burg shortcuts", "Use the Basement Key on the locked door near Solaire, across from the stairs down from the Taurus Demon’s tower, and climb down. Open the door up the stairs by the ladder’s foot for a shortcut back to Upper Burg. Later, from the stairs to the right of Capra’s fog, climb up to the aqueduct tunnel and open its gate to Firelink. The female merchant in that tunnel sells moss and Purging Stones."],
        ["quest-griggs", ["quest"], "Rescue Griggs of Vinheim", "Use the Residence Key at the door where you hear Griggs calling in Lower Burg: opening it frees him. The Sorcerer Set and Sorcerer’s Catalyst are in a barrel in his room. Roll into the barrels to break them, because a swing can hit Griggs and turn him hostile. At Firelink, find him by the well and shop with at least 10 Intelligence, and talk to him again later for more dialogue.", {"reference": "https://darksouls.wikidot.com/griggs-of-vinheim"}],
        ["pickup-thief-gear", ["pickup"], "Collect the Thief Set and Target Shield", "Past the burning bodies, Undead Assassins wait behind the locked doors and burst out as you pass. Once they’re dead, search the small rooms they came from: one holds the Thief Set and the Target Shield."],
        ["boss-capra", ["boss"], "Defeat the Capra Demon", "Enter with a shield or a fast roll ready. Dodge the opening swing, make for the stairs and cut the dogs down as they chase you up. When Capra climbs after you, jump down and hit him while he recovers from his own drop. His Key to the Depths opens the locked door on the stair path to the right of the fog."],
        ["quest-reah-firelink", ["quest"], "Meet Reah, Vince and Nico after Capra", "Take the aqueduct shortcut back to Firelink. Speak to Reah and her escorts beside Petrus in the ruins by the Parish lift, then exhaust Petrus’s dialogue. Let the area reset until the party leaves and Petrus returns alone. They leave once you’ve talked to Petrus about them, or once you reach the Catacombs’ boss in chapter 8.", {"reference": "https://darksouls.wikidot.com/rhea-of-thorolund"}],
        ["quest-lautrec-tip", ["quest"], "Buy Lautrec’s tip and confront Petrus", "Before defeating the Gaping Dragon, speak to Lautrec opposite Anastacia after Petrus returns alone. Accept his offer of information for 100 souls per Soul Level, then speak to Petrus again for his response.", {"reference": "https://darksouls.wikidot.com/knight-lautrec-of-carim"}],
        ["quest-griggs-clerics", ["quest"], "Ask Griggs about the clerics at Firelink", "Once Reah’s party has reached Firelink, talk to Griggs by the well and hear what he has to say about the three young clerics.", {"reference": "https://darksouls.wikidot.com/griggs-of-vinheim"}],
      ],
    },
    {
      title: "Butchers, sewers and the lower gate",
      location: "The Depths",
      sources: [
        ["Sewers, keys, Kirk and boss approach", "https://darksouls.wikidot.com/depths"],
        ["Laurentius’s dialogue branches", "https://darksouls.wikidot.com/laurentius"],
        ["Spider Shield ledge and its use in Blighttown, Domhnall’s ledge", "https://steamcommunity.com/sharedfiles/filedetails/?id=2673148886"],
        ["Greataxe under the crates", "https://darksouls.wikidot.com/greataxe"],
        ["Heavy Crossbow above the boss arena", "https://darksouls.wikidot.com/heavy-crossbow"],
        ["Basilisk curse clouds", "https://darksouls.wikidot.com/basilisk"],
        ["Gaping Dragon’s slam, crawl and tail cut", "https://darksouls.wikidot.com/gaping-dragon"],
      ],
      rows: [
        ["ember-large", ["ember"], "Take the Large Ember", "Open the chest beside the first Butcher’s table. Give the ember to Andre to take a standard weapon past +5 or to turn a +5 weapon Raw. Save the hole behind the table for after you’ve freed Laurentius upstairs.", {"reference": "https://darksouls.wikidot.com/large-ember"}],
        ["quest-laurentius", ["quest"], "Rescue Laurentius and buy his exclusive stock", "Go beyond the Butcher’s room and roll through Laurentius’s barrels. Speak to him at Firelink and buy Iron Flesh and Flash Sweat. Reinforce your Pyromancy Flame toward +10 with him: a +10 flame opens another teacher. Say No if he asks where you learned a pyromancy he doesn’t teach, until you’ve bought and upgraded what you need."],
        ["pickup-spider-shield", ["pickup"], "Collect the Spider Shield above the giant rat", "Return to the Butcher’s table and drop through the opening behind it onto the ledge above the giant rat. Walk around to the far end for the shield before dropping lower. Blocking a poisonous or toxic hit with it keeps that meter from filling, which pays off in the next area.", {"reference": "https://darksouls.wikidot.com/spider-shield"}],
        ["route-depths-fire", ["route"], "Light the Depths bonfire and open its shortcut", "Pick up the Sewer Chamber Key from a corpse in the Giant Undead Rat’s room, unless you brought the Master Key. Follow the rat tunnels up past the caged room to a locked door beside a slime-lined corridor, and light the bonfire behind it. Later, from the lower sewers past the three large rats, climb the stairs and open the door back to the bonfire."],
        ["pickup-depths-weapons", ["pickup"], "Collect the Depths Greataxe and Heavy Crossbow", "In the rat tunnels past the giant rat, break the crates behind the five small rats for the Greataxe corpse. Later, take the doorway on your right just before Domhnall and follow the stairs down: the Heavy Crossbow is on a corpse at the parapet over the boss arena, before the last flight to the fog.", {"reference": "https://darksouls.wikidot.com/depths"}],
        ["ring-evil-eye", ["ring"], "Collect the Ring of the Evil Eye", "Slide down from the giant rat’s room into the basilisk tunnels and loot the corpse behind the basilisks’ area. Come at the basilisks from behind where you can, and step out of each gas cloud before the curse builds up.", {"reference": "https://darksouls.wikidot.com/ring-of-the-evil-eye"}],
        ["invasion-kirk-depths", ["invasion"], "Defeat Kirk in the Depths", "Reverse hollowing and keep the Gaping Dragon alive. Kirk invades in the tunnels beside the Basilisks, at the corner where three large rats come at you. He invades twice more in chapter 9, and all three wins are needed for his armor.", {"reference": "https://darksouls.wikidot.com/kirk-knight-of-thorns"}],
        ["quest-domhnall-depths", ["quest"], "Meet Domhnall by the locked lower gate", "Speak to Domhnall on the Depths side of the lower gate and ask about his stock. If you want to hear his hints, buy something and return to his Talk menu. He relocates to the aqueduct ledge at Firelink after both bells.", {"reference": "https://darksouls.wikidot.com/domhnall-of-zena"}],
        ["rare-weapon-dragon-king-greataxe", ["rare-weapon"], "Cut the Gaping Dragon’s tail", "When the dragon crawls past you, run to its tail while it hauls itself upright and hit the tail. The Dragon King Greataxe goes straight into your inventory when the tail comes off, so cut it before you finish the fight.", {"reference": "https://darksouls.wikidot.com/dragon-king-greataxe"}],
        ["boss-gaping", ["boss"], "Defeat the Gaping Dragon", "Kill the Channeler in the sewer first so it cannot buff or fire into the boss arena. Keep your distance to bait its slam, stand a little to one side so its crawl misses, and hit its legs as it rises. Take the Blighttown Key and unlock the gate near Domhnall."],
        ["quest-laurentius-after-depths", ["quest"], "Return to Laurentius before committing to the swamp", "Next time you’re at Firelink, buy any exclusive spell you skipped and spend spare souls on the flame. His shop stays open for as long as you decline his question about where you learned a pyromancy he doesn’t teach.", {"reference": "https://darksouls.wikidot.com/laurentius"}],
      ],
    },
  ],
} satisfies RawChapter;
