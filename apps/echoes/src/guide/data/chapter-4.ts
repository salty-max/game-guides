import type { RawChapter } from "@hundo/core/types";

export default {
  id: 4,
  title: "Hyrule Castle",
  region: "Castle Town · Hyrule Castle",
  teaser: "Hyrule Castle",
  intro: "Finish both regional dungeons before returning to Lueburry. The route takes you under Castle Town and through the stilled version of the castle.",
  sources: [
    ["Castle Town approach and its chests", "https://www.nintendolife.com/guides/zelda-echoes-of-wisdom-still-missing-main-quest-guide"],
    ["Castle dungeon rooms and puzzle solutions", "https://www.nintendolife.com/guides/zelda-echoes-of-wisdom-hyrule-castle-dungeon-walkthrough"],
    ["Dungeon chest quantities and underwater maze", "https://www.thonky.com/zelda-echoes-of-wisdom/hyrule-castle"],
    ["Echo Ganon", "https://www.nintendolife.com/guides/zelda-echoes-of-wisdom-how-to-defeat-ganon"],
    ["Zelda's Bed and the restored castle", "https://www.linkshideaway.com/echoes-of-wisdom-walkthrough/hyrule-castle-dungeon/"],
  ],
  groups: [
    {
      title: "The well and the stilled town",
      rows: [
        ["story-still-missing", ["story"], "Start Still Missing at Lueburry's house", "After Gerudo Sanctum and Jabul Ruins, speak with Lueburry and the ministers. Follow the main road north to Castle Town, where the gates are blocked by the rift."],
        ["story-castle-town-well", ["story"], "Enter the rift at the bottom of the town well", "Go around to the northwest side of town and look behind the red-roofed house. Jump into the well and let Tri open a passage beside the guard."],
        ["waypoint-stilled-castle-town", ["dungeon-waypoint", "waypoint"], "Activate the stilled town Waypoint", "Climb through the guard house and exit south. Head east behind the shop, climb across the tilted building and follow the broken streets north past the fountain."],
        ["chest-stilled-castle-butter", ["chest", "overworld-chest"], "Open the chest of seven Radiant Butter by the stilled town Waypoint", "Check the chest near the stone before taking the water route up."],
        ["chest-stilled-castle-wall", ["chest", "overworld-chest"], "Open the 20-rupee chest on the castle wall", "Build west from the Waypoint to the top of the wall. Then return to the river, swim up and use the trees and echoes to reach the castle doors."],
      ],
    },
    {
      title: "Throne room and prison corridors",
      rows: [
        ["echo-darknut-2", ["echo"], "Learn Darknut Lv. 2 on the castle approach", "Go through the main hallway and fight the knight up the stairs. Attack from the flank. In the throne room, Bind and pull the throne away to uncover the ladder."],
        ["dungeon-waypoint-castle-prison", ["dungeon-waypoint", "waypoint"], "Activate the first prison Waypoint", "Descend to B1 and open the rotating door with Bind. Stay on the shelving to evade the guards. Move shrubs blocking the upper passage with Bind and take the far-right door."],
        ["dungeon-waypoint-castle-cell", ["dungeon-waypoint", "waypoint"], "Activate the Waypoint beyond Zelda's cell", "Use echoes to climb through the break in the wall beside Impa and go right. Touch the stone and climb down."],
        ["chest-castle-monster-stone", ["chest","dungeon-chest"], "Open the Monster Stone chest on the western side of the prison shaft", "In the side-view shaft, take out the Darknuts and Caromadillo. Keep left as you descend to the ledge with this chest."],
        ["chest-castle-nectar", ["chest","dungeon-chest"], "Open the five-Floral-Nectar chest on the lower ledge", "Return toward the top of the shaft and take the right route down. On the ledge with two chests, open the left chest."],
        ["chest-castle-pumpkins", ["chest","dungeon-chest"], "Open the three-Twisted-Pumpkin chest beside the nectar", "Open the right chest on the paired ledge. Then take the lowest ladder out."],
        ["story-castle-four-torches", ["story"], "Light all four torches in the prison passage", "Hold Y to summon Ignizol through the grates at range. Reach the high braziers from the ladder. For the one isolated behind the wall, place Ignizol through the right grate, Bind it and walk north to move it next to the torch."],
      ],
    },
    {
      title: "B2 and the boss door",
      rows: [
        ["echo-gustmaster", ["echo"], "Learn Gustmaster in the B2 gap room", "Send a flying echo or arrows to knock out a reachable Gustmaster. Use beds or Water Blocks to cross the gaps without standing in its wind."],
        ["chest-castle-dungeon-map", ["chest","dungeon-chest"], "Uncover the Dungeon Map in the sand room", "Go east from the Ignizols and clear the sand with Wind Cannon. Pull out the revealed chest with Bind. Return and take the upper route north."],
        ["dungeon-waypoint-castle-boss", ["dungeon-waypoint", "waypoint"], "Activate the boss hall Waypoint", "Touch it before exploring the west and east branches. Start west and descend the ladder on the central platform."],
        ["chest-castle-water-20", ["chest","dungeon-chest"], "Open the 20-rupee chest in the dark underwater maze", "Swim left and down past the first Bio Deku Baba. Use Bind on its head if it blocks the route and descend to the chest."],
        ["chest-castle-water-100", ["chest","dungeon-chest"], "Open the deeper 100-rupee chest", "Go farther down and left. Refill air from the bubbles and work past the second plant to the other chest. Cut the dark barrier in Swordfighter Form and surface on the left."],
        ["chest-castle-small-key", ["chest","dungeon-chest"], "Trip the raised switch for the Small Key", "In the guard room, build high above the patrol route and reach the raised switch. Open the chest it reveals, then warp back to the boss hall."],
        ["chest-castle-bomb-wall", ["chest","dungeon-chest"], "Blast the cracked wall for 50 rupees", "Take the east door from the boss hall. Clear the sand enemies, use Bombfish on the cracked east wall and build up to the hole. Open the chest inside."],
        ["echo-ball-and-chain-trooper", ["echo"], "Learn Ball-and-Chain Trooper in the armored guard room", "Take the south ladder beyond the cracked wall and use the key. Cross the side-view rooms with flying echoes or Strandtula silk. In the final fight, let an echo distract the gold-armored trooper and attack between its swings."],
        ["chest-castle-big-key", ["chest","dungeon-chest"], "Open the Big Key chest north of the armored guard room", "Clear the whole fight to open the north door. Take the large chest before checking the other two."],
        ["chest-castle-frog-ring", ["chest","dungeon-chest","accessory"], "Open the Frog Ring chest beside the Big Key", "Take the accessory from the same reward room. Equip it to make Zelda's jump higher."],
        ["chest-castle-golden-egg", ["chest","dungeon-chest"], "Open the Golden Egg chest beside the Big Key", "Take the remaining chest before returning to the boss hall."],
      ],
    },
    {
      title: "Restore Hyrule Castle",
      note: "Eldin, Hebra and Faron can now be tackled in any order. This route goes to Eldin first for the fire echoes.",
      rows: [
        ["crystal-hyrule-castle-clear", ["might-crystal"], "Defeat Echo Ganon and receive five Might Crystals", "Use the Big Key on the north door. Move sideways as he thrusts or throws his trident, then send an echo in while he recovers. In the fireball phase, use Swordfighter Form to return the large orb until it stuns him. In the last phase, watch for the faster charge as he reappears and keep your damage windows short.", { quantity: 5 }],
        ["container-echo-ganon", ["heart-container"], "Collect Echo Ganon's Heart Container", "Pick up the full heart before continuing through the exit."],
        ["echo-zeldas-bed", ["echo"], "Learn Zelda's Bed after waking up", "Use the Tri Rod on the bed in Zelda's room before going to the throne room."],
        ["outfit-royal-travel-attire", ["outfit","story"], "Receive the Royal Travel Attire", "Speak to the king and Impa in the throne room. The conversation completes Still Missing and opens Lands of the Goddesses."],
      ],
    },
  ],
} satisfies RawChapter;
