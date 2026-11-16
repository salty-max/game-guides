// The manifest's icons, which `pnpm icons` writes from each guide's painting (icons.mjs). The tab icons are the
// page's own links (index.html). No SVG here: it would fit every size, and installed-app surfaces would show the tab
// drawing instead of the painting.
export const manifestIcons = [
  { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
  { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
  { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
];
