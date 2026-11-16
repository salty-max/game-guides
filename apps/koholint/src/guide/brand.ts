import type { Brand } from "@hundo/core/types";

/** Names, colours, storage and fonts. Also read by the build for the manifest and the page head. */
export const brand = {
  id: "links-awakening",
  name: "Koholint Hundo",
  shortName: "Koholint",
  title: "Koholint Hundo · Link’s Awakening 100% checklist",
  description: "A spoiler-conscious, interactive 100% guide to Link’s Awakening on Nintendo Switch.",
  storagePrefix: "koholint-field-guide",
  backupFile: "koholint-progress.json",
  mark: "Koholint",
  game: "Link’s Awakening",
  publisher: "Nintendo",
  corners: "narrow",
  home: "https://koholint.hundo.quest",
  fonts: {
    display: { family: "Playfair Display", file: "playfair.woff2", weight: "500 700", fallback: "Georgia,serif" },
    sans: { family: "DM Sans", file: "dm-sans.woff2", weight: "400 700", fallback: "system-ui,sans-serif" },
  },
} satisfies Brand;
