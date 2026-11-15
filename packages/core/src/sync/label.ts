/** An iPhone or an iPad. iPadOS Safari says "Macintosh" in its user agent, so a touch screen is what tells it from a Mac. */
export const isApple = (userAgent = navigator.userAgent, touchPoints = navigator.maxTouchPoints) =>
  /iPhone|iPad/.test(userAgent) || (/Macintosh/.test(userAgent) && touchPoints > 1);

/** The browser, by its user agent. Order matters: Edge and Opera say "Chrome" too, and every iPhone browser says "Safari". */
export function browserOf(ua = navigator.userAgent): string {
  if (/EdgA?\/|Edg\/|EdgiOS\//.test(ua)) return "Edge";
  if (/OPR\/|OPiOS\/|Opera/.test(ua)) return "Opera";
  if (/SamsungBrowser/.test(ua)) return "Samsung";
  if (/Firefox\/|FxiOS/.test(ua)) return "Firefox";
  if (/CriOS|Chrome\//.test(ua)) return "Chrome";
  return /Safari\//.test(ua) ? "Safari" : "Browser";
}

/**
 * A device as the sync list names it: the browser, the system, and for an installed app which guide's it is ("Safari · iPhone · Koholint app"),
 * since each installed guide is a device of its own. A guide's name isn't personal, and the server keeps at most 40 characters of it.
 */
export function deviceLabel(userAgent = navigator.userAgent, installed = false, touchPoints = navigator.maxTouchPoints, app = ""): string {
  const ua = userAgent;
  const system = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua) || (/Macintosh/.test(ua) && touchPoints > 1)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Windows/.test(ua)
          ? "Windows"
          : /Mac OS X|Macintosh/.test(ua)
            ? "Mac"
            : /CrOS/.test(ua)
              ? "Chromebook"
              : /Linux|X11/.test(ua)
                ? "Linux"
                : "";
  const browser = browserOf(ua);
  const label = system ? `${browser} · ${system}` : browser;
  return installed ? `${label} · ${app ? `${app} app` : "installed app"}` : label;
}
