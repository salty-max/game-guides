import type { Questlines } from "@hundo/core/types";

// Each Stranger task as a line. A part that waits on a later story mission or on in-game time is a row of its own, in the chapter where it can
// be done, tagged `stranger-step`. The last keeps the task's id and its `stranger` tag, so the board still counts each task once. A task done
// in one go stays one row. I Know You is optional, so its three parts are all `optional`. A name says only what the line's first step already
// says (docs/chapter-data.md).
export const questlines: Questlines = {
  tab: "Strangers",
  title: "Stranger tasks",
  intro: "Every Stranger task in route order, as far as you’ve revealed. Ticking a step here ticks it in the guide.",
  cover: ["stranger", "stranger-step"],
  lines: [
    { id: "flowers-for-a-lady", name: "Flowers for a Lady", steps: ["stranger-flowers-for-a-lady"] },
    { id: "let-no-man-put-asunder", name: "Let No Man Put Asunder", steps: ["stranger-let-no-man-put-asunder"] },
    { id: "jennys-faith", name: "Jenny’s Faith", steps: ["stranger-jennys-faith"] },
    { id: "water-and-honesty", name: "Water and Honesty", steps: ["stranger-water-and-honesty"] },
    {
      id: "american-appetites",
      name: "American Appetites",
      steps: ["stranger-american-appetites-first-report", "stranger-american-appetites-second-report", "stranger-american-appetites"],
    },
    {
      id: "california",
      name: "California",
      steps: ["stranger-california-gaptooth-ridge", "stranger-california-cueva-seca", "stranger-california-tumbleweed-canyon", "stranger-california"],
    },
    { id: "who-are-you-to-judge", name: "Who Are You to Judge?", steps: ["stranger-who-are-you-to-judge"] },
    {
      id: "funny-man",
      name: "Funny Man",
      steps: ["stranger-funny-man-benedict-point", "stranger-funny-man-gaptooth-breach", "stranger-funny-man-pikes-basin", "stranger-funny-man"],
    },
    { id: "lights-camera-action", name: "Lights, Camera, Action", steps: ["stranger-lights-camera-action-deed", "stranger-lights-camera-action"] },
    { id: "i-know-you", name: "I Know You", steps: ["optional-i-know-you-start", "optional-i-know-you-las-hermanas", "optional-i-know-you"] },
    {
      id: "deadalus-and-son",
      name: "Deadalus and Son",
      steps: ["stranger-deadalus-and-son-request", "stranger-deadalus-and-son-materials", "stranger-deadalus-and-son"],
    },
    { id: "poppycock", name: "Poppycock", steps: ["stranger-poppycock"] },
    { id: "eva-in-peril", name: "Eva in Peril", steps: ["stranger-eva-in-peril-casa-madrugada", "stranger-eva-in-peril"] },
    { id: "love-is-the-opiate", name: "Love is the Opiate", steps: ["stranger-love-is-the-opiate-el-matadero", "stranger-love-is-the-opiate"] },
    { id: "aztec-gold", name: "Aztec Gold", steps: ["stranger-aztec-gold"] },
    { id: "american-lobbyist", name: "American Lobbyist", steps: ["stranger-american-lobbyist"] },
    { id: "the-wronged-woman", name: "The Wronged Woman", steps: ["stranger-the-wronged-woman-chapel", "stranger-the-wronged-woman"] },
    { id: "the-prohibitionist", name: "The Prohibitionist", steps: ["stranger-the-prohibitionist"] },
    { id: "remember-my-family", name: "Remember My Family", steps: ["stranger-remember-my-family"] },
  ],
};
