import { leaving } from "./boot";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { listenForInstall } from "./store/install";
import { restoreLaunch } from "./store/place";
import "./app.css";
import "virtual:guide/theme.css";

// iOS Safari applies :active on touch only on a page that listens for touchstart (MDN's :active page; WebKit bug 138816): this listener is
// what lets a pressed control show it (press-style.ts). It does nothing and never blocks a scroll.
document.addEventListener("touchstart", () => {}, { passive: true });

if (!leaving) {
  // Opened at its start address (the home screen icon), the guide goes back to where the reader was (store/place.ts).
  restoreLaunch();
  // Chromium's offer to install waits for Guide settings, with no banner of the browser's own (store/install.ts).
  listenForInstall();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
