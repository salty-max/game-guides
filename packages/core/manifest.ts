// The installed app's manifest, which vite.ts hands to vite-plugin-pwa. Its pieces are in src/icons.ts; every picture it names goes through
// `url`, which versions it by content (icon-versions.ts).
import type { ManifestOptions } from "vite-plugin-pwa";
import { manifestIcons, manifestScreenshots, manifestShortcuts } from "./src/icons.ts";
import type { Brand } from "./src/types.ts";

export const guideManifest = (brand: Brand, palette: Record<string, string>, url: (path: string) => string): Partial<ManifestOptions> => {
  const versioned = <T extends { src: string }>(picture: T) => ({ ...picture, src: url(picture.src) });
  return {
    id: "/",
    name: brand.name,
    short_name: brand.shortName,
    description: brand.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    theme_color: palette["--surface"],
    background_color: palette["--paper"],
    categories: ["games", "utilities"],
    icons: manifestIcons.map(versioned),
    shortcuts: manifestShortcuts.map((shortcut) => ({ ...shortcut, icons: shortcut.icons.map(versioned) })),
    screenshots: manifestScreenshots(brand.name).map(versioned),
    // A second launch while the guide's window is open brings that window forward instead of loading the guide again, and a
    // shortcut's page opens in it (useLaunches.ts). Where a browser can't, it does what it always did.
    launch_handler: { client_mode: ["focus-existing", "auto"] },
  };
};
