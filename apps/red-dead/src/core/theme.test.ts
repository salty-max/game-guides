import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const core = read("./styles.css");
const theme = read("../guide/theme.css");
const rules = [...theme.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
  selector: selector.trim(),
  declarations: body.split(";").map((part) => part.trim()).filter(Boolean),
}));

// Set by core itself, by the font block index.html gets from the brand, or optional per-chapter banner focus.
const own = new Set(["--bar", "--rail-w", "--display", "--sans", "--hero-focus", "--hero-focus-narrow"]);

describe("guide theme", () => {
  it("defines every token the shared styles use", () => {
    const used = new Set([...core.matchAll(/var\((--[a-z0-9-]+)/g)].map(([, name]) => name).filter((name) => !own.has(name)));
    const root = rules.find((rule) => rule.selector === ":root");
    const defined = new Set(root?.declarations.map((declaration) => declaration.split(":")[0]));
    expect([...used].filter((name) => !defined.has(name))).toEqual([]);
  });

  it("only sets token values, on the root, its dark variant or a chapter banner", () => {
    for (const { selector, declarations } of rules) {
      expect(selector, selector).toMatch(/^(:root|:root\[data-theme="dark"\])$|\.hero\[data-chapter="\d+"\]$/);
      for (const declaration of declarations) expect(declaration, `${selector} { ${declaration} }`).toMatch(/^(--[a-z0-9-]+|color-scheme):/);
    }
  });
});
