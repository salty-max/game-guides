import { pages } from "./nav.ts";

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

/**
 * The installed app's shortcuts (its icon's menu on Android and on the desktop): the three pages, each with its glyph drawn on the guide's
 * own colours by `pnpm icons`, at 96 and 192px, and at 192px full-bleed for launchers that crop to their own shape.
 */
export const shortcutIcon = (id: string, size: number, maskable = false) => `icons/shortcut-${id}${maskable ? "-maskable" : ""}-${size}.png`;
export const shortcutSizes = [96, 192];
export const manifestShortcuts = pages.map(([id, label]) => ({
  name: label,
  url: `/${id}`,
  icons: [
    ...shortcutSizes.map((size) => ({ src: shortcutIcon(id, size), sizes: `${size}x${size}`, type: "image/png", purpose: "any" })),
    { src: shortcutIcon(id, 192, true), sizes: "192x192", type: "image/png", purpose: "maskable" },
  ],
}));

/**
 * The pictures of the guide Chromium's install dialog shows, one for wide windows and one for phones: its first chapter, as
 * `pnpm screenshots` takes it from the production build (screenshots.mjs). JPEG, which the service worker's precache leaves out: only
 * the install dialog uses them, and it is online.
 */
export const screenshots = [
  { src: "icons/screenshot-wide.jpg", formFactor: "wide", viewport: { width: 1280, height: 800 }, scale: 1, label: "in a wide window" },
  { src: "icons/screenshot-narrow.jpg", formFactor: "narrow", viewport: { width: 360, height: 780 }, scale: 1.5, label: "on a phone" },
] as const;
export const manifestScreenshots = (name: string) =>
  screenshots.map(({ src, formFactor, viewport, scale, label }) => ({
    src,
    sizes: `${viewport.width * scale}x${viewport.height * scale}`,
    type: "image/jpeg",
    form_factor: formFactor,
    label: `${name} at its first chapter, ${label}`,
  }));
