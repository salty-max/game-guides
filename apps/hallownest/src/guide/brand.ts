import type { Brand } from "@hundo/core/types";

/** Names, colours, storage and fonts. Also read by the build for the manifest and the page head. */
export const brand = {
  id: "hollow-knight",
  name: "Hallownest Hundo",
  shortName: "Hallownest",
  title: "Hallownest Hundo · Hollow Knight 112% completion checklist",
  description:
    "A spoiler-aware walkthrough and completion checklist for Hollow Knight: every charm, boss, Mask Shard, Vessel Fragment and Grub on the way to 112%.",
  storagePrefix: "hundo-hallownest",
  backupFile: "hallownest-progress.json",
  mark: "Hallownest",
  game: "Hollow Knight",
  publisher: "Team Cherry",
  corners: "narrow",
  home: "https://hallownest.hundo.quest",
  fonts: {
    display: { family: "Cormorant Garamond", file: "cormorant-garamond.woff2", weight: "300 700", fallback: "Georgia,serif" },
    sans: { family: "Nunito Sans", file: "nunito-sans.woff2", weight: "200 1000", fallback: "system-ui,sans-serif" },
  },
} satisfies Brand;
