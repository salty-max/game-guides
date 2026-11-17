import type { Questlines } from "@hundo/core/types";

// The trading quest as one line of rows, in route order. A name says only what the line's first step already says (docs/chapter-data.md).
export const questlines: Questlines = {
  tab: "Trades",
  title: "Trading quest",
  intro: "Every trade in order, as far as you’ve revealed. Ticking a step here ticks it in the guide.",
  cover: ["trade"],
  lines: [
    {
      id: "trading-quest",
      name: "The trading quest",
      steps: [
        "trade-yoshi", "trade-ribbon", "trade-food", "trade-bananas", "trade-stick", "trade-honey", "trade-pineapple",
        "trade-hibiscus", "trade-letter", "trade-broom", "trade-hook", "trade-necklace", "trade-scale", "trade-lens",
      ],
    },
  ],
};
