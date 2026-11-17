import type { RawChapter } from "@hundo/core/types";

export default {
  id: 10,
  title: "Oolacile and the Abyss",
  region: "Sanctuary Garden · Royal Wood · Oolacile Township · Chasm of the Abyss",
  teaser: "Oolacile",
  intro: "Answer Elizabeth’s request and follow Oolacile’s character stories to their conclusion. Meet Chester and Ciaran, rescue young Sif and Dusk, and return to Gough after the dragon.",
  sources: [["Pendant unlock", "https://darksouls.wikidot.com/broken-pendant"], ["Royal Wood and Artorias", "https://darksouls.wikidot.com/royal-wood"], ["Township items", "https://darksouls.wikidot.com/oolacile-township"], ["Chasm route and Sif", "https://darksouls.wikidot.com/chasm-of-the-abyss"]],
  groups: [
    {
      title: "Sanctuary Garden and Royal Wood",
      sources: [["Sanctuary Guardian and tail", "https://darksouls.wikidot.com/sanctuary-garden"], ["Sanctuary Guardian tactics and tail cut", "https://darksouls.wikidot.com/sanctuary-guardian"], ["Sanctuary bonfire", "https://darksouls.wiki.fextralife.com/Oolacile+Sanctuary"], ["Dusk’s sign gone while you hold the pendant", "https://darksouls.wikidot.com/dusk-of-oolacile"], ["Grounds, slab and boss", "https://darksouls.wikidot.com/royal-wood"], ["Artorias tactics", "https://darksouls.wikidot.com/knight-artorias"], ["DLC boss-soul recipes", "https://darksouls.wikidot.com/boss-soul-items"]],
      rows: [
        ["route-portal", ["route", "dlc"], "Enter Oolacile through the Basin portal", "Take the Broken Pendant to the rear Darkroot Basin cave where you freed Dusk. Interact with the dark portal and light the Sanctuary Garden bonfire."],
        ["extra-guardian-tail", ["extra", "dlc"], "Cut the Sanctuary Guardian’s tail", "Bait its ground wave, roll to the side of the headbutt that follows and hit the exposed tail. Missed it? Once Artorias is dead and you rest, two Lesser Sanctuary Guardians appear in the garden, and their tails drop it too."],
        ["boss-guardian", ["boss", "dlc"], "Defeat the Sanctuary Guardian", "Dodge its lightning blasts, which can chain, and roll left under the dive. Hit it after the dive or the headbutt. Rest at the bonfire in the middle of Oolacile Sanctuary before crossing to Royal Wood."],
        ["quest-elizabeth-request", ["quest", "dlc"], "Accept Elizabeth’s request at Oolacile Sanctuary", "Elizabeth waits against the sanctuary wall, left of the path to Royal Wood. Agree to help Dusk and ask about Oolacile. She also sells any of Dusk’s sorceries you didn’t buy, since Dusk’s sign stays hidden while you carry the Broken Pendant.", {"reference": "https://darksouls.wikidot.com/elizabeth"}],
        ["forge-royal-slab", ["forge", "dlc"], "Collect the Royal Wood Blue Titanite Slab", "The chest sits half hidden in grass beside a small pool in the first part of the Wood. Explore for the Guardian Set, and past Chester’s bridge open the elevator shortcut back to the Wood’s start.", {"reference": "https://darksouls.wikidot.com/blue-titanite-slab"}],
        ["quest-chester-merchant", ["quest", "dlc"], "Meet Chester on the Royal Wood bridge", "Before leaving Royal Wood, look across the bridge by the shortcut lift near Artorias’s fog. Talk to Chester and buy anything you want, leaving him alive for the Township invasion.", {"reference": "https://darksouls.wikidot.com/marvellous-chester"}],
        ["boss-artorias", ["boss", "dlc"], "Defeat Knight Artorias", "Roll toward his empty hand through lunges and sideways from his flips, which can come three in a row. When he backs off to charge his dark aura, hit him hard to break it, or back away from the blast. Keep his soul."],
        ["quest-ciaran", ["quest", "dlc"], "Give the Soul of Artorias to Ciaran", "Rest, reload or revisit Artorias’s arena after beating him. Carry his soul, speak to Ciaran by the grave and agree to hand it over for Gold Tracer and Dark Silver Tracer. This is the first-run choice. Save NG+’s Artorias soul for the Abyss Greatsword.", {"reference": "https://darksouls.wikidot.com/lord-s-blade-ciaran"}],
      ],
    },
    {
      title: "Oolacile Township and Chasm",
      sources: [["I’m Sorry carving", "https://darksouls.wikidot.com/i-m-sorry-carving"], ["Gough’s carvings", "https://darksouls.wikidot.com/hawkeye-gough"], ["Chester’s invasion and shop", "https://darksouls.wikidot.com/marvellous-chester"], ["Young Sif and the Cleansing Greatshield", "https://darksouls.wikidot.com/cleansing-greatshield"], ["Manus tactics", "https://darksouls.wikidot.com/manus-father-of-the-abyss"], ["Soul of Manus uses", "https://darksouls.wikidot.com/soul-of-manus"]],
      rows: [
        ["route-township-spells", ["route", "dlc"], "Search the Township before the lift to the Chasm", "Clear sorcerers from cover and sweep the side rooms for Dark Orb, Dark Fog and the Crest Key mimic. At the message about light, use Cast Light, Sunlight Maggot or Skull Lantern to reveal the wall for the Silver Pendant. Unlock the shortcut elevator on the descent."],
        ["extra-township-carvings", ["extra", "dlc"], "Collect the Township voice carvings", "Kill the Bloathead Sorcerer on the side platform near the Dark Orb building for I’m Sorry. The mimic further down the Township drops Very Good. Gough sells Hello and Thank You, and Help Me is on a corpse in the Chasm of the Abyss, down a ledge on the right before the bridge.", {"reference": "https://darksouls.wikidot.com/help-me-carving"}],
        ["invasion-chester", ["invasion", "dlc"], "Defeat Marvelous Chester’s invading phantom", "Go human and head for the long wooden bridge that leads to the mimic: he invades before it. He invades only if his merchant form is still alive. Killing his phantom keeps the shop open by the Royal Wood shortcut."],
        ["quest-chester-return", ["quest", "dlc"], "Speak to Chester after his Township invasion", "Return to his Royal Wood bridge shop after beating his invading phantom. Talk to him for the follow-up while leaving the merchant alive.", {"reference": "https://darksouls.wikidot.com/marvellous-chester"}],
        ["route-chasm-spells", ["route", "dlc"], "Search the Chasm ledges for Dark Bead and Black Flame", "From the bonfire below the lift, pick off Humanity Phantoms a few at a time. Search the ledges for Dark Bead, Black Flame and the White Titanite Slab before entering the boss chamber."],
        ["quest-young-sif", ["quest", "dlc"], "Free young Sif in the Chasm", "Follow Alvina’s apparitions from the illusory floor, open the illusory wall near the Royal Wood lift and kill the Humanity Phantoms around Sif. Collect the Cleansing Greatshield. Sif’s optional summon sign is inside the Manus arena."],
        ["boss-manus", ["boss", "dlc"], "Defeat Manus, Father of the Abyss", "Back away when he roars to start his combo. Punish long attacks and use the Silver Pendant to repel dark magic. Save his soul for the Pursuers trade at Snuggly in NG. Use his second soul for the Manus Catalyst."],
        ["quest-dusk-rescued", ["quest", "dlc"], "Find Dusk after Manus and revisit the Basin", "Before leaving, talk to Dusk where Manus fell. Later return to her summon sign at the Hydra lake and use Talk for her new dialogue about Oolacile and the rescue. You can use her sign while hollow.", {"reference": "https://darksouls.wikidot.com/dusk-of-oolacile"}],
      ],
    },
    {
      title: "Kalameet and the closing rewards",
      sources: [["Gough and valley access", "https://darksouls.wikidot.com/royal-wood"], ["Gough’s door, prompts and Greatbow", "https://darksouls.wikidot.com/hawkeye-gough"], ["Kalameet’s tail, ring and arena slab", "https://darksouls.wikidot.com/black-dragon-kalameet"], ["Elizabeth’s mushrooms", "https://darksouls.wikidot.com/elizabeth"], ["Young Sif and the adult Sif scene", "https://darksouls.wikidot.com/sif-the-great-grey-wolf"]],
      rows: [
        ["quest-gough", ["quest", "dlc"], "Ask Gough to ground Kalameet", "Leaving Artorias’s arena toward the Township, turn left up the stairs, then cross the bridge to a door the Crest Key opens. Once you’ve been down to see Kalameet, return to Gough and agree to his questions so he shoots it down."],
        ["extra-kalameet-tail", ["extra", "dlc"], "Cut Kalameet’s tail", "Roll left of his dive, then stand behind him under the tail to bait the tail slam. Roll aside and hit the tail while it lies on the ground for the Obsidian Greatsword."],
        ["boss-kalameet", ["boss", "dlc"], "Defeat Kalameet and collect the Calamity Ring", "Run or roll to his side whenever he sits up, so the telekinetic grab misses. Hit his neck from the side while he breathes fire ahead. Open the waterfall chest for a slab and return to Gough for Gough’s Greatbow."],
        ["quest-elizabeth", ["quest", "dlc"], "Return to Elizabeth after Manus", "Return to Elizabeth at Oolacile Sanctuary after Manus. Accept the three Elizabeth’s Mushrooms and hear her closing dialogue. Freeing young Sif before the adult Sif fight in the same cycle changes that fight’s opening scene. This route does it in NG+, where the expansion comes before adult Sif."],
      ],
    },
  ],
} satisfies RawChapter;
