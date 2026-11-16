// Every icon URL the page, the manifest and the top bar name carries its file's content hash as `?v=`, read in Node at build time.
// The files keep their names and their week-long cache: a changed picture is a new URL, which no browser cache or CDN has seen. (On
// 16 Nov 2026 new art was live and an iPhone still installed the old icon from the unchanged address.)
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import type { Plugin } from "vite";

/** The public files that are versioned: the root favicon and everything under /icons. */
const iconPath = /^\/?(favicon\.ico|icons\/[^?#"]+)$/;

/** The first 8 hex digits of the file's MD5, the hash Workbox gives the same file as its precache revision, so the two can be compared. */
const hash = (file: string) => createHash("md5").update(readFileSync(file)).digest("hex").slice(0, 8);

/**
 * `(path) => path?v=<hash>` for the guide's public folder. The path keeps its own form, with or without the leading slash (the manifest's
 * are relative to it). A file that isn't there yet keeps its bare path, so a new guide still runs before `pnpm icons` and
 * `pnpm screenshots` have written everything (the screenshots are taken from a build): `icons.test.ts` fails on any missing file, and
 * `icon-versions.test.ts` on any bare URL, so a guide that passes the check names only versioned ones.
 */
export const iconUrl = (publicDir: string) => (path: string) => {
  const [, file] = iconPath.exec(path) ?? [];
  if (!file) throw new Error(`${path}: only /favicon.ico and files under /icons get a versioned URL`);
  return existsSync(`${publicDir}/${file}`) ? `${path}?v=${hash(`${publicDir}/${file}`)}` : path;
};

/** The page with every `href` or `src` that names an icon by its bare path versioned. */
export const versionIconLinks = (html: string, url: (path: string) => string) =>
  html.replace(/\b(href|src)="(\/(?:favicon\.ico|icons\/[^"?#]+))"/g, (_, attribute: string, path: string) => `${attribute}="${url(path)}"`);

const VIRTUAL = "virtual:icon-urls";

/**
 * Versions the icons the page links, and serves `virtual:icon-urls` to code that runs in the browser (the top bar's tile): its default
 * export turns `/icons/…` into the versioned URL, or leaves the path bare for a file the guide doesn't have yet, as `iconUrl` does.
 * Storybook adds it too, pointed at the guide whose icons it serves.
 */
export const iconUrls = (publicDir: string): Plugin => {
  const url = iconUrl(publicDir);
  return {
    name: "icon-urls",
    resolveId: (id) => (id === VIRTUAL ? `\0${VIRTUAL}` : undefined),
    load: (id) => {
      if (id !== `\0${VIRTUAL}`) return;
      const names = existsSync(`${publicDir}/icons`) ? readdirSync(`${publicDir}/icons`) : [];
      const urls = Object.fromEntries(["/favicon.ico", ...names.map((name) => `/icons/${name}`)].map((path) => [path, url(path)]));
      return `const urls = ${JSON.stringify(urls)};\nexport default (path) => urls[path] ?? path;\n`;
    },
    transformIndexHtml: (html) => versionIconLinks(html, url),
  };
};
