// The manifest's icons, which `pnpm icons` writes from each guide's painting (icons.mjs). The tab icons are the
// page's own links (index.html). No SVG here: it would fit every size, and installed-app surfaces would show the tab
// drawing instead of the painting.
export const manifestIcons = [
  { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
  { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
  { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
];

/** The top bar's brand tile, the painting at 40px and its 2x and 3x (a phone's 34px tile at 3x takes 102). */
export const tileSizes = [40, 80, 120];
export const tileSrc = (size: number) => `/icons/tile-${size}.png`;
export const tileSrcSet = tileSizes.map((size, i) => `${tileSrc(size)} ${i + 1}x`).join(", ");
