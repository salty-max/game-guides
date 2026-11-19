import type { Brand } from "@hundo/core/types";

/** Names, colours, storage and fonts. Also read by the build for the manifest and the page head. */
export const brand = {
  id: "dark-souls-remastered",
  name: "Lordran Hundo",
  shortName: "Lordran",
  title: "Lordran Hundo · Dark Souls Remastered completion checklist",
  description:
    "A spoiler-aware walkthrough and completion checklist for Dark Souls Remastered: every boss, covenant, rare weapon, ring and spell across three playthroughs.",
  storagePrefix: "hundo-lordran",
  backupFile: "lordran-progress.json",
  mark: "Lordran",
  game: "Dark Souls Remastered",
  publisher: "Bandai Namco",
  corners: "narrow",
  home: "https://lordran.hundo.quest",
  fonts: {
    display: { family: "Cinzel", file: "cinzel.woff2", weight: "400 900", fallback: "Georgia,serif" },
    sans: { family: "Source Sans 3", file: "source-sans-3.woff2", weight: "200 900", fallback: "system-ui,sans-serif" },
  },
} satisfies Brand;
