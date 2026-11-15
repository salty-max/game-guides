import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import tailwind from "eslint-plugin-better-tailwindcss";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";

const core = new URL("./packages/core/src/", import.meta.url);

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
    settings: { "better-tailwindcss": { entryPoint: fileURLToPath(new URL("app.css", core)) } },
    rules: {
      ...tailwind.configs["recommended-error"].rules,
      // No formatter wraps this repo's lines, so a class list stays on one line.
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
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
