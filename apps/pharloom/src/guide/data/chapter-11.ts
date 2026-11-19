import type { RawChapter } from "@hundo/core/types";

export default {
  id: 11,
  title: "The Old Hearts and Fleatopia",
  region: "Shellwood · Sands of Karak · Far Fields · Verdania · Fleatopia",
  teaser: "Verdania",
  intro: "Gather any three of the four Old Hearts for the Shamans. The fourth can become a keepsake. Finish the flea festival and the Act 3 wish rewards during this circuit.",
  sources: [["Acts", "https://hollowknight.wiki/w/Acts"], ["Encrusted Heart", "https://hollowknight.wiki/w/Encrusted_Heart"], ["Pollen Heart", "https://hollowknight.wiki/w/Pollen_Heart"], ["Hunter's Heart", "https://hollowknight.wiki/w/Hunter's_Heart"], ["Conjoined Heart", "https://hollowknight.wiki/w/Conjoined_Heart"], ["Fleatopia", "https://hollowknight.wiki/w/Fleatopia"], ["Route reference", "https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route"]],
  groups: [
    {
      title: "The four Old Hearts",
      location: "Shellwood · Sands of Karak · Far Fields · Verdania",
      rows: [
        ["route-nyleth-path", ["route"], "Find the Shrine of Nyleth through the Grand Gate lift shaft", "Enter the Grand Gate and explore the left wall of the lift shaft with Silk Soar. Break through into the hidden Shellwood route. Beat Shrine Guardian Seth and play the Elegy at Nyleth's resting place."],
        ["boss-seth", ["boss"], "Defeat Shrine Guardian Seth in Shellwood", "Reach the hidden shrine through the Grand Gate shaft. Stay away from the shield while he charges and punish as he comes to a stop. Check Fleatopia again later for his Festival challenges.", {"reference": "https://hollowknight.wiki/w/Shrine_Guardian_Seth"}],
        ["boss-nyleth", ["boss"], "Defeat Nyleth and claim the Pollen Heart", "In the memory, stay close enough to make safe hits after her attack patterns and use the wall passages when the floor is unsafe. Take the Pollen Heart after winning."],
        ["boss-khann", ["boss"], "Defeat Crust King Khann and take the Encrusted Heart", "Use the Elegy of the Deep at the Coral Tower in Sands of Karak. Clear the tower arenas in sequence, then fight Khann at the top. React to the coral burst first and attack when the arena opens again."],
        ["boss-karmelita", ["boss"], "Defeat Skarrsinger Karmelita and take the Hunter's Heart", "Silk Soar up to Karmelita's rooms in the northeastern Far Fields and play the Elegy. In the memory, read her leaps and pass behind each spreading attack before taking your next hit. The chamber also opens a late Wish."],
        ["wish-green-prince", ["quest"], "Follow the Green Prince to Verdania for the fourth heart", "Free the Prince in Sinner's Road with a Simple Key. After the Choral Chambers gauntlet, speak to him west of the Citadel Spa. Visit Songclave, and after defeating the Cogwork Dancers speak to him just left of their arena. In Act 3, enter through the right wall of Craw Lake and play the Elegy by him to reach Lost Verdania.", {"reference": "https://hollowknight.wiki/w/Green_Prince"}],
        ["boss-palestag", ["boss"], "Defeat Palestag before clearing Lost Verdania", "Find Palestag's side arena in Lost Verdania. Finish the encounter and its Journal entry before the Clover Dancers end the memory.", {"reference": "https://hollowknight.wiki/w/Palestag"}],
        ["boss-clover-dancers", ["boss"], "Defeat the Clover Dancers and take the Conjoined Heart", "Gather at least 12 memory orbs to open the palace in upper central Lost Verdania. Play the Needolin to detect uncollected orbs. Defeat Palestag and collect all 17 first if you want the extra lore tablet. In the boss arena, dodge the paired attacks and heal after both dancers commit.", {"reference": "https://hollowknight.wiki/w/Verdania"}],
        ["wish-old-hearts", ["quest"], "Bring three Old Hearts to the Snail Shamans", "Return to the Ruined Chapel with any three of the four hearts. Keep the fourth as the Heart Memento if you collect it. Follow the Shamans' ritual into the Red Memory in the final chapter."],
      ],
    },
    {
      title: "Festival of the Flea and later wishes",
      location: "Fleatopia · Mount Fay · Far Fields · Bellhart",
      rows: [
        ["wish-ecstasy-of-the-end", ["quest"], "Start Ecstasy of the End in the Fleatopia festival", "Rescue all 30 fleas and go to Fleatopia in Act 3. Talk to the festival hosts and accept the Wish. Complete all three events in the same file for the final Pale Oil."],
        ["challenge-flea-juggle", ["challenge"], "Beat the listed Flea Juggle high score", "Talk to Mooshka to start Juggle and beat 30 points. Stay under the group and use repeated hits to keep them in the air.", {"reference": "https://hollowknight.wiki/w/Ecstasy_of_the_End"}],
        ["challenge-flea-dodge", ["challenge"], "Beat the listed Flea Dodge high score", "Start Dodge and beat 65 points. Stay low until you recognize the incoming lane, then jump or dash through the opening.", {"reference": "https://hollowknight.wiki/w/Ecstasy_of_the_End"}],
        ["challenge-flea-bounce", ["challenge"], "Beat the listed Flea Bounce high score", "Start Bounce and beat 42 points. Use controlled downward attacks and adjust your horizontal movement between fleas to stay above the course.", {"reference": "https://hollowknight.wiki/w/Ecstasy_of_the_End"}],
        ["wish-festival-oil", ["quest"], "Collect the festival Pale Oil from Mooshka", "After holding the highest score in all three events, speak to Mooshka to finish Ecstasy of the End and receive the oil. Seth's higher targets for a memento are separate."],
        ["needle-pale-steel", ["needle"], "Give Plinney the last Pale Oil for the Pale Steel Needle", "Bring the final oil and 680 Rosaries to Bellhart after forging the Hivesteel Needle. This earns the fourth Needle upgrade point."],
        ["wish-fastest-in-pharloom", ["quest"], "Win all three Fastest in Pharloom races", "Open the bridge between Hunter's March and Far Fields at its lever. Find Sprintmaster Swift in Act 3. Learn the course before trying to sprint every section, and beat all three times for the final reward."],
        ["wish-the-hidden-hunter", ["quest"], "Hunt Gurr the Outcast in Far Fields", "After finding Karmelita's rooms with Silk Soar, read the Wishwall and follow the hunt through Far Fields. Defeat Gurr and return for the Mask Shard."],
        ["boss-gurr", ["boss"], "Defeat Gurr the Outcast in Far Fields", "Track the hideout during The Hidden Hunter and use the nearby open space against his shots and traps. Return to the Bellhart Wishwall for the shard.", {"reference": "https://hollowknight.wiki/w/Gurr_the_Outcast"}],
        ["wish-dark-hearts", ["quest"], "Collect the required Dark Hearts for Bellhart", "After Awaiting the End, take Dark Hearts in Bellhart and destroy any 12 Void Masses. Several are in the Choral Chambers, Shellwood and Greymoor. Earlier Void Mass kills count too. Return to the Wishwall for the shard.", {"reference": "https://hollowknight.wiki/w/Dark_Hearts"}],
        ["wish-fatal-resolve", ["quest"], "Find the Pinstress at Mount Fay", "After returning from the Abyss, read her note or the Wishwall and travel to the bench halfway up Mount Fay. Wait for her attacks to finish before stepping into Needle range, then collect Pin Badge."],
        ["boss-pinstress", ["boss"], "Defeat Pinstress in Act 3", "Read her note or take Fatal Resolve. Go to the high Mount Fay bench and time your strikes after each lunge. Collect Pin Badge when the fight ends.", {"reference": "https://hollowknight.wiki/w/Pinstress"}],
      ],
    },
    {
      title: "Late duels and rematches",
      location: "Blasted Steps · Greymoor · Whispering Vaults",
      compact: true,
      rows: [
        ["wish-heros-call", ["quest", "boss"], "Answer Hero's Call and face Lost Garmond", "Talk to Garmond and Zaza during the Act 3 roaming encounters. Check Bellhart after the third meeting or after obtaining the Everbloom. Follow the Wish to the room west of the Blasted Steps Bellway and finish the encounter."],
        ["wish-pain-anguish-misery", ["quest", "boss"], "Face Tormented Trobbio at the Stage", "Check Songclave after obtaining Claw Mirror and Silk Soar. Return to the Stage for the rematch. Avoid the spreading explosions, then collect the upgraded Claw Mirrors."],
        ["boss-crawfather", ["boss"], "Defeat Crawfather below Craw Lake", "Search the basement of the large Greymoor tower during Act 3. Wait outside the swings before advancing and check the aftermath for the memento and Crawbell.", {"reference": "https://hollowknight.wiki/w/Crawfather"}],
        ["boss-watcher-edge", ["boss"], "Defeat Watcher at the Edge in Sands of Karak", "Use Silk Soar to enter the western Karak hidden branch. Play the Needolin in the chamber as needed. Finish the fight for the Grey Memento.", {"reference": "https://hollowknight.wiki/w/Watcher_at_the_Edge"}],
        ["wish-flea-seth", ["quest", "challenge"], "Beat Seth's new records for Guardian's Memento", "After besting Seth as shrine guardian and completing the festival Wish, speak to him at Fleatopia if he has arrived. Beat his new scores in all three events and talk to him for the memento."],
      ],
    },
    {
      title: "Collectibles and unlocks · Mount Fay",
      location: "Mount Fay",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["tool-pin-badge", ["tool"], "Pin Badge", "Take up Fatal Resolve and find Pinstress at the mid-mountain bench in Act 3. Claim the badge after the duel.", {"reference": "https://hollowknight.wiki/w/Pin_Badge", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479466"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Far Fields",
      location: "Far Fields",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["mask-shard-17", ["mask-shard"], "Mask Shard · Far Fields", "Win all three Sprintmaster Swift races in Fastest in Pharloom. He gives you the shard after the third.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479194"]}],
        ["memory-locket-far-fields-2", ["memory-locket"], "Memory Locket · Far Fields (#2)", "Explore the hidden room right of Karmelita's cave. Defeat or evade the Void-tainted Skarrgard guarding the locket.", {"reference": "https://hollowknight.wiki/w/Memory_Locket", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479196"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Bellhart",
      location: "Bellhart",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["mask-shard-18", ["mask-shard"], "Mask Shard · Bellhart", "Complete The Hidden Hunter by defeating Gurr the Outcast in Far Fields. Return to the Wishwall for the shard.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479447"]}],
        ["mask-shard-19", ["mask-shard"], "Mask Shard · Bellhart", "Destroy any 12 Void Masses for Dark Hearts, then collect the shard from the Wishwall.", {"reference": "https://hollowknight.wiki/w/Mask_Shard_(Silksong)", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479449"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Fleatopia",
      location: "Fleatopia",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["pale-oil-3", ["pale-oil"], "Pale Oil · Fleatopia", "Win all three flea games for Ecstasy of the End and speak to Mooshka for Pale Oil. Take the oil to Plinney.", {"reference": "https://hollowknight.wiki/w/Pale_Oil", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479582"]}],
        ["memento-guardians-memento", ["memento"], "Guardian's Memento", "After the festival, beat Seth's three new records and ask him for the Guardian's Memento.", {"reference": "https://hollowknight.wiki/w/Bellhome", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479638"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Sands of Karak",
      location: "Sands of Karak",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memento-grey-memento", ["memento"], "Grey Memento", "After Silk Soar, find the Watcher at the Edge inside the western Karak hidden path. Defeat the Watcher and claim the Grey Memento.", {"reference": "https://hollowknight.wiki/w/Bellhome", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479630"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Blasted Steps",
      location: "Blasted Steps",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memento-heros-memento", ["memento"], "Hero's Memento", "Finish Hero's Call by beating Lost Garmond. Collect the Hero's Memento in the encounter.", {"reference": "https://hollowknight.wiki/w/Bellhome", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479632"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Greymoor",
      location: "Greymoor",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["memento-craw-memento", ["memento"], "Craw Memento", "In Act 3, enter the basement of the large Craw Lake tower. Defeat Crawfather and collect the Craw Memento and Crawbell.", {"reference": "https://hollowknight.wiki/w/Bellhome", "map": ["Map Genie", "https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479580"]}],
      ],
    },
    {
      title: "Collectibles and unlocks · Verdania",
      location: "Verdania",
      compact: true,
      map: ["Pharloom Calculator", "https://pharloomcalculator.com/map/"],
      rows: [
        ["map-verdania", ["map"], "Get the Verdania map", "Check the abandoned camp on the Verdania approach. Map the region before entering its memory.", {"reference": "https://hollowknight.wiki/w/Map_and_Quill_(Silksong)#Maps"}],
      ],
    },
  ],
} satisfies RawChapter;
