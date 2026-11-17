import { fontCss } from "@hundo/core/fonts";
import type { Brand } from "@hundo/core/types";
import { brand as echoes } from "../../../apps/echoes/src/guide/brand";
import echoesTheme from "../../../apps/echoes/src/guide/theme.css?raw";
import { brand as koholint } from "../../../apps/koholint/src/guide/brand";
import koholintTheme from "../../../apps/koholint/src/guide/theme.css?raw";
import { brand as rdr } from "../../../apps/rdr/src/guide/brand";
import rdrTheme from "../../../apps/rdr/src/guide/theme.css?raw";
import type { GuideId, ThemeId } from "./ids";

/** Each guide's palette (its theme.css, as text) and brand: the only things a guide sets, so the only things the toolbar switches. */
export const guides = {
  koholint: { brand: koholint, palette: koholintTheme },
  rdr: { brand: rdr, palette: rdrTheme },
  echoes: { brand: echoes, palette: echoesTheme },
} satisfies Record<GuideId, { brand: Brand; palette: string }>;

/** The stylesheet the build would put in a guide's page: its palette, then its fonts. */
export const guideCss = (guide: GuideId) => guides[guide].palette + fontCss(guides[guide].brand);

/** One theme's palette values, read back from theme.css: `{ "--primary": "#6648b0", … }`. */
export const paletteOf = (guide: GuideId, theme: ThemeId): Record<string, string> => {
  const selector = theme === "dark" ? ':root[data-theme="dark"]' : ":root";
  const block = guides[guide].palette.split(`${selector}{`)[1]?.split("}")[0] ?? "";
  return Object.fromEntries([...block.matchAll(/(--[a-z-]+):([^;]+)/g)].map(([, key, value]) => [key, value.trim()]));
};
