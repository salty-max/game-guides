import type { RawChapter } from "@hundo/core/types";

export default {
  id: 8,
  title: "Fog Canyon and Queen’s Gardens",
  region: "Fog Canyon · Teacher’s Archives · Queen’s Gardens · Tower of Love",
  teaser: "Queen’s Gardens",
  intro: "Use your new movement tools to finish the western branches. Follow Quirrel through the Archives, help Cloth in the Gardens and open the route to the Collector.",
  sources: [["Canyon, Gardens and Tower of Love route", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Teacher’s Archives", "https://hollowknight.wiki/w/Teacher%27s_Archives"], ["Queen’s Gardens landmarks", "https://hollowknight.wiki/w/Queen%27s_Gardens"]],
  groups: [
    {
      title: "The Archive and the final Dreamer",
      location: "Fog Canyon",
      rows: [
        ["map-fog-canyon", ["map"], "Buy Cornifer’s Fog Canyon map", "Reach his side of the canyon by the Shade Cloak gate or the acid connection with Isma’s Tear. Follow his papers and pay 150 Geo. Be careful hitting large jellies near narrow platforms."],
        ["notch-fog-canyon", ["notch"], "Take the Charm Notch in the exploding egg room", "From the upper canyon network, look for the chamber packed with Oomas and hazards. Move carefully along the platforms to the far side. Use Isma’s Tear to approach by acid where the room allows it."],
        ["quest-quirrel-archives", ["quest"], "Find Quirrel outside the Teacher’s Archives", "Reach the Archives in Fog Canyon and talk to Quirrel if present. Keep enough health to cross the electric platforms. The Archives’ accessible bench is a better checkpoint than the acid rooms."],
        ["boss-uumuu", ["boss", "percent-boss"], "Defeat Uumuu with Quirrel’s help", "Jump between platforms and wait for Quirrel to pierce Uumuu’s shield. Attack during that opening. Move away from the tracking electricity if Quirrel is still getting into position."],
        ["dreamer-monomon", ["dreamer"], "Reach Monomon below the Archives arena", "Descend into the chamber beyond the fight and find Monomon’s tank. Speak to Quirrel to remove the protection. Use the Dream Nail and complete the interaction."],
        ["quest-quirrel-lake", ["quest"], "Sit with Quirrel at the Blue Lake", "After Monomon, go west from the upper Resting Grounds or east from Salubra’s side of the Crossroads to reach the Blue Lake. Find Quirrel at the water, sit beside him and finish the conversation before leaving for his final scene."],
      ],
    },
    {
      title: "Through the gardens to the White Lady",
      location: "Queen’s Gardens",
      rows: [
        ["route-gardens-entry", ["route"], "Enter the Queen’s Gardens from Fog Canyon", "From the west side of Fog Canyon, use Isma’s Tear to pass the acid route into the Gardens. Watch for platforms that fold where they cross thorn pits. Use the new bench rather than returning through the canyon for every attempt."],
        ["map-queens-gardens", ["map"], "Buy Cornifer’s Queen’s Gardens map", "Follow the papers off the central platform network. Find Cornifer beside a bench and pay 150 Geo. If he moved on, use Iselda’s stock after visiting the region."],
        ["stag-queens-gardens", ["stag"], "Open the Queen’s Gardens station", "Reach the interior station by following the sign from the east-side path, open the access from within and pay 200 Geo. You can revisit from the Stag after the main fight."],
        ["warrior-dream-marmu", ["warrior-dream"], "Defeat Marmu beside the Gardens station", "Search the grave next to the station and Dream Nail Marmu. Hold a stable position and strike as she rebounds into reach. Claim 150 Essence."],
        ["pickup-love-key", ["pickup"], "Collect the Love Key in the Gardens", "Explore the lower-eastern side room near the route toward Fungal Wastes. Defeat the Mantis Traitors guarding the corpse and take the key. You will use the Kingdom’s Edge entrance to the Tower of Love."],
        ["quest-cloth-gardens", ["quest"], "Meet Cloth again on the Gardens approach", "If you helped her in the Basin, speak to Cloth on the path toward the boss encounter. This check follows the branch where she joins the fight. Leave her Basin room untouched on another run if you prefer her Dirtmouth scene."],
        ["boss-traitor-lord", ["boss", "percent-boss"], "Defeat the Traitor Lord", "Pass the shade gate and climb to the arena. Clear the opening mantis waves, then use Shade Cloak through the lunges and tall shockwaves. Keep close enough to limit the ranged pattern. Cloth helps if you met her in the Basin."],
        ["quest-cloth-farewell", ["quest"], "Return for Cloth’s last scene in the arena", "If she joined the fight, re-enter the room after winning and speak to her spirit. If you chose to leave her Basin encounter until after the fight, look for her in Dirtmouth instead once her route advances."],
        ["quest-white-lady", ["quest"], "Receive the White Lady’s White Fragment", "Go beyond Traitor Lord and enter the cocoon chamber. Talk to the White Lady for one half of the completed charm. The other half is in a later dream chapter."],
      ],
    },
    {
      title: "The Tower of Love and the Grub map",
      location: "City of Tears · Kingdom’s Edge",
      rows: [
        ["route-tower-door", ["route"], "Open the Tower of Love from Kingdom’s Edge", "Go through the flooded King’s Station tunnel into the Edge. Find the narrow tower entrance near the western side of the cavern and use the Love Key. Climb the interior stairs and open the side shortcut when available."],
        ["boss-collector", ["boss", "percent-boss"], "Defeat the Collector and take the Collector’s Map", "Clear the enemies that drop from the jars so the floor stays open. There are few ways to refill SOUL here, so enter charged. Search the rooms beyond for three captive Grubs and the map. The map marks unrescued jars on acquired area maps."],
      ],
    },
    {
      title: "The side paths of the Gardens and Fog Canyon",
      location: "Queen’s Gardens · Fog Canyon",
      sources: [["Flower and Pleasure House quest routes", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"], ["Flower conditions", "https://hollowknight.wiki/w/Delicate_Flower_(Quest)"]],
      compact: true,
      rows: [
        ["charm-spore-shroom", ["charm"], "Collect Spore Shroom near the Fungal Wastes border", "From the southwest Fungal Wastes, climb through the side passage near its Queen’s Gardens connection. Use wall jumps to reach the charm on the hidden upper ledge."],
        ["quest-millibelle-bank", ["quest"], "Open Millibelle’s account if you want her full story", "Visit her booth above Queen’s Station. Pay the account fee, deposit at least 2,550 Geo and rest or leave the area. Return and check the empty booth. Save a Simple Key for the follow-up."],
        ["quest-millibelle-spa", ["quest"], "Recover the deposit at the Pleasure House", "Use a Simple Key to open the Pleasure House near King’s Station. Ride to the upper spa and strike Millibelle until she drops the money. Recover it before you leave."],
        ["quest-flower-start", ["quest"], "Accept a Delicate Flower from the Grey Mourner", "Dive through the breakable grave below the Resting Grounds station, then go through the crypt to her house. Clear your intended route before taking the flower. Do a trial run without the flower if needed."],
        ["quest-flower-grave", ["quest"], "Deliver the Delicate Flower to the grave in Queen’s Gardens", "Set out from the Grey Mourner after clearing the route and avoid resting at a bench. Use the Blue Lake, Forgotten Crossroads and Fog Canyon route. Follow the thorn-marked passage near the Gardens station to the grave. Walk and avoid damage and fast travel. On failure, return for another flower."],
        ["mask-shard-flower", ["mask-shard"], "Claim the Grey Mourner’s Mask Shard", "After leaving the flower at the grave, return to the Grey Mourner’s house and finish the conversation for her reward. You can later pick more flowers at the grave for other NPC gifts."],
      ],
    },
    {
      title: "The western return and the Tower of Love jars",
      location: "Fog Canyon · Queen’s Gardens · Tower of Love",
      note: "For a late sweep, use the Collector’s Map to check which jars remain. Follow the landmark for each individual jar.",
      sources: [["Canyon and Gardens routes and Collector’s room", "https://www.steamsolo.com/guide/112-completion-walkthrough-with-maps-hollow-knight/"]],
      map: ["ScriptersWar", "https://scripterswar.com/hollowknight/map"],
      compact: true,
      rows: [
        ["grub-crossroads-acid", ["grub"], "Free the Grub across Cornifer’s acid passage", "Return to the room below the Crossroads’ main shaft where you first bought Cornifer’s map. Take the lower-left exit, then swim across the acid with Isma’s Tear to take the jar."],
        ["grub-fog-superdash", ["grub"], "Return for the Fungal Wastes super-dash Grub", "In Fog Canyon, take the low western exit from the tall canyon shaft. Follow the corridor to the wide chamber, then charge Crystal Heart to reach the hidden alcove containing the jar."],
        ["grub-gardens-hidden", ["grub"], "Free the Grub behind the Gardens Geo rock", "From the Gardens approach beyond Cornifer’s area, climb the tall room on the lower-eastern route. Break the Geo rock concealing the side alcove and take the jar."],
        ["grub-gardens-upper", ["grub"], "Free the Grub above the narrow Gardens passage", "Continue north and take the upper-left path. Pass the large corpse, then climb through the concealed opening where the passage narrows to reach the jar."],
        ["grub-gardens-glass", ["grub"], "Free the Grub beyond the Gardens glass barrier", "Climb the tall west-side Gardens room near the route toward the Stag Station. Break the glass at the top and finish the short thorn-side climb to the jar."],
        ["grub-tower-near", ["grub"], "Free the first Grub beyond the Collector", "Climb above the arena and break the nearest of the three jars in the same upper chamber."],
        ["grub-tower-middle", ["grub"], "Free the middle Grub beyond the Collector", "Continue across the upper chamber and break the middle jar."],
        ["grub-tower-far", ["grub"], "Free the far Grub beyond the Collector", "Break the last jar in the upper chamber, then take the map at the end if you still need it."],
      ],
    },
  ],
} satisfies RawChapter;
