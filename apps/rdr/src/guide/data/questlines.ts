import type { Questlines } from "@hundo/core/types";

// Each Stranger task as a line. Each is one row today, its parts in the row's text, so a line has one step until the parts are rows.
// I Know You is the one with two. A name says only what the line's first step already says (docs/chapter-data.md).
export const questlines: Questlines = {
  tab: "Strangers",
  title: "Stranger tasks",
  intro: "Every Stranger task in route order, as far as you’ve revealed. Ticking one here ticks it in the guide.",
  cover: ["stranger"],
  lines: [
    { id: "flowers-for-a-lady", name: "Flowers for a Lady", steps: ["stranger-flowers-for-a-lady"] },
    { id: "let-no-man-put-asunder", name: "Let No Man Put Asunder", steps: ["stranger-let-no-man-put-asunder"] },
    { id: "jennys-faith", name: "Jenny’s Faith", steps: ["stranger-jennys-faith"] },
    { id: "water-and-honesty", name: "Water and Honesty", steps: ["stranger-water-and-honesty"] },
    { id: "american-appetites", name: "American Appetites", steps: ["stranger-american-appetites"] },
    { id: "california", name: "California", steps: ["stranger-california"] },
    { id: "who-are-you-to-judge", name: "Who Are You to Judge?", steps: ["stranger-who-are-you-to-judge"] },
    { id: "poppycock", name: "Poppycock", steps: ["stranger-poppycock"] },
    { id: "funny-man", name: "Funny Man", steps: ["stranger-funny-man"] },
    { id: "eva-in-peril", name: "Eva in Peril", steps: ["stranger-eva-in-peril"] },
    { id: "love-is-the-opiate", name: "Love is the Opiate", steps: ["stranger-love-is-the-opiate"] },
    { id: "aztec-gold", name: "Aztec Gold", steps: ["stranger-aztec-gold"] },
    { id: "lights-camera-action", name: "Lights, Camera, Action", steps: ["stranger-lights-camera-action"] },
    { id: "deadalus-and-son", name: "Deadalus and Son", steps: ["stranger-deadalus-and-son"] },
    { id: "american-lobbyist", name: "American Lobbyist", steps: ["stranger-american-lobbyist"] },
    { id: "the-wronged-woman", name: "The Wronged Woman", steps: ["stranger-the-wronged-woman"] },
    { id: "the-prohibitionist", name: "The Prohibitionist", steps: ["stranger-the-prohibitionist"] },
    { id: "remember-my-family", name: "Remember My Family", steps: ["stranger-remember-my-family"] },
    { id: "i-know-you", name: "I Know You", steps: ["optional-i-know-you-start", "optional-i-know-you"] },
  ],
};
