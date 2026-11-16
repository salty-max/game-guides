import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { placeOf, safePlace, tabPlaces } from "./store/place";
import { useProgress } from "./store/progress";

/** Chromium's launch queue (the manifest's launch_handler): not in the DOM's types, as no other engine has it. */
interface LaunchQueue {
  setConsumer: (consumer: (params: { targetURL?: string }) => void) => void;
}

/**
 * Where a launch takes an open window. A shortcut does what its tab in the navigation does (MainNav): the saved chapter, the checklist as
 * it was left, the progress page, each a reader coming back to it. Any other address of the guide is a link. Null to stay put.
 */
export function launchTarget(path: string, current: string): { to: string; restore: boolean } | null {
  const data = useProgress.getState().data;
  const tabs: Record<string, string> = {
    "/guide": `/guide/${data.chapter}`,
    "/checklist": safePlace(tabPlaces.checklist, data) ?? "/checklist",
    "/dashboard": "/dashboard",
  };
  if (path === "/") return null;
  const tab = tabs[path];
  if (tab) return placeOf(current.split(/[?#]/)[0], data.chapter) === placeOf(tab, data.chapter) ? null : { to: tab, restore: true };
  return path === current ? null : { to: path, restore: false };
}

/**
 * A launch of the installed guide while its window is open. The manifest asks Chromium to bring that window forward rather than load the
 * guide again (`focus-existing`), and hands the launch's address here: the app's icon (the start address) leaves the reader where they
 * are, and a shortcut (Guide, Checklist, Progress) goes where its tab would. Opening the window afresh, the address is already the page,
 * so nothing moves. Browsers without the queue load the address as they always have.
 */
export function useLaunches() {
  const navigate = useNavigate();
  const go = useRef(navigate);
  useEffect(() => {
    go.current = navigate;
  }, [navigate]);
  useEffect(() => {
    const queue = (window as Window & { launchQueue?: LaunchQueue }).launchQueue;
    queue?.setConsumer(({ targetURL }) => {
      if (!targetURL) return;
      const url = new URL(targetURL);
      if (url.origin !== window.location.origin) return;
      const { pathname, search, hash } = window.location;
      const target = launchTarget(`${url.pathname}${url.search}${url.hash}`, `${pathname}${search}${hash}`);
      if (target) go.current(target.to, { state: target.restore ? { restore: true } : undefined });
    });
  }, []);
}
