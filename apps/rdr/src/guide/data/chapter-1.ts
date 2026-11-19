import type { RawChapter } from "@hundo/core/types";

export default {
  id: 1,
  title: "New Austin",
  region: "Armadillo · MacFarlane’s Ranch · Fort Mercer",
  teaser: "New Austin",
  intro: "Get your bearings at the ranch, work through the leads around Armadillo, and pick up the early jobs, maps and challenges as you ride.",
  groups: [
    {
      title: "A foothold in New Austin",
      location: "Armadillo · MacFarlane’s Ranch",
      sources: [
        ["iRedDead · story missions", "https://www.ireddead.com/rdr/guides/story-mission-list"],
      ],
      rows: [
        ["mission-exodus-in-america", ["mission"], "Exodus in America", "This starts when you begin a new game. Once you control John in Armadillo, go to the saloon marker and meet Jake. Mount the horse outside and match Jake’s pace, waiting for the train before you cross the tracks. Stay with him until he stops outside Fort Mercer, then ride up to the entrance marker. The rest is scripted and the next mission starts automatically.", { reference: "https://www.ireddead.com/rdr/guides/exodus-in-america" }],
        ["mission-new-friends-old-problems", ["mission"], "New Friends, Old Problems", "Leave your room at MacFarlane’s Ranch and find Bonnie on the main house porch. Mount the horse across the road and follow her tour. At night, follow her to the garden and shoot the rabbits among the crops. Ride on to the chicken coops and clear the coyotes before they reach the chickens. Use the on-screen Dead Eye prompt if they’re moving too quickly. Hitch your horse at the marked post to finish. The trunk in your room supplies extra ammo.", { reference: "https://www.ireddead.com/rdr/guides/new-friends-old-problems" }],
        ["mission-obstacles-in-our-path", ["mission"], "Obstacles in Our Path", "Talk to Bonnie at the ranch, mount up and follow her to the barn. When the race starts, follow the smoke plumes and yellow checkpoints around Hennigan’s Stead and back through the ranch. Ease off the gallop button through the trees and tight bends so you don’t miss a marker. Afterward, Bonnie’s Armadillo trip and Marshal Johnson’s first mission are both available.", { reference: "https://www.ireddead.com/rdr/guides/obstacles-in-our-path" }],
        ["mission-this-is-armadillo-usa", ["mission"], "This Is Armadillo, USA", "Meet Bonnie at the ranch and take the driver’s seat. Stay on the yellow route as it descends toward Armadillo. Pull up at the marker and visit the doctor’s counter for the free Medicine. Leave the shop and meet Bonnie outside. You can buy safehouses and play Poker once this is done.", { reference: "https://www.ireddead.com/rdr/guides/this-is-armadillo-usa" }],
        ["mission-women-and-cattle", ["mission"], "Women and Cattle", "Find Bonnie at the main house. Ride with her to the pen on the southwest side of the ranch and move behind the cattle. Drive them across the tracks to join the larger herd. Work behind the group to push it forward and ride out toward the side that’s drifting to steer it back. Bring the combined herd to the old oak at the yellow marker.", { reference: "https://www.ireddead.com/rdr/guides/women-and-cattle" }],
        ["mission-wild-horses-tamed-passions", ["mission"], "Wild Horses, Tamed Passions", "Meet Bonnie and Drew at the ranch. Follow them to the wild herd, equip the Lasso and rope a horse at close range. Keep holding aim while you dismount, then mount the roped horse. Counter John’s lean with small sideways inputs until it settles. Break a second horse with Bonnie. Then drive the next herd into the canyon, chase the golden stallion that breaks away and tame it. Ride it back to Bonnie. The Lasso is now available for live bounties and later missions.", { reference: "https://www.ireddead.com/rdr/guides/wild-horses-tamed-passions" }],
        ["mission-a-tempest-looms", ["mission"], "A Tempest Looms", "Return to Bonnie after learning to break horses. Round up the first herd southeast of the ranch, swing behind the stragglers and gather them at the waypoint. When the cattle stampede, sprint past them to the front and turn them away from the cliff. Once they slow down, return behind the herd and guide it to the ranch. Let the cattle file into the pen at their own pace. This also opens the optional I Know You Stranger strand.", { reference: "https://www.ireddead.com/rdr/guides/a-tempest-looms" }],
      ],
    },
    {
      title: "Marshal Johnson and the ranch",
      location: "Armadillo · Pike’s Basin · Tumbleweed",
      sources: [
        ["iRedDead · story missions", "https://www.ireddead.com/rdr/guides/story-mission-list"],
      ],
      rows: [
        ["mission-political-realities-in-armadillo", ["mission"], "Political Realities in Armadillo", "Meet Marshal Johnson at the Armadillo jail after Bonnie’s race. Follow him to the saloon, call your horse and tail Walton Lowe to Pleasance House. Dismount with the marshal and advance from cover to cover, starting at the wagon and moving past the crates and outhouse. Clear the gang around the house. You can wound Walton in the leg and let Johnson take him in, or defeat him outright.", { reference: "https://www.ireddead.com/rdr/guides/political-realities-in-armadillo" }],
        ["mission-justice-in-pikes-basin", ["mission"], "Justice in Pike’s Basin", "Meet Johnson again at the jail and ride to the western canyon entrance. Clear the first band of rustlers, including the shooter on high ground, then pick either branch. The marshal goes up the right ridge and his deputies take the other route. Use the rocks for cover and watch across the bridges for snipers. Regroup with the lawmen near the last camp, clear the rustlers and approach the freed ranch hands. The repeatable Pike’s Basin hideout opens after this mission.", { reference: "https://www.ireddead.com/rdr/guides/justice-in-pikes-basin" }],
        ["mission-old-swindler-blues", ["mission"], "Old Swindler Blues", "Find Nigel West Dickens at the roadside marker southeast of Armadillo once the Marshal’s Pike’s Basin mission is done. Drive his wagon back to town on the marked road. Nigel’s health falls if the wagon jolts off the trail, collides or takes fire. Use Dead Eye on the mounted pursuers when they close in and keep the wagon moving. Stop opposite the doctor’s office.", { reference: "https://www.ireddead.com/rdr/guides/old-swindler-blues" }],
        ["mission-spare-the-rod-spoil-the-bandit", ["mission"], "Spare the Rod, Spoil the Bandit", "Check Johnson’s jail marker after Women and Cattle, Justice in Pike’s Basin and Old Swindler Blues. Ride with the lawmen and investigate the marked camps. At Ridgewood Farm, check the shed and outhouse, then clear the farmhouse from outside to inside. Search both floors. In the last upstairs room, use Dead Eye for a clean shot at the gunman holding the hostage. Regroup at the shed, ride out with the lawmen and repel both mounted waves at Mercer Station.", { reference: "https://www.ireddead.com/rdr/guides/spare-the-rod-spoil-the-bandit" }],
        ["mission-the-burning", ["mission"], "The Burning", "Go back to Bonnie after A Tempest Looms and the Marshal’s farm mission. Ride with her to find Drew, then hurry back to the ranch. The barn doors are blocked from outside. Climb the marked awning to the left, follow the ledge around the side and enter the loft. Drop to the barn floor and open the doors. Drive the first two horses out with the prompt, then mount the last one and jump the fallen beams at the exit.", { reference: "https://www.ireddead.com/rdr/guides/the-burning" }],
        ["mission-hanging-bonnie-macfarlane", ["mission"], "Hanging Bonnie MacFarlane", "After The Burning, meet Johnson in Armadillo and escort the party to Tumbleweed. When the exchange turns into a fight, take cover and deal with the shooter on the church roof before advancing between the buildings. Once the rescue timer starts, get to Bonnie’s rope quickly and use the cut-down prompt. Shooting the rope from a clear angle is also possible. Stay on the marked rescue objective if the firefight is taking too long.", { reference: "https://www.ireddead.com/rdr/guides/hanging-bonnie-macfarlane" }],
      ],
    },
    {
      title: "West Dickens and Seth",
      location: "Armadillo · Ridgewood Farm · Coot’s Chapel · Tumbleweed",
      sources: [
        ["iRedDead · story missions", "https://www.ireddead.com/rdr/guides/story-mission-list"],
      ],
      rows: [
        ["mission-you-shall-not-give-false-testimony-except-for-profit", ["mission"], "You Shall Not Give False Testimony, Except for Profit", "Meet Nigel by the doctor’s office after escorting him and completing Women and Cattle. Drive to Ridgewood Farm, dismount at the outskirts and walk to the show. Shoot the skull on the porch. Use the newly unlocked Dead Eye to hit Aquila’s hat in the air, then beat him in the fistfight. When he draws, use Dead Eye to tag his gun hand and disarm him. This opens Seth’s marker once you have the Lasso.", { reference: "https://www.ireddead.com/rdr/guides/you-shall-not-give-false-testimony-except-for-profit" }],
        ["mission-exhuming-and-other-fine-hobbies", ["mission"], "Exhuming and Other Fine Hobbies", "Bring the Lasso from Bonnie’s horsebreaking mission and find Seth at Coot’s Chapel after Nigel’s demonstration. Ride to Benedict Point, steal a deputy’s horse and ride outside the search area until the pursuit ends. Return to Seth, chase Moses, then lasso and hogtie him. Carry him back to Seth. Clear the bounty at the station clerk with cash or the Pardon Letter Seth provides.", { reference: "https://www.ireddead.com/rdr/guides/exhuming-and-other-fine-hobbies" }],
        ["mission-a-gentle-drive-with-friends", ["mission"], "A Gentle Drive with Friends", "Return to Seth at Coot’s Chapel and drive the wagon while he searches his cargo. Follow the marked route around Armadillo and watch the rail crossing. The mounted attackers come in several groups. Deal with the fire-bottle throwers first and avoid rolling the wagon off the road. When Seth finds what he needs and the destination changes, follow the new marker to Tumbleweed.", { reference: "https://www.ireddead.com/rdr/guides/a-gentle-drive-with-friends" }],
        ["mission-let-the-dead-bury-their-dead", ["mission"], "Let the Dead Bury Their Dead", "Meet Seth at Tumbleweed’s church. Clear the streets with him, watching the rocks and the shooter in the mansion’s upper window. Try the mansion’s front door at the marker, then go around the left side and down the basement stairs. Fight up through the rooms, use the opening in the wall on the first floor, then head upstairs to the chest. Let Seth reach it to finish his strand.", { reference: "https://www.ireddead.com/rdr/guides/let-the-dead-bury-their-dead" }],
        ["mission-liars-cheats-and-other-proud-americans", ["mission"], "Liars, Cheats and Other Proud Americans", "After Seth’s first mission, meet Nigel at Ridgewood Farm and ride with him to Gaptooth Breach. Get into the racing cart at the start line and take first place. Use the smoke markers to find the bends, easing up early on narrow stretches so the cart stays under control. Gunfire disqualifies you. Return to Nigel’s wagon after the finish and ride with him to Benedict Point. Irish’s first marker opens from here.", { reference: "https://www.ireddead.com/rdr/guides/liars-cheats-and-other-proud-americans" }],
      ],
    },
    {
      title: "Firepower and the last wager",
      location: "Armadillo · Gaptooth Ridge · Thieves’ Landing",
      sources: [
        ["iRedDead · story missions", "https://www.ireddead.com/rdr/guides/story-mission-list"],
      ],
      rows: [
        ["mission-a-frenchman-a-welshman-and-an-irishman", ["mission"], "A Frenchman, a Welshman and an Irishman", "Find Irish at the barn in Armadillo after Nigel’s cart race. Deal with his two attackers, then ride with him to the ridge overlooking Lake Don Julio. Go down to the cabin, using the slope and rocks to keep cover while the guards spread out. Clear the guards outside, deal with the one who comes out of the cabin, then enter the building to finish.", { reference: "https://www.ireddead.com/rdr/guides/a-frenchman-a-welshman-and-an-irishman" }],
        ["mission-man-is-born-unto-trouble", ["mission"], "Man Is Born Unto Trouble", "Meet Irish in Benedict Point and follow him to the side of Gaptooth Breach. Clear the riders and the camp at the mine entrance. Inside, clear the turns in the tunnel and watch for explosive crates. At the bottom, secure the gun and take the cart to the lift marker. Once Irish raises it, guide the cart out on the surface tracks, clearing enemies and any marked obstacles ahead. Deliver it to his wagon. The repeatable Gaptooth Breach hideout opens after this mission.", { reference: "https://www.ireddead.com/rdr/guides/man-is-born-unto-trouble" }],
        ["mission-on-shakys-ground", ["mission"], "On Shaky’s Ground", "Find Irish in Thieves’ Landing. Follow him around the warehouse and use the outside ladders to reach the roof and open window. Clear the guard by the office and the men inside to free Shaky. Move through the warehouse with him and clear the loading area on the way to the ammunition. Once you join Irish’s wagon, cover the escape from mounted pursuers until the wagon stops.", { reference: "https://www.ireddead.com/rdr/guides/on-shakys-ground" }],
        ["mission-can-a-swindler-change-his-spots", ["mission"], "Can a Swindler Change His Spots?", "After the cart race, find Nigel in Plainview. Walk to the marker for his pitch, then get aboard his wagon as the crowd turns hostile. Take out mounted pursuers when they come alongside. At the wagon blockade, hit the explosive crate shown at the back of the barricade to open the route. Clear the last attackers and stay aboard until Cueva Seca.", { reference: "https://www.ireddead.com/rdr/guides/can-a-swindler-change-his-spots" }],
        ["mission-the-sport-of-kings-and-liars", ["mission"], "The Sport of Kings, and Liars", "Meet Nigel at Cueva Seca and ride to Rathskeller Fork. Approach the start marker for the mounted race. Keep your eyes on the smoke checkpoints, especially on the narrow route around Tumbleweed. Alternate bursts of speed with brief rests to keep stamina in reserve. Win the race and meet Nigel at the finish.", { reference: "https://www.ireddead.com/rdr/guides/the-sport-of-kings-and-liars" }],
      ],
    },
    {
      title: "The fort",
      location: "Fort Mercer",
      sources: [
        ["iRedDead · story missions", "https://www.ireddead.com/rdr/guides/story-mission-list"],
      ],
      rows: [
        ["mission-the-assault-on-fort-mercer", ["mission"], "The Assault on Fort Mercer", "When the ranch and Marshal business, Seth’s treasure, Irish’s ammunition run and Nigel’s last race are wrapped up, head to the marker overlooking Fort Mercer. Use the wagon’s mounted gun to clear the courtyard, sweeping the stairs and doorways as new groups appear. Follow Johnson up the steps on foot and clear the inner fort. Return to the wagon’s gun when the reinforcements arrive and protect your allies until the fight ends. The river-crossing mission is next.", { reference: "https://www.ireddead.com/rdr/guides/the-assault-on-fort-mercer" }],
      ],
    },
    {
      title: "Strangers on the ranch roads",
      location: "Hennigan’s Stead · Armadillo",
      sources: [
        ["iRedDead · Stranger tasks", "https://www.ireddead.com/rdr/guides/stranger-side-mission-list"],
      ],
      rows: [
        ["stranger-flowers-for-a-lady", ["stranger", "stranger-step"], "Flowers for a Lady", "After New Friends, Old Problems, meet Billy West on the road from MacFarlane’s Ranch toward Thieves’ Landing. Bring three Wild Feverfew from Hennigan’s Stead, three Red Sage from Rio Bravo, and three Desert Sage from Gaptooth Ridge. Existing flowers in your satchel count. Hand the bouquet over at Billy’s cabin just farther along the road. If you already have all nine flowers, let about six in-game hours pass for the delivery marker.", { reference: "https://www.ireddead.com/rdr/guides/flowers-for-a-lady" }],
        ["stranger-let-no-man-put-asunder", ["stranger", "stranger-step"], "Let No Man Put Asunder", "After Obstacles in Our Path, talk to Alma in the ruins on the road to Coot’s Chapel. Find Nathan inside the Armadillo saloon and pay him $5 for the information. Ride west to Odd Fellow’s Rest and inspect Peter’s marked headstone inside the cemetery.", { reference: "https://www.ireddead.com/rdr/guides/let-no-man-put-asunder" }],
        ["stranger-jennys-faith", ["stranger", "stranger-step"], "Jenny’s Faith", "After This Is Armadillo, USA, find Jenny beside a rock east of Ridgewood Farm. Talk to her and hand over one Medicine from your satchel. If you’re out, buy Medicine from the doctor in Armadillo and return to the same spot.", { reference: "https://www.ireddead.com/rdr/guides/jennys-faith" }],
        ["stranger-water-and-honesty", ["stranger", "stranger-step"], "Water and Honesty", "After Political Realities in Armadillo, meet Andrew McAllister at the camp on the western edge of Hennigan’s Stead, overlooking Lake Don Julio. Ride northwest of Armadillo to Pleasance House, pay Clyde Evans $200 for the deed, then take it back to McAllister to close the task. McAllister takes ownership of the house when you hand over the deed.", { reference: "https://www.ireddead.com/rdr/guides/water-and-honesty" }],
        ["stranger-american-appetites-first-report", ["stranger-step"], "American Appetites: the first report", "After Political Realities in Armadillo, talk to the crying woman beside Armadillo’s sheriff’s office. Ride to the purple search area northeast of The Hanging Rock and inspect the marked clue.", { reference: "https://www.ireddead.com/rdr/guides/american-appetites" }],
        ["stranger-american-appetites-second-report", ["stranger-step"], "American Appetites: the second report", "Once Justice in Pike’s Basin is done and about a day has passed since the first search, a man on the sheriff’s office porch reports his wife missing. Investigate the marked area northeast of The Hanging Rock again.", { reference: "https://www.ireddead.com/rdr/guides/american-appetites" }],
        ["stranger-american-appetites", ["stranger", "stranger-step"], "American Appetites", "Once Wild Horses, Tamed Passions is done and about a day has passed since the second search, a woman inside the sheriff’s office reports her husband missing. At the marked area, talk to the injured man, then lasso and hogtie the man who runs and bring him back. For the positive-honor ending, hogtie or kill the injured man and free the man you brought back.", { reference: "https://www.ireddead.com/rdr/guides/american-appetites" }],
      ],
    },
    {
      title: "Strangers in Gaptooth Ridge",
      location: "Gaptooth Ridge · Rathskeller Fork",
      sources: [
        ["iRedDead · Stranger tasks", "https://www.ireddead.com/rdr/guides/stranger-side-mission-list"],
      ],
      rows: [
        ["stranger-california-gaptooth-ridge", ["stranger-step"], "California: Gaptooth Ridge", "After Women and Cattle, look for Sam Odessa playing harmonica beside a rock in Gaptooth Ridge and talk to him.", { reference: "https://www.ireddead.com/rdr/guides/california" }],
        ["stranger-california-cueva-seca", ["stranger-step"], "California: Cueva Seca", "Allow about two in-game days after the first meeting, then find Sam again at Cueva Seca and talk to him.", { reference: "https://www.ireddead.com/rdr/guides/california" }],
        ["stranger-california-tumbleweed-canyon", ["stranger-step"], "California: the canyon by Tumbleweed", "About two in-game days later, his marker is in the canyon northeast of Tumbleweed. Talk to him there.", { reference: "https://www.ireddead.com/rdr/guides/california" }],
        ["stranger-california", ["stranger", "stranger-step"], "California", "About two in-game days later, go to the marker on the road south of Tumbleweed. Take the letter you find there and deliver it at the freight station counter in Armadillo.", { reference: "https://www.ireddead.com/rdr/guides/california" }],
        ["stranger-who-are-you-to-judge", ["stranger", "stranger-step"], "Who Are You to Judge?", "After Liars, Cheats and Other Proud Americans, speak to Jeb by the stables at Rathskeller Fork. Approach Tumbleweed from the north and find the woman and horse at the small stable by the road. Speak to her, lead them back to Rathskeller Fork, and talk to Jeb again at his marker.", { reference: "https://www.ireddead.com/rdr/guides/who-are-you-to-judge" }],
      ],
    },
    {
      title: "Strangers around Benedict Point",
      location: "Benedict Point · Gaptooth Breach · Pike’s Basin · Armadillo · Thieves’ Landing",
      sources: [
        ["iRedDead · Stranger tasks", "https://www.ireddead.com/rdr/guides/stranger-side-mission-list"],
      ],
      rows: [
        ["stranger-funny-man-benedict-point", ["stranger-step"], "Funny Man: Benedict Point", "After Exhuming and Other Fine Hobbies, talk to Jimmy Saint on a bench inside Benedict Point station.", { reference: "https://www.ireddead.com/rdr/guides/funny-man" }],
        ["stranger-funny-man-gaptooth-breach", ["stranger-step"], "Funny Man: Gaptooth Breach", "After Man Is Born Unto Trouble, and at least six in-game hours after meeting him, Jimmy is tied up behind crates in the elevator room of the Gaptooth Breach mine. Go in by the main entrance, keep left at each fork, cut him free and get him out alive. Saving at a safehouse or camp passes the hours.", { reference: "https://www.ireddead.com/rdr/guides/funny-man" }],
        ["stranger-funny-man-pikes-basin", ["stranger-step"], "Funny Man: Pike’s Basin", "At least six in-game hours after the mine, find Jimmy tied up by the fire at the southern camp in Pike’s Basin. Cut him free and make sure he gets out alive.", { reference: "https://www.ireddead.com/rdr/guides/funny-man" }],
        ["stranger-lights-camera-action-deed", ["stranger-step"], "Lights, Camera, Action: the deed", "After The Sport of Kings, and Liars, speak to MacKenna behind the Armadillo cinema. In either order, win the deed at the Thieves’ Landing saloon’s Liar’s Dice table, which takes a $200 stake, and disarm Spatchcock in a duel at Benedict Point by marking his gun hand. If you kill him, try again a day later. Bring the deed back to MacKenna at the cinema.", { reference: "https://www.ireddead.com/rdr/guides/lights-camera-action" }],
      ],
    },
    {
      title: "A missable encounter",
      location: "Cliffs near MacFarlane’s Ranch",
      sources: [
        ["iRedDead · I Know You", "https://www.ireddead.com/rdr/guides/i-know-you"],
      ],
      rows: [
        ["optional-i-know-you-start", ["optional"], "Start I Know You", "After A Tempest Looms, speak to the man overlooking the canyon southwest of MacFarlane’s Ranch. Then meet his contact in front of the Thieves’ Landing saloon and choose whether to encourage or discourage him. The remaining encounters open as the story progresses. Finish this optional chain before the last main mission if you want to see it.", { reference: "https://www.ireddead.com/rdr/guides/i-know-you" }],
      ],
    },
    {
      title: "Elegant Suit and Bollard Twins scraps",
      location: "Thieves’ Landing · Hennigan’s Stead",
      sources: [
        ["iRedDead · outfits", "https://www.ireddead.com/rdr/guides/outfits"],
      ],
      map: ["iRedDead", "https://www.ireddead.com/rdr/maps/bollard-twins-outfit"],
      rows: [
        ["outfit-elegant", ["outfit"], "Elegant Suit", "Play poker or visit Thieves’ Landing to reveal the suit for purchase. Buy it from the tailor in Thieves’ Landing and verify it’s unlocked in the Outfits menu.", { reference: "https://www.ireddead.com/rdr/maps/elegant-suit", map: ["iRedDead", "https://www.ireddead.com/rdr/maps/elegant-suit"] }],
        ["scrap-bollard-1", ["scrap"], "Bollard Twins 1 · Warehouse chest", "Enter the large warehouse near the southern approach to Thieves’ Landing. Go upstairs and open the chest in the back office.", { reference: "https://www.ireddead.com/rdr/maps/bollard-twins-outfit" }],
        ["scrap-bollard-2", ["scrap"], "Bollard Twins 2 · Ranch Nightwatch", "Accept the Nightwatch job at MacFarlane’s Ranch after dark. Follow the patrol dog, handle any disturbances, and finish the shift.", { reference: "https://www.ireddead.com/rdr/maps/bollard-twins-outfit" }],
        ["scrap-bollard-3", ["scrap"], "Bollard Twins 3 · Ranch Horseshoes", "Win a full game at the horseshoe pit at MacFarlane’s Ranch. Aim the middle of the shoe at the stake and release near the marked power band.", { reference: "https://www.ireddead.com/rdr/maps/bollard-twins-outfit" }],
        ["scrap-bollard-4", ["scrap"], "Bollard Twins 4 · Live bounty", "Read the gang affiliation on a New Austin wanted poster. For a Bollard Twins target, use the lasso after Wild Horses, Tamed Passions, hogtie them, and deliver them alive to the indicated jail.", { reference: "https://www.ireddead.com/rdr/maps/bollard-twins-outfit" }],
        ["scrap-bollard-5", ["scrap"], "Bollard Twins 5 · Defend Hennigan’s Stead", "Respond to a blue-dot roadside event in Hennigan’s Stead where Bollard Twins are attacking residents. Look along the MacFarlane’s Ranch–Armadillo road and check the Outfits menu after the defense. The encounter is random, so revisit on a later trip if it doesn’t spawn.", { reference: "https://www.ireddead.com/rdr/maps/bollard-twins-outfit" }],
        ["scrap-bollard-6", ["scrap"], "Bollard Twins 6 · Tailor’s scrap", "Buy the Bollard Gang Scrap from the tailor in Thieves’ Landing.", { reference: "https://www.ireddead.com/rdr/maps/bollard-twins-outfit" }],
        ["outfit-bollard", ["outfit"], "Bollard Twins Outfit", "Complete the six Bollard Twins scrap objectives and check that the outfit is available to equip. The outfit itself earns the completion credit.", { reference: "https://www.ireddead.com/rdr/maps/bollard-twins-outfit" }],
      ],
    },
    {
      title: "Treasure Hunter outfit scraps",
      location: "Gaptooth Ridge · Thieves’ Landing",
      sources: [
        ["iRedDead · outfits", "https://www.ireddead.com/rdr/guides/outfits"],
      ],
      map: ["iRedDead", "https://www.ireddead.com/rdr/maps/treasure-hunter-outfit"],
      rows: [
        ["scrap-treasure-1", ["scrap"], "Treasure Hunter 1 · Silent Stead chest", "At Silent Stead, look inside the small house northwest of the road junction and open the chest.", { reference: "https://www.ireddead.com/rdr/maps/treasure-hunter-outfit" }],
        ["scrap-treasure-2", ["scrap"], "Treasure Hunter 2 · California", "Complete all of Sam Odessa’s encounters in California, ending by delivering his letter to the freight station in Armadillo.", { reference: "https://www.ireddead.com/rdr/maps/treasure-hunter-outfit" }],
        ["scrap-treasure-3", ["scrap"], "Treasure Hunter 3 · Rathskeller Fork Blackjack", "Play Blackjack at Rathskeller Fork. Leave the table after finishing a hand with a higher chip total than you bought in with.", { reference: "https://www.ireddead.com/rdr/maps/treasure-hunter-outfit" }],
        ["scrap-treasure-4", ["scrap"], "Treasure Hunter 4 · Live bounty", "Watch the Rathskeller Fork wanted board for a target affiliated with the Treasure Hunters. Lasso and hogtie the target, then deliver them alive.", { reference: "https://www.ireddead.com/rdr/maps/treasure-hunter-outfit" }],
        ["scrap-treasure-5", ["scrap"], "Treasure Hunter 5 · Gaptooth Breach", "After Man Is Born Unto Trouble, return to Gaptooth Breach in free roam and complete its gang hideout objective.", { reference: "https://www.ireddead.com/rdr/maps/treasure-hunter-outfit" }],
        ["scrap-treasure-6", ["scrap"], "Treasure Hunter 6 · Tailor’s scrap", "Purchase the Treasure Hunter Scrap from the tailor in Thieves’ Landing. Check the shop’s displayed price before budgeting for the purchase.", { reference: "https://www.ireddead.com/rdr/maps/treasure-hunter-outfit" }],
        ["outfit-treasure", ["outfit"], "Treasure Hunter Outfit", "Finish all six Treasure Hunter scrap objectives, then check the Outfits menu for the unlocked outfit.", { reference: "https://www.ireddead.com/rdr/maps/treasure-hunter-outfit" }],
      ],
    },
    {
      title: "Cholla Springs map locations",
      location: "Cholla Springs",
      note: "Buy the Cholla Springs map at the Armadillo general store and use it from your satchel. You can also ride close enough to discover each entry. Check this list against the labels on your world map.",
      sources: [
        ["iRedDead · location map", "https://www.ireddead.com/rdr/maps/towns-and-locations"],
      ],
      map: ["iRedDead", "https://www.ireddead.com/rdr/maps/towns-and-locations"],
      rows: [
        ["location-cholla-springs", ["location"], "Cholla Springs", ""],
        ["location-armadillo", ["location"], "Armadillo", ""],
        ["location-coots-chapel", ["location"], "Coot’s Chapel", ""],
        ["location-critchleys-ranch", ["location"], "Critchley’s Ranch", ""],
        ["location-hamlins-passing", ["location"], "Hamlin’s Passing", ""],
        ["location-jorges-gap", ["location"], "Jorge’s Gap", ""],
        ["location-lake-don-julio", ["location"], "Lake Don Julio", ""],
        ["location-mercer-station", ["location"], "Mercer Station", ""],
        ["location-odd-fellows-rest", ["location"], "Odd Fellow’s Rest", ""],
        ["location-pleasance-house", ["location"], "Pleasance House", ""],
        ["location-rattlesnake-hollow", ["location"], "Rattlesnake Hollow", ""],
        ["location-ridgewood-farm", ["location"], "Ridgewood Farm", ""],
        ["location-rileys-charge", ["location"], "Riley’s Charge", ""],
        ["location-rio-del-lobo", ["location"], "Río del Lobo", ""],
        ["location-the-hanging-rock", ["location"], "The Hanging Rock", ""],
        ["location-twin-rocks", ["location"], "Twin Rocks", ""],
        ["location-two-crows", ["location"], "Two Crows", ""],
        ["location-venters-place", ["location"], "Venter’s Place", ""],
      ],
    },
    {
      title: "Río Bravo map locations",
      location: "Río Bravo",
      note: "Buy the Río Bravo map at the Thieves’ Landing general store and use it from your satchel. You can also ride close enough to discover each entry. Check this list against the labels on your world map.",
      sources: [
        ["iRedDead · location map", "https://www.ireddead.com/rdr/maps/towns-and-locations"],
      ],
      map: ["iRedDead", "https://www.ireddead.com/rdr/maps/towns-and-locations"],
      rows: [
        ["location-rio-bravo", ["location"], "Río Bravo", ""],
        ["location-del-lobo-rock", ["location"], "Del Lobo Rock", ""],
        ["location-fort-mercer", ["location"], "Fort Mercer", ""],
        ["location-frontera-bridge", ["location"], "Frontera Bridge", ""],
        ["location-plainview", ["location"], "Plainview", ""],
        ["location-repentance-rock", ["location"], "Repentance Rock", ""],
      ],
    },
    {
      title: "Hennigan’s Stead map locations",
      location: "Hennigan’s Stead",
      note: "Buy the Hennigan’s Stead map at the MacFarlane’s Ranch general store and use it from your satchel. You can also ride close enough to discover each entry. Check this list against the labels on your world map.",
      sources: [
        ["iRedDead · location map", "https://www.ireddead.com/rdr/maps/towns-and-locations"],
      ],
      map: ["iRedDead", "https://www.ireddead.com/rdr/maps/towns-and-locations"],
      rows: [
        ["location-hennigans-stead", ["location"], "Hennigan’s Stead", ""],
        ["location-brittlebrush-trawl", ["location"], "Brittlebrush Trawl", ""],
        ["location-butter-bridge", ["location"], "Butter Bridge", ""],
        ["location-greenhollow", ["location"], "Greenhollow", ""],
        ["location-macfarlanes-ranch", ["location"], "MacFarlane’s Ranch", ""],
        ["location-mescalero", ["location"], "Mescalero", ""],
        ["location-pikes-basin", ["location"], "Pike’s Basin", ""],
        ["location-stillwater-creek", ["location"], "Stillwater Creek", ""],
        ["location-the-old-bacchus-place", ["location"], "The Old Bacchus Place", ""],
        ["location-thieves-landing", ["location"], "Thieves’ Landing", ""],
        ["location-warthington-ranch", ["location"], "Warthington Ranch", ""],
      ],
    },
    {
      title: "Gaptooth Ridge map locations",
      location: "Gaptooth Ridge",
      note: "Buy the Gaptooth Ridge map at the Armadillo general store and use it from your satchel. You can also ride close enough to discover each entry. Check this list against the labels on your world map.",
      sources: [
        ["iRedDead · location map", "https://www.ireddead.com/rdr/maps/towns-and-locations"],
      ],
      map: ["iRedDead", "https://www.ireddead.com/rdr/maps/towns-and-locations"],
      rows: [
        ["location-gaptooth-ridge", ["location"], "Gaptooth Ridge", ""],
        ["location-benedict-pass", ["location"], "Benedict Pass", ""],
        ["location-benedict-point", ["location"], "Benedict Point", ""],
        ["location-cueva-seca", ["location"], "Cueva Seca", ""],
        ["location-gaptooth-breach", ["location"], "Gaptooth Breach", ""],
        ["location-rathskeller-fork", ["location"], "Rathskeller Fork", ""],
        ["location-silent-stead", ["location"], "Silent Stead", ""],
        ["location-solomons-folly", ["location"], "Solomon’s Folly", ""],
        ["location-the-scratching-post", ["location"], "The Scratching Post", ""],
        ["location-tumbleweed", ["location"], "Tumbleweed", ""],
      ],
    },
    {
      title: "New Austin bounty locations",
      location: "Armadillo · Rathskeller Fork · MacFarlane’s Ranch",
      note: "After Political Realities in Armadillo, look for the white skull marking a wanted poster. Take regional posters as they appear in daylight. Check a location after bringing the fugitive or proof back to the law. Repeating a target location does not add completion credit.",
      sources: [
        ["iRedDead · bounties", "https://www.ireddead.com/rdr/guides/bounty-hunting"],
      ],
      rows: [
        ["bounty-brittlebrush-trawl", ["bounty"], "Brittlebrush Trawl", ""],
        ["bounty-the-hanging-rock", ["bounty"], "The Hanging Rock", ""],
        ["bounty-mercer-station", ["bounty"], "Mercer Station", ""],
        ["bounty-mescalero", ["bounty"], "Mescalero", ""],
        ["bounty-rattlesnake-hollow", ["bounty"], "Rattlesnake Hollow", ""],
        ["bounty-repentance-rock", ["bounty"], "Repentance Rock", ""],
        ["bounty-rio-del-lobo", ["bounty"], "Río del Lobo", ""],
        ["bounty-silent-stead", ["bounty"], "Silent Stead", ""],
      ],
    },
    {
      title: "Gang hideouts in New Austin",
      location: "Cholla Springs · Hennigan’s Stead · Gaptooth Ridge",
      sources: [
        ["iRedDead · gang hideouts", "https://www.ireddead.com/rdr/guides/gang-hideouts-single-player"],
      ],
      rows: [
        ["hideout-twin-rocks", ["hideout"], "Twin Rocks", "Available after New Friends, Old Problems. Meet the rancher outside, clear the lookouts on the rocks and the gang in the yard. Enter the bedroom and use Dead Eye to stop the hostage taker."],
        ["hideout-pikes-basin", ["hideout"], "Pike’s Basin", "After Justice in Pike’s Basin, return to the western entrance and meet the rancher. Follow the canyon past the fork, clear the camp and finish the marked rescue objective."],
        ["hideout-tumbleweed", ["hideout"], "Tumbleweed", "After Let the Dead Bury Their Dead, free the captured sheriff in town, clear the streets and go to the mansion uphill. Check both floors and the cellar for the last red markers."],
        ["hideout-gaptooth-breach", ["hideout"], "Gaptooth Breach", "After Man Is Born Unto Trouble, speak to the injured man near the mine. Rescue Floyd outside if you want his directions. Go into the mine, follow the tunnel markers to the treasure and clear a path to the exit."],
      ],
    },
    {
      title: "Optional hideout",
      location: "Gaptooth Ridge",
      sources: [
        ["iRedDead · gang hideouts", "https://www.ireddead.com/rdr/guides/gang-hideouts-single-player"],
      ],
      rows: [
        ["optional-solomons-folly", ["optional"], "Solomon’s Folly", "Where available in your edition, help the lawman by clearing the ruined farm and following the marked wagon objective. The hideout appears in modern releases and in some original editions."],
      ],
    },
    {
      title: "Safehouses in New Austin",
      location: "MacFarlane’s Ranch · Armadillo · Gaptooth Ridge",
      sources: [
        ["iRedDead · safehouses", "https://www.ireddead.com/rdr/guides/safehouses"],
      ],
      rows: [
        ["safehouse-macfarlanes-ranch", ["safehouse"], "MacFarlane’s Ranch", "Your room is awarded through the opening ranch missions. Check for its save icon after New Friends, Old Problems."],
        ["safehouse-armadillo", ["safehouse"], "Armadillo", "After This Is Armadillo, USA, buy the room upstairs at the saloon. Interact with the sale marker."],
        ["safehouse-rathskeller-fork", ["safehouse"], "Rathskeller Fork", "Buy the room at the Rathskeller Fork property marker in northern Gaptooth Ridge."],
        ["safehouse-thieves-landing", ["safehouse"], "Thieves’ Landing", "Buy the property at the sale marker near the town’s waterfront."],
      ],
    },
    {
      title: "Jobs in New Austin",
      location: "MacFarlane’s Ranch · Ridgewood Farm",
      sources: [
        ["iRedDead · jobs", "https://www.ireddead.com/rdr/guides/jobs"],
      ],
      rows: [
        ["job-nightwatch-macfarlanes-ranch", ["job"], "Nightwatch · MacFarlane’s Ranch", "After New Friends, Old Problems, accept the Nightwatch shift at the marker after dark. Follow the dog, deal with each disturbance and return when directed. This also earns a Bollard Twins scrap."],
        ["job-horsebreaking-ridgewood-farm", ["job"], "Horsebreaking · Ridgewood Farm", "Get the Lasso in Wild Horses, Tamed Passions, then take the horsebreaking job at Ridgewood Farm. Rope the horse in the corral, mount while holding the rope and counter its movement until it settles."],
      ],
    },
    {
      title: "Minigames in New Austin",
      location: "MacFarlane’s Ranch · Rathskeller Fork · Thieves’ Landing",
      sources: [
        ["iRedDead · minigames", "https://www.ireddead.com/rdr/guides/activities-and-minigames"],
      ],
      rows: [
        ["minigame-horseshoes", ["minigame"], "Horseshoes", "Play at MacFarlane’s Ranch. Aim at the stake, then release near the middle of the power meter. Win the match here to earn the Bollard Twins scrap too, then keep playing until every challenger waiting in line is beaten, which is what the game credits."],
        ["minigame-blackjack", ["minigame"], "Blackjack", "Play at Rathskeller Fork to combine this with a Treasure Hunter scrap. Leave the table with more chips than you bought in with."],
        ["minigame-five-finger-fillet", ["minigame"], "Five Finger Fillet", "Use the table in Armadillo or another town offering it. Learn each button sequence at the lowest stake and stay until every challenger is beaten."],
        ["minigame-poker", ["minigame"], "Poker", "Win the entire table by taking every opponent’s chips. The ranch table has a low buy-in. You can also do this later at the Blackwater saloon for an Army scrap."],
        ["minigame-liars-dice", ["minigame"], "Liar’s Dice", "Play in Thieves’ Landing after Man Is Born Unto Trouble, or wait for Casa Madrugada to combine the win with a Bandito scrap. Keep your own dice count in mind before calling a bluff and play until all opponents are out."],
      ],
    },
    {
      title: "Master Hunter challenges",
      location: "New Austin",
      note: "Complete the ranks in order. Ranks 5 and 10 each add one point to the game’s completion percentage.",
      sources: [
        ["iRedDead · animal map", "https://www.ireddead.com/rdr/maps/animals"],
      ],
      map: ["iRedDead", "https://www.ireddead.com/rdr/maps/animals"],
      rows: [
        ["hunter-1", ["challenge"], "Master Hunter 1 · Five coyote pelts", "Find packs in Cholla Springs and around Armadillo. Skin the five coyotes to register their pelts."],
        ["hunter-2", ["challenge"], "Master Hunter 2 · Five deer pelts", "Look for antlerless deer on the plains around Hennigan’s Stead. Skin five. Bucks count as a different animal."],
        ["hunter-3", ["challenge"], "Master Hunter 3 · Five wolves with the knife", "Look around Rathskeller Fork or Río del Lobo. Use the in-game hunting knife for the finishing blow on five wolves, then skin each one."],
        ["hunter-4", ["challenge"], "Master Hunter 4 · Five boar tusks and three armadillo carapaces", "Skin boars around Stillwater Creek east of MacFarlane’s Ranch. Search the dry ground around Armadillo for armadillos."],
        ["hunter-5", ["challenge"], "Master Hunter 5 · Two cougars with the knife", "Find cougars along the cliffs of Río Bravo near Fort Mercer or in Gaptooth Ridge. Carry Medicine, watch the minimap and make the final strike with the hunting knife. Skin both afterward."],
        ["hunter-6", ["challenge"], "Master Hunter 6 · Five raccoon, skunk and fox pelts each", "Search the scrub by Hanging Rock after dusk for raccoons and skunks. Look around Río Bravo and south of Armadillo for foxes. Skin five of each."],
      ],
    },
    {
      title: "Sharpshooter challenges",
      location: "New Austin",
      note: "Complete the ranks in order. Ranks 5 and 10 each add one point to the game’s completion percentage.",
      sources: [
        ["PowerPyx · challenges", "https://www.powerpyx.com/red-dead-redemption-all-challenges-guide/"],
      ],
      rows: [
        ["sharpshooter-1", ["challenge"], "Sharpshooter 1 · Five flying birds", "Tag five birds while they’re airborne. Look for flocks overhead outside Armadillo and use Dead Eye when they’re in range."],
        ["sharpshooter-2", ["challenge"], "Sharpshooter 2 · Five rabbits", "Search the low scrub of Hennigan’s Stead. Rabbits are small and move quickly, so slow down to spot them."],
        ["sharpshooter-3", ["challenge"], "Sharpshooter 3 · Five coyotes without a hit", "Find a pack in the open, stay on horseback and use Dead Eye when they gather. Track the count in the journal before taking damage from a coyote."],
        ["sharpshooter-4", ["challenge"], "Sharpshooter 4 · Five flying birds from a train", "Board a train, find a clear view from a car or its roof, and hit five airborne birds while it’s moving."],
        ["sharpshooter-5", ["challenge"], "Sharpshooter 5 · Two animal species in one Dead Eye use", "Find a ground animal with a bird nearby. Tag both targets in the same Dead Eye activation, then release the shots together."],
        ["sharpshooter-6", ["challenge"], "Sharpshooter 6 · Two hats", "Try the Walton gang at Twin Rocks. In Dead Eye, tag the edge of the hat. Do this to two different people."],
      ],
    },
    {
      title: "Survivalist challenges",
      location: "New Austin",
      note: "Complete the ranks in order. Ranks 5 and 10 each add one point to the game’s completion percentage.",
      sources: [
        ["iRedDead · plant map", "https://www.ireddead.com/rdr/maps/plants"],
      ],
      map: ["iRedDead", "https://www.ireddead.com/rdr/maps/plants"],
      rows: [
        ["survivalist-1", ["challenge"], "Survivalist 1 · Six Wild Feverfew", "Pick the small pale blooms in Hennigan’s Stead or Cholla Springs. Picking the first plant opens the challenge."],
        ["survivalist-2", ["challenge"], "Survivalist 2 · Six Desert Sage", "Look for purple flowers on the low shrubs of Gaptooth Ridge."],
        ["survivalist-3", ["challenge"], "Survivalist 3 · Four Red Sage", "Search the dry slopes around Río Bravo and Fort Mercer. A Survivalist Map from a general store makes the low red plants easier to spot."],
      ],
    },
    {
      title: "Treasure Hunter challenges",
      location: "New Austin",
      note: "Complete the ranks in order. Ranks 5 and 10 each add one point to the game’s completion percentage.",
      sources: [
        ["PowerPyx · treasure maps", "https://www.powerpyx.com/red-dead-redemption-all-treasure-locations/"],
      ],
      map: ["PowerPyx", "https://www.powerpyx.com/red-dead-redemption-all-treasure-locations/"],
      rows: [
        ["treasure-1", ["challenge"], "Treasure Hunter 1 · The first map", "Watch for the roadside encounter with bandits attacking a treasure hunter and his wagon. Save him and take the map he offers. If he dies, loot the map from him. Receiving it completes rank 1."],
        ["treasure-2", ["challenge"], "Treasure Hunter 2 · Rhodes’ Gold", "Go to Hanging Rock north of Armadillo. Walk between the two smaller rocks behind the main boulder and inspect the loose pile where they meet it."],
        ["treasure-3", ["challenge"], "Treasure Hunter 3 · Jackson’s Gold", "Ride southeast from Riley’s Charge to the camp above Del Lobo Rock. From the campfire head south through the notch in the rim. Dismount and descend carefully to the narrow lower ledge with the rock pile."],
        ["treasure-4", ["challenge"], "Treasure Hunter 4 · Calhoun’s Gold", "Go to the mansion uphill west of Tumbleweed. Enter the cellar from outside or by the interior stairs. Inspect the stone pile along the cellar’s west wall."],
      ],
    },
  ],
} satisfies RawChapter;
