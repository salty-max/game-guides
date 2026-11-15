/** An iPhone or an iPad. iPadOS Safari says "Macintosh" in its user agent, so a touch screen is what tells it from a Mac. */
export const isApple = (userAgent = navigator.userAgent, touchPoints = navigator.maxTouchPoints) =>
  /iPhone|iPad/.test(userAgent) || (/Macintosh/.test(userAgent) && touchPoints > 1);

/** A device as the sync list names it: the browser, the system, and whether it is an installed app. */
export function deviceLabel(userAgent = navigator.userAgent, installed = false, touchPoints = navigator.maxTouchPoints): string {
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
  // Order matters: Edge and Opera say "Chrome" too, and every iPhone browser says "Safari".
  const browser = /EdgA?\/|Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung Internet"
        : /Firefox\/|FxiOS/.test(ua)
          ? "Firefox"
          : /CriOS|Chrome\//.test(ua)
            ? "Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Browser";
  const label = system ? `${browser} · ${system}` : browser;
  return installed ? `${label} · installed app` : label;
}
