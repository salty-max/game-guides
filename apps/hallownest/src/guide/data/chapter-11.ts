import type { RawChapter } from "@hundo/core/types";

export default {
  id: 11,
  title: "The Grimm Troupe and Colosseum",
  region: "Howling Cliffs · Dirtmouth · Kingdom’s Edge",
  teaser: "Colosseum",
  intro: "Finish the arena’s three trials and choose an ending for the Troupe. The first two trials fund your Nail and charm upgrades.",
  sources: [["Grimm Troupe and arena route", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Ritual and banishment outcomes", "https://hollowknight.wiki/w/The_Grimm_Troupe_(Quest)"], ["Arena unlocks and rewards", "https://hollowknight.wiki/w/Colosseum_of_Fools"]],
  groups: [
    {
      title: "The three arena trials",
      location: "Colosseum of Fools",
      rows: [
        ["route-colosseum-entry", ["route"], "Find the Colosseum in upper Kingdom’s Edge", "Climb up the long ash shaft and enter the Colosseum on its upper western side. Find the bench below the arena and speak to Little Fool to unlock the board. Return between trials for upgrades."],
        ["trial-trial-warrior", ["trial"], "Complete the Trial of the Warrior", "Pay 100 Geo and inspect the first board to enter. Clear waves quickly before additional threats stack up. If you rescued Zote twice, the one-on-one bout at the end gives his next story scene. Pick up the Charm Notch."],
        ["notch-colosseum", ["notch"], "Take the Trial of the Warrior Charm Notch", "Collect the notch granted by the first clear of the Trial of the Warrior.", {"reference": "https://hollowknight.wiki/w/Colosseum_of_Fools"}],
        ["quest-zote-arena", ["quest"], "Finish Zote’s bout and check on Bretta", "After both rescues, defeat Zote when he appears at the end of the first trial. Return to Dirtmouth and speak to him and Bretta. With Bretta rescued, visit the lower room of her house to find the statue."],
        ["dream-boss-grey-prince-zote", ["dream-boss"], "Choose whether to fight Grey Prince Zote", "In Bretta’s basement after the three Zote stages, Dream Nail the statue to fight him. Beating him once gives 300 Essence and adds him to applicable Pantheons. Later rematches in the basement earn no percentage. This fight is optional even for 112%."],
        ["trial-trial-conqueror", ["trial"], "Complete the Trial of the Conqueror", "Pay the 450 Geo entry after Trial of the Warrior. Make use of spells during the elevated platform waves and prioritize the aerial enemies. Separate the two Oblobbles’ attacks and finish one before the other catches up. Collect the Pale Ore and Geo."],
        ["pale-ore-colosseum", ["pale-ore"], "Claim the Trial of the Conqueror Pale Ore", "Finish the second trial and collect its reward. It only gives this ore on the first clear."],
        ["trial-trial-fool", ["trial"], "Complete the Trial of the Fool", "Pay 800 Geo after clearing the Conqueror. Reach the wall-cling waves with enough masks and SOUL. Use wall jumps and quick Nail hits on the flying threats. In the final fight, focus on God Tamer’s beast. Defeating the beast ends the encounter."],
        ["simple-key-pale-lurker", ["simple-key"], "Take the Pale Lurker’s Simple Key", "From the Colosseum’s east side, check for the breakable wall behind the arena. Follow the Lurker’s trail through the hidden rooms, using spells or attacks when she pauses. Take the dropped key if you still need one for the Junk Pit."],
      ],
    },
    {
      title: "Summon the Troupe and make the choice",
      location: "Howling Cliffs · Dirtmouth",
      rows: [
        ["quest-nightmare-lantern", ["quest"], "Light the Nightmare Lantern in the Howling Cliffs", "From the lower Cliffs, break into the hidden corridor to the large corpse. Dream Nail it, return to the adjacent brazier and strike it until the lantern lights. Return to Dirtmouth for the tents."],
        ["charm-grimmchild", ["charm", "quest"], "Receive Grimmchild from Troupe Master Grimm", "Enter the larger tent and speak to Grimm. Equip Grimmchild before hunting flames. Use the flame markers on unlocked maps to locate the current trio."],
        ["quest-grimm-flames-one", ["quest"], "Collect the first two sets of three flames", "First collect Novice flames in Greenpath, City Storerooms and Crystal Peak with Grimmchild equipped, then return to Grimm. Equip the upgraded charm and collect the three Masters in King’s Pass, Resting Grounds and Kingdom’s Edge. Return to the tent."],
        ["boss-troupe-master-grimm", ["boss", "troupe-boss", "quest"], "Defeat Troupe Master Grimm", "Let him finish his bow. Watch for the teleport into a lunge, uppercut or cloak spikes and make one clean punish. Use the quiet moments to heal if safe. Return through his dialogue for the notch and the next flame stage."],
        ["notch-grimm-notch", ["notch"], "Collect Grimm’s Charm Notch", "Pick up the notch after defeating Troupe Master Grimm and finishing the encounter in the tent. The notch is separate from the boss’s 112% point."],
        ["quest-divine", ["quest"], "Complete Divine’s charm upgrades before banishing if you want them", "Wear a Fragile charm to her separate tent to offer it. She charges 12,000 Geo for Heart, 9,000 for Greed and 15,000 for Strength. Carrying a charm in her custody temporarily loses its percentage until recovered. Upgrade all three before the banishment if collecting Unbreakables through this route."],
        ["troupe-finale-grimm-finale", ["troupe-finale", "quest"], "Finish the Grimm Troupe quest by ritual or banishment", "For Ritual, collect any three of the four available final flames with Grimmchild equipped, then Dream Nail Grimm in the tent and defeat Nightmare King Grimm. For Banishment, speak to Brumm in Distant Village in the final stage, then meet him again at the Cliffs lantern and break it. Talk to Nymm in Dirtmouth for Carefree Melody. Either finale gives one point."],
      ],
    },
    {
      title: "Finish the Nail upgrades and the smith’s quest",
      location: "City of Tears · Greenpath",
      sources: [["Nail costs and ore", "https://teemo.dev/game-design/hollow-knight/systems/collectibles-and-completion-reference/"], ["Nailsmith’s two outcomes", "https://hollowknight.wiki/w/Nailsmith"]],
      compact: true,
      rows: [
        ["forge-coiled-nail", ["forge"], "Upgrade to the Coiled Nail", "Bring 2,000 Geo and 2 Pale Ore to the Nailsmith after the Channelled Nail."],
        ["forge-pure-nail", ["forge"], "Upgrade to the Pure Nail", "Bring 4,000 Geo and the final 3 Pale Ore to the Nailsmith. To see his story continue, walk away when he asks you to strike."],
        ["quest-nailsmith-sheo", ["quest"], "Visit the Nailsmith and Sheo together", "Leave the Nailsmith alive after forging the Pure Nail and return to Sheo’s hut in Greenpath. Speak to both for the Happy Couple outcome. Striking him with the Nail outside his own shop is the alternate Purity choice on a separate save."],
        ["pickup-salubra-blessing", ["pickup"], "Receive Salubra’s Blessing at 40 charms", "With all 40 charm slots collected, return to Salubra. Buy her final reward for 800 Geo if you want the completionist charm-shop milestone."],
      ],
    },
  ],
} satisfies RawChapter;
