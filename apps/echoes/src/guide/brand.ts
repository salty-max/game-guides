import type { Brand } from "../core/types";

/** Names, colours, storage and fonts. Also read by vite.config.ts for the manifest and index.html. */
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
  hero: "inset",
  colors: { light: "#e9e2f7", dark: "#1a1730", background: "#f8f4fc" },
  fonts: {
    display: { family: "Fraunces", file: "fraunces.woff2", weight: "100 900", fallback: "Georgia,serif" },
    sans: { family: "Nunito", file: "nunito.woff2", weight: "200 1000", fallback: "system-ui,sans-serif" },
  },
} satisfies Brand;
