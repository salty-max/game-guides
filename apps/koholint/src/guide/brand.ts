import type { Brand } from "@game-guides/core/types";

/** Names, colours, storage and fonts. Also read by the build for the manifest and the page head. */
export const brand = {
  id: "links-awakening",
  name: "Koholint Field Guide",
  shortName: "Koholint",
  title: "Koholint Field Guide · Link’s Awakening",
  description: "A spoiler-conscious, interactive 100% field guide to Link’s Awakening on Nintendo Switch.",
  storagePrefix: "koholint-field-guide",
  backupFile: "koholint-progress.json",
  mark: "Koholint",
  icon: "compass",
  game: "Link’s Awakening",
  credit: "Nintendo Switch · 2019 remake",
  hero: "overlay",
  colors: { light: "#172d25", dark: "#102019", background: "#152b23" },
  fonts: {
    display: { family: "Playfair Display", file: "playfair.woff2", weight: "500 700", fallback: "Georgia,serif" },
    sans: { family: "DM Sans", file: "dm-sans.woff2", weight: "400 700", fallback: "system-ui,sans-serif" },
  },
} satisfies Brand;
