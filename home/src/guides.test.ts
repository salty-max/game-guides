import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { APPS, readGuides, type Guide } from "./guides";

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

  it("each carry a palette in both themes, chapters and rows", () => {
    for (const guide of guides) {
      for (const palette of [guide.light, guide.dark]) {
        for (const key of ["--paper", "--surface", "--ink", "--muted", "--line", "--primary", "--on-primary", "--accent"]) expect(palette[key], `${guide.folder} ${key}`).toMatch(/^#[0-9a-f]{3,8}$/i);
      }
      expect(guide.home, guide.folder).toMatch(/^https:\/\/[a-z]+\.hundo\.quest$/);
      expect(guide.chapters, guide.folder).toBeGreaterThan(0);
      expect(guide.rows, guide.folder).toBeGreaterThan(guide.chapters);
    }
  });
});
