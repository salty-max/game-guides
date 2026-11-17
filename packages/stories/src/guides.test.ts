import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { GUIDES } from "../.storybook/ids.ts";

// The stories run under every guide's palette, and a guide missing from GUIDES is never run: nothing else says so. A guide is a folder in
// apps/ with a vercel.json, as lighthouse/run.mjs and core's deploy tests count them. (A guide in GUIDES that guides.ts lacks fails the typecheck.)
describe("the guides the stories run under", () => {
  it("are the guides there are, so a new guide is run through axe in both themes", () => {
    const apps = join(import.meta.dirname, "../../../apps");
    const guides = readdirSync(apps).filter((name) => existsSync(join(apps, name, "vercel.json")));
    expect([...GUIDES].sort(), "GUIDES in .storybook/ids.ts (and the guide's entry in .storybook/guides.ts)").toEqual(guides.sort());
  });
});
