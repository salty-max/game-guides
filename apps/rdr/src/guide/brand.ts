import type { Brand } from "@hundo/core/types";

/** Names, colours, storage and fonts. Also read by the build for the manifest and the page head. */
export const brand = {
  id: "red-dead-redemption",
  name: "Red Dead Field Guide",
  shortName: "RDR",
  title: "Red Dead Field Guide · Red Dead Redemption",
  description: "A spoiler-aware walkthrough and 100% completion checklist for the original Red Dead Redemption campaign.",
  storagePrefix: "red-dead-field-guide",
  backupFile: "rdr-progress.json",
  mark: "RDR",
  icon: "compass",
  game: "Red Dead Redemption",
  credit: "Original campaign · 2010",
  corners: "narrow",
  home: "https://rdr.hundo.quest",
  movedFrom: ["reddead.hundo.quest"],
  fonts: {
    display: { family: "Barlow Condensed", file: "barlow-condensed.woff2", weight: "700", fallback: '"Arial Narrow",sans-serif' },
    sans: { family: "DM Sans", file: "dm-sans.woff2", weight: "400 700", fallback: "system-ui,sans-serif" },
  },
} satisfies Brand;
