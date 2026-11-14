import type { Brand } from "@hundo/core/types";

/** Names, colours, storage and fonts. Also read by the build for the manifest and the page head. */
export const brand = {
  id: "echoes-of-wisdom",
  name: "Echoes of Wisdom Field Guide",
  shortName: "Echoes",
  title: "Echoes of Wisdom Field Guide",
  description: "A spoiler-aware walkthrough and completion checklist for The Legend of Zelda: Echoes of Wisdom.",
  storagePrefix: "echoes-of-wisdom-field-guide",
  backupFile: "echoes-of-wisdom-progress.json",
  mark: "Echoes of Wisdom",
  icon: "tri",
  game: "Echoes of Wisdom",
  credit: "Nintendo Switch · 2024",
  corners: "normal",
  home: "https://echoes.hundo.quest",
  movedFrom: ["echoes-of-wisdom-field-guide.vercel.app"],
  fonts: {
    display: { family: "Fraunces", file: "fraunces.woff2", weight: "100 900", fallback: "Georgia,serif" },
    sans: { family: "Nunito", file: "nunito.woff2", weight: "200 1000", fallback: "system-ui,sans-serif" },
  },
} satisfies Brand;
