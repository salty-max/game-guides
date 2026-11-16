import { create } from "zustand";
import { installed } from "../persistence";
import { isApple } from "../sync/label";

/** Chromium's offer to install the guide (beforeinstallprompt): not in the DOM's types, as no other engine has it. */
export interface InstallOffer extends Event {
  prompt: () => Promise<unknown>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Safari itself on an iPhone or an iPad, in a tab: the one browser there whose Add to Home Screen is known to carry the tab's cookies,
 * and with them a sync link, into the app (docs/core.md). Other iPhone browsers say "Safari" too: Chrome, Firefox, Edge, Opera and
 * DuckDuckGo add their own token, and the Google app leaves out Safari's `Version/`. One that sends Safari's own user agent word for word
 * (Brave, as far as is known, and Safari's views inside other apps) can't be told apart, and gets the line.
 */
export const safariTab = (userAgent = navigator.userAgent, touchPoints = navigator.maxTouchPoints, app = installed()) =>
  !app && isApple(userAgent, touchPoints) && /Version\/\d/.test(userAgent) && /Safari\//.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS|Ddg\//.test(userAgent);

interface InstallStore {
  /** Chromium's offer, kept for the Install button in Guide settings. Null until the browser makes one, and again once used or installed. */
  offer: InstallOffer | null;
  /** Whether Guide settings shows how to add the guide from Safari's Share menu. */
  safari: boolean;
}

export const useInstall = create<InstallStore>(() => ({ offer: null, safari: safariTab() }));

/**
 * Keeps Chromium's offer instead of letting the browser show its own banner: the guide offers to install only in Guide settings, where
 * the reader went looking. Called once, before the first render, since the offer can come before the settings' chunk loads. Chromium makes
 * no offer once the guide is installed, and says when it is (appinstalled). Returns the unsubscribe.
 */
export function listenForInstall(target: Window = window) {
  const offered = (event: Event) => {
    event.preventDefault();
    useInstall.setState({ offer: event as InstallOffer });
  };
  const done = () => useInstall.setState({ offer: null });
  target.addEventListener("beforeinstallprompt", offered);
  target.addEventListener("appinstalled", done);
  return () => {
    target.removeEventListener("beforeinstallprompt", offered);
    target.removeEventListener("appinstalled", done);
  };
}

/**
 * Shows the browser's install dialog. Call it from the press itself: the browser shows it only on a reader's action. An offer works once,
 * so it goes from the store whatever the answer (whether Chromium offers again later, and when, is its own business).
 */
export function install() {
  const { offer } = useInstall.getState();
  if (!offer) return;
  useInstall.setState({ offer: null });
  void offer.prompt().catch(() => {});
}
