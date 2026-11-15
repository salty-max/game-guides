import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import tailwind from "eslint-plugin-better-tailwindcss";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";

const core = new URL("./packages/core/src/", import.meta.url);
// The classes core's old stylesheet still defines. Tailwind doesn't know them, so they're allowed until their rules move to
// utilities; the list is read from the file, so it shrinks as styles.css does and is empty when styles.css is gone.
const legacyCss = readFileSync(new URL("styles.css", core), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const legacy = [...new Set([...legacyCss.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(([, name]) => name))];

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
    files: ["**/*.tsx"],
    plugins: { "better-tailwindcss": tailwind },
    settings: { "better-tailwindcss": { entryPoint: fileURLToPath(new URL("app.css", core)) } },
    rules: {
      ...tailwind.configs["recommended-error"].rules,
      "better-tailwindcss/no-unknown-classes": ["error", { ignore: legacy.length ? [`^(?:${legacy.join("|")})$`] : [] }],
      // No formatter wraps this repo's lines, so a class list stays on one line.
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    },
  },
  {
    // A guide's own panels can't reach for Tailwind: it only reads core's files, so a utility class there would lint as valid and
    // build to nothing. They may use only the classes core's old stylesheet still defines, until their panels move onto core's components.
    files: ["apps/**/*.tsx"],
    rules: {
      "better-tailwindcss/no-unknown-classes": "off",
      "better-tailwindcss/no-restricted-classes": [
        "error",
        { restrict: [{ pattern: `^(?!(?:${legacy.join("|")})$).+`, message: 'A guide uses core\'s components and its legacy classes only: "$0" isn\'t one.' }] },
      ],
    },
  },
  // The sync service runs on Node, not in a browser.
  { files: ["services/**/*.ts"], languageOptions: { globals: globals.node } },
);
