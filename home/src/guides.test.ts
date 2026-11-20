import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { APPS, largestGoals, readGuides, type Guide } from "./guides";

// A guide is a folder in apps/ with a vercel.json, as core's wiring.test.ts and Lighthouse count them.
const deployed = readdirSync(APPS).filter((name) => existsSync(join(APPS, name, "vercel.json")));

describe("the guides the page is made from", () => {
  let guides: Guide[];
  beforeAll(async () => {
    guides = await readGuides();
  });

  it("are every guide in apps/, read from its own files", () => {
    expect(deployed.length).toBeGreaterThan(0);
    expect(guides.map((guide) => guide.folder).sort()).toEqual([...deployed].sort());
  });

  it("go A to Z by game", () => {
    const games = guides.map((guide) => guide.game);
    expect(games).toEqual([...games].sort((a, b) => a.localeCompare(b, "en")));
  });

  it("each carry a palette in both themes, chapters, rows and the game's largest goals", () => {
    for (const guide of guides) {
      for (const palette of [guide.light, guide.dark]) {
        for (const key of ["--paper", "--surface", "--ink", "--muted", "--line", "--primary", "--on-primary", "--accent"]) expect(palette[key], `${guide.folder} ${key}`).toMatch(/^#[0-9a-f]{3,8}$/i);
      }
      expect(guide.home, guide.folder).toMatch(/^https:\/\/[a-z]+\.hundo\.quest$/);
      expect(guide.chapters, guide.folder).toBeGreaterThan(0);
      expect(guide.rows, guide.folder).toBeGreaterThan(guide.chapters);
      expect(guide.goals.length, guide.folder).toBeGreaterThan(0);
      expect(guide.goals.length, guide.folder).toBeLessThanOrEqual(3);
      for (const goal of guide.goals) expect(goal, guide.folder).toMatch(/^\d+ \S/);
    }
  });
});

describe("a guide's largest goals", () => {
  const categories = {
    heart: ["Heart Pieces", "Heart Piece", "heart"],
    shell: ["Secret Seashells", "Seashell", "shell"],
    chest: ["Treasure Chests", "Chest", "chest"],
    song: ["Songs", "Song", "music"],
    story: ["Route Steps", "Route", "book"],
    amiibo: ["amiibo", "amiibo", "star"],
  } as const;
  const config = (board: { tag: string; goal: number; list: "game" | "guide" }[]) =>
    ({ categories, completion: { board, directions: ["story"], outside: ["amiibo"] } }) as unknown as Parameters<typeof largestGoals>[0];

  it("are the game's own lists, largest first, at most three, the board's order breaking a tie", () => {
    const board = [
      { tag: "song", goal: 3, list: "game" as const },
      { tag: "heart", goal: 32, list: "game" as const },
      { tag: "chest", goal: 83, list: "guide" as const },
      { tag: "shell", goal: 50, list: "game" as const },
      { tag: "story", goal: 99, list: "game" as const },
      { tag: "amiibo", goal: 60, list: "game" as const },
    ];
    expect(largestGoals(config(board))).toEqual(["50 Secret Seashells", "32 Heart Pieces", "3 Songs"]);
    expect(largestGoals(config([{ tag: "song", goal: 3, list: "game" }, { tag: "heart", goal: 3, list: "game" }]))).toEqual(["3 Songs", "3 Heart Pieces"]);
  });
});
