import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import tailwind from "eslint-plugin-better-tailwindcss";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";

const core = new URL("./packages/core/src/", import.meta.url);

// A class list kept in a constant is named `<what>Classes`: the plugin reads className, cva-style calls and a few variable names by
// default, so the selector below teaches it this one, and the guard further down keeps a module-level string constant from being
// anything else. The plugin matches a variable's name against the WHOLE of this pattern (a bare `Classes$` would match nothing), so it
// spells the whole name. The guard's initialisers: a string, a template, a tagged template, and any of the first two behind `as`/`satisfies`.
const classConstant = "[a-z][A-Za-z0-9]*Classes";
const stringInit = (path) => `[${path}.type="TemplateLiteral"], [${path}.value=/[\\s\\S]*/]`;
const classConstantDeclaration = `VariableDeclaration[kind="const"] > VariableDeclarator[id.name!=/^[A-Z][A-Z0-9_]*$|^${classConstant}$/]:matches(${stringInit("init")}, ${stringInit("init.expression")}, [init.type="TaggedTemplateExpression"])`;
const classConstantMessage =
  "A module-level string constant is either SCREAMING_CASE (a value) or a class list named `<what>Classes`, which the Tailwind lint reads (eslint.config.js). Name it one or the other.";

export default tseslint.config(
  { ignores: ["**/dist", "**/dev-dist", "**/coverage"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  ...storybook.configs["flat/recommended"],
  {
    // A story file exports its meta and stories, not components.
    files: ["**/*.stories.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    // Tailwind classes in components: spelled right, in one order, none doubled or fighting, and only the house tokens (tokens.css).
    files: ["**/*.{ts,tsx}"],
    plugins: { "better-tailwindcss": tailwind },
    settings: {
      "better-tailwindcss": {
        entryPoint: fileURLToPath(new URL("app.css", core)),
        // `strings` reads a string or template constant, `objectValues` a map of them (`toneClasses`).
        selectors: { extends: [{ kind: "variable", name: `^${classConstant}$`, match: [{ type: "strings" }, { type: "objectValues" }] }] },
      },
    },
    rules: {
      ...tailwind.configs["recommended-error"].rules,
      // No formatter wraps this repo's lines, so a class list stays on one line.
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      // The tick box's sizes are spacing tokens (tokens.css), so the rule would call any 34px length `check-indent`. A 34px tile (a route
      // group's icon, the brand on a narrow top bar) isn't the tick box: it stays `size-8.5`. Spacing itself has no half steps above 4
      // (spacing.test.ts), so no margin or gap can be mistaken for the tick box.
      "better-tailwindcss/enforce-canonical-classes": ["error", { ignore: ["^(?:.+:)?-?[a-z-]+-8\\.5$"] }],
    },
  },
  {
    // The selector above only reads what is named for it, so a class list in a string or template constant with another name would go
    // unlinted without a word. In core's code (a test's strings and a story's are not classes) a module-level string or template constant
    // is SCREAMING_CASE or a class list: no third kind. A function's own constants (an id, a path) are not module-level and are left alone.
    // Not guarded: a map or an array under another name, and a class list in SCREAMING_CASE. Core has none; the name is the convention.
    files: ["packages/core/src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}", "**/*.stories.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: `Program > ${classConstantDeclaration}`, message: classConstantMessage },
        { selector: `Program > ExportNamedDeclaration > ${classConstantDeclaration}`, message: classConstantMessage },
      ],
    },
  },
  {
    // A guide builds its panels from core's components and nothing else: Tailwind only reads core's files, so a utility class in a guide
    // would build to nothing, and a look a guide made for itself would drift from the house style. So no class and no style at all.
    files: ["apps/*/src/**/*.{ts,tsx}"],
    rules: {
      "better-tailwindcss/no-unknown-classes": "off",
      "no-restricted-syntax": [
        "error",
        { selector: "JSXAttribute[name.name=/^(className|style)$/]", message: "A guide uses core's components only: no className or style. A new look is a core part or variant." },
      ],
    },
  },
  // The sync service runs on Node, not in a browser.
  { files: ["services/**/*.ts"], languageOptions: { globals: globals.node } },
);
