/// <reference types="vitest/config" />
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import type { Brand, FontFace } from "./src/types.ts";

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));
// index.html loads the app through this id, which resolves to core's main.tsx.
const ENTRY = "/@core/main.tsx";

/** The light palette from the guide's theme.css, for the colours the browser and the installed app show before CSS loads. */
const lightPalette = (root: string) => {
  const css = readFileSync(`${root}/src/guide/theme.css`, "utf8");
  const block = css.split(":root{")[1]?.split("}")[0] ?? "";
  return Object.fromEntries([...block.matchAll(/(--[a-z-]+):([^;]+)/g)].map(([, key, value]) => [key, value.trim()]));
};

const font = (face: FontFace) =>
  `@font-face{font-family:"${face.family}";src:url("/fonts/${face.file}") format("woff2");font-weight:${face.weight};font-display:swap}`;

/**
 * Serves the page every guide shares: core's index.html with the brand filled in, and theme-init.js beside it.
 * theme-init.js stays an external file so the CSP can forbid inline scripts.
 */
const guideShell = (root: string, brand: Brand, palette: Record<string, string>): Plugin => {
  const page = `${root}/index.html`;
  const template = readFileSync(here("./index.html"), "utf8");
  const themeInit = readFileSync(here("./theme-init.js"), "utf8");
  const values: Record<string, string> = {
    TITLE: brand.title,
    SHORT_NAME: brand.shortName,
    DESCRIPTION: brand.description,
    THEME_COLOR: palette["--surface"],
    CORNERS: brand.corners,
    STORAGE: brand.storagePrefix,
    FONTS: [
      font(brand.fonts.display),
      font(brand.fonts.sans),
      `:root{--display:"${brand.fonts.display.family}",${brand.fonts.display.fallback};--sans:"${brand.fonts.sans.family}",${brand.fonts.sans.fallback}}`,
    ].join(""),
  };

  return {
    name: "guide-shell",
    enforce: "pre",
    resolveId: (id) => (id === ENTRY ? here("./src/main.tsx") : id === page ? page : undefined),
    load: (id) => (id === page ? template : undefined),
    transformIndexHtml: {
      order: "pre",
      handler: (html) => html.replace(/%GUIDE_([A-Z_]+)%/g, (match, key: string) => values[key] ?? match),
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? "/").split("?")[0];
        if (path === "/theme-init.js") {
          res.setHeader("Content-Type", "text/javascript");
          res.end(themeInit);
        } else if (req.method === "GET" && req.headers.accept?.includes("text/html") && !/\.\w+$/.test(path)) {
          res.setHeader("Content-Type", "text/html");
          res.end(await server.transformIndexHtml("/index.html", template));
        } else next();
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "theme-init.js", source: themeInit });
    },
  };
};

/** The whole Vite and Vitest setup for a guide app: pass the app's folder and its brand. */
export const guideConfig = (root: string, brand: Brand) => {
  const palette = lightPalette(root);
  return defineConfig({
    resolve: {
      // Core imports the guide's config, panels and theme through virtual:guide/…, which is the app's src/guide.
      alias: [{ find: /^virtual:guide\//, replacement: `${root}/src/guide/` }],
    },
    plugins: [
      guideShell(root, brand, palette),
      react(),
      VitePWA({
        // "prompt": a new version waits until the reader accepts, so a reload never lands mid-checklist.
        registerType: "prompt",
        includeAssets: ["icons/favicon.svg", "icons/apple-touch-icon.png", "fonts/*.woff2"],
        manifest: {
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
          icons: [
            { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
            { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
            { src: "icons/favicon.svg", sizes: "any", type: "image/svg+xml" },
          ],
        },
        workbox: {
          // Precache the whole shell, fonts and banners so the guide works offline.
          globPatterns: ["**/*.{js,css,html,webp,woff2,png,svg}"],
          // Client-side routes (/guide/3 …) all resolve to the app shell.
          navigateFallback: "index.html",
          cleanupOutdatedCaches: true,
        },
        devOptions: { enabled: false },
      }),
    ],
    build: { target: "es2022", sourcemap: true },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: [here("./src/test/setup.ts")],
      // Stylesheets load empty in tests, except the ?raw text the theme test reads.
      css: { include: [/\.css\?raw$/] },
      // Core's shared suites run against this guide, beside the guide's own tests.
      include: ["src/**/*.test.{ts,tsx}", `${here("./src")}/**/*.test.{ts,tsx}`],
    },
  });
};
