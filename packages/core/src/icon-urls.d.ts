/** Served by icon-versions.ts's plugin: a public icon's path (`/icons/…` or `/favicon.ico`) to its URL with the content version. */
declare module "virtual:icon-urls" {
  const iconUrl: (path: string) => string;
  export default iconUrl;
}
