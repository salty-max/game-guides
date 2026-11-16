import type { paths } from "./icon-paths";

/**
 * The guide's three pages, as the main navigation lists them (MainNav) and as the installed app's shortcuts do (the manifest, with
 * icons drawn by icons.mjs). Each one's id is its address's first part, its label and its icon's drawing.
 */
export const pages = [
  ["guide", "Guide", "book"],
  ["checklist", "Checklist", "checkList"],
  ["dashboard", "Progress", "chart"],
] as const satisfies readonly (readonly [string, string, keyof typeof paths])[];
