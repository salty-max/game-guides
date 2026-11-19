import type { Brand } from "@hundo/core/types";

/** Names, colours, storage and fonts. Also read by the build for the manifest and the page head. */
export const brand = {
  id: "silksong",
  name: "Pharloom Hundo",
  shortName: "Pharloom",
  title: "Pharloom Hundo · Hollow Knight: Silksong 100% completion checklist",
  description:
    "A spoiler-aware walkthrough and 100% checklist for Hollow Knight: Silksong: every tool, crest, Mask Shard, Spool Fragment, flea, Wish and boss.",
  storagePrefix: "hundo-pharloom",
  backupFile: "pharloom-progress.json",
  mark: "Pharloom",
  game: "Hollow Knight: Silksong",
  publisher: "Team Cherry",
  corners: "narrow",
  home: "https://pharloom.hundo.quest",
  fonts: {
    display: { family: "Alegreya", file: "alegreya.woff2", weight: "400 900", fallback: "Georgia,serif" },
    sans: { family: "Manrope", file: "manrope.woff2", weight: "200 800", fallback: "system-ui,sans-serif" },
  },
} satisfies Brand;
