/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { brand } from "./src/guide/brand.ts";

const font = (face: typeof brand.fonts.display) =>
  `@font-face{font-family:"${face.family}";src:url("/fonts/${face.file}") format("woff2");font-weight:${face.weight};font-display:swap}`;

/** Fills index.html's %GUIDE_*% placeholders from the guide's brand, so the file is the same in every guide. */
const guideHtml = (): Plugin => ({
  name: "guide-html",
  transformIndexHtml: {
    order: "pre",
    handler: (html) => {
      const values: Record<string, string> = {
        TITLE: brand.title,
        SHORT_NAME: brand.shortName,
        DESCRIPTION: brand.description,
        THEME_COLOR: brand.colors.light,
        STORAGE: brand.storagePrefix,
        FONTS: [
          font(brand.fonts.display),
          font(brand.fonts.sans),
          `:root{--display:"${brand.fonts.display.family}",${brand.fonts.display.fallback};--sans:"${brand.fonts.sans.family}",${brand.fonts.sans.fallback}}`,
        ].join(""),
      };
      return html.replace(/%GUIDE_([A-Z_]+)%/g, (match, key: string) => values[key] ?? match);
    },
  },
});

export default defineConfig({
  plugins: [
    guideHtml(),
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
        theme_color: brand.colors.light,
        background_color: brand.colors.background,
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
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
