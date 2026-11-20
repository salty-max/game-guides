import { matches, normalise, status } from "./find";

describe("Find", () => {
  it("compares without case, accents or apostrophes", () => {
    expect(normalise("Link’s Awakening")).toBe("links awakening");
    expect(normalise("Hollow Knight: Silksong")).toBe("hollow knight silksong");
    expect(normalise("Pokémon")).toBe("pokemon");
  });

  it("matches when every word typed starts a word of the guide's name, game or publisher", () => {
    const terms = "Pharloom Hollow Knight: Silksong Team Cherry";
    for (const query of ["", "  ", "silk", "hollow kn", "PHAR", "cherry team"]) expect(matches(terms, query), query).toBe(true);
    for (const query of ["ilksong", "zelda", "hollow zelda"]) expect(matches(terms, query), query).toBe(false);
    expect(matches("Koholint Link’s Awakening Nintendo", "link's")).toBe(true);
  });

  it("says nothing while every guide shows, and how many match otherwise", () => {
    expect(status(6, 6, "")).toBe("");
    expect(status(2, 6, "hollow")).toBe("2 of 6 guides match.");
    expect(status(0, 6, " zelda ")).toBe("No guide matches “zelda”.");
  });
});
