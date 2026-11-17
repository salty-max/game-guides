import type { Questlines } from "@hundo/core/types";

// Side quests that carry on from one another, as lines of rows in route order: the rows' own texts tie each step to the one before.
// A name says only what the line's first step already says (docs/chapter-data.md).
export const questlines: Questlines = {
  tab: "Quests",
  title: "Side questlines",
  intro: "Side quests that carry on from one another, in order, as far as you’ve revealed. Ticking a step here ticks it in the guide.",
  lines: [
    { id: "curious-child", name: "The curious child", steps: ["quest-curious-child", "quest-out-there-zol"] },
    { id: "smog", name: "Smog", steps: ["quest-lets-play-a-game", "quest-cotton-candy-hunt"] },
    {
      id: "dampe",
      name: "Dampé’s automatons",
      steps: [
        "quest-automaton-engineer", "quest-explosions-galore", "quest-performance-artist", "quest-endless-stomach", "quest-chop-em-in-two",
        "quest-get-rich-quick",
      ],
    },
  ],
};
