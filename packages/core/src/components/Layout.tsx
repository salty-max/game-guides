import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigationType } from "react-router";
import { chunks, loadFailed } from "./chunks";
import { DialogHost } from "./DialogHost";
import { MainNav } from "./MainNav";
import { Rail } from "./Rail";
import { TopBar } from "./TopBar";
import { ToastHost } from "./ToastHost";
import { TooltipHost } from "./TooltipHost";
import { guideAnchor, readChapter } from "../guide";
import { panels } from "virtual:guide/panels";
import { useLoadable, whenIdle } from "../loadable";
import { isOpen, useProgress } from "../store/progress";
import { arrive, entryOffset, offsetOf, placeOf, savePlace, scrolled, useReturning } from "../store/place";
import { useUi } from "../store/ui";
import { isNarrow, useNarrow, usePhone } from "../useNarrow";
import { useChromeColor } from "../useThemeEffects";

function viewOf(pathname: string) {
  const [view = "guide", param, entry] = pathname.split("/").filter(Boolean);
  return { view, param, entry };
}

/**
 * The frame of every page: the top bar, the chapter rail (a drawer under 800px), the page itself, the tab bar (a phone) and the toasts. In a browser tab the
 * whole page scrolls under a sticky top bar. In the installed app (`standalone:`, see app.css) the frame is fixed to the screen and
 * only the main area scrolls.
 */
export function Layout({ children }: { children: ReactNode }) {
  const { pathname, key } = useLocation();
  const chapter = useProgress((s) => s.data.chapter);
  const announcement = useUi((s) => s.announcement);
  const dialogOpen = useUi((s) => s.dialog !== null);
  useChromeColor(dialogOpen);
  // Under 800px the chapter rail is a drawer (RailDrawer.tsx, a chunk of its own); wider, a column beside the page.
  const narrow = useNarrow();
  // On a phone the three pages are a tab bar at the bottom instead of links in the top bar (TopBar.tsx).
  const phone = usePhone();
  // The drawer is open only for the page it was opened on, so navigating closes it, and only while there is a drawer.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  if (menuPath !== null && (!narrow || menuPath !== pathname)) setMenuPath(null);
  const menuOpen = menuPath === pathname;
  // Where the drawer was opened, for the focus when it closes: back to the menu button, unless a link was followed.
  const openedOn = useRef<string | null>(null);
  const followedLink = useRef(false);
  const setMenuOpen = (open: boolean) => {
    if (open) {
      openedOn.current = pathname;
      followedLink.current = false;
    }
    setMenuPath(open ? pathname : null);
  };
  const drawer = useLoadable(chunks.drawer, menuOpen, () => {
    setMenuPath(null);
    loadFailed();
  });
  // Fetched ahead only where it can be needed; a window that narrows later loads it when the menu opens.
  useEffect(
    () =>
      whenIdle(() => {
        if (isNarrow()) chunks.drawer.warm();
      }),
    [],
  );
  const mainRef = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  // The history entry last shown: an effect run again for the same one (React does that in development) changes nothing.
  const shown = useRef<string | null>(null);
  const { view, param, entry } = viewOf(pathname);
  const activeChapter = readChapter(param, chapter);
  const guideTarget = view === "guide" && guideAnchor(activeChapter, entry);
  const targetedGuide = useProgress((s) => Boolean(guideTarget && isOpen(s.data, activeChapter)));
  const targeted = targetedGuide || (view === "dashboard" && panels.some((panel) => panel.id === param));
  const place = placeOf(pathname, chapter);
  const returning = useReturning();

  // Where the reader is on each page, as they scroll (the window in a browser tab, the main area in the installed app), and the place
  // saved as the guide goes into the background, for the next launch (store/place.ts).
  useEffect(() => {
    const onScroll = (event: Event) => {
      const main = mainRef.current;
      if (event.target === document) scrolled(window.scrollY);
      else if (main && event.target === main) scrolled(main.scrollTop);
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") savePlace();
    };
    // A scroll doesn't bubble: the main area's is caught on its way down.
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", savePlace);
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", savePlace);
    };
  }, []);

  // Moving to a new page: back to where the reader left it if they are coming back to it (Back or Forward to that very entry, a tab of the
  // bar, a launch that reopens the last place), its top otherwise, and the focus in <main>. An address that points at something to scroll
  // to (a guide section or entry, or a dashboard panel) is left to the page, unless Back returns to it, where it was left wins. A layout
  // effect, so the page is where it belongs before it is shown. It runs after the page's own effects, so it has the last word.
  const pop = useNavigationType() === "POP";
  useLayoutEffect(() => {
    if (shown.current === key) return;
    const first = shown.current === null;
    shown.current = key;
    arrive(place, key, returning);
    const left = pop ? entryOffset(key) : undefined;
    if (targeted && left === undefined) return;
    const offset = left ?? (returning ? offsetOf(place) : undefined);
    // The first page of a visit keeps the focus where the browser put it, and is scrolled only to a place being reopened.
    if (first && offset === undefined) return;
    window.scrollTo(0, offset ?? 0);
    // In the installed app the main area scrolls, not the page.
    mainRef.current?.scrollTo(0, offset ?? 0);
    if (!first && !targeted) mainRef.current?.focus({ preventScroll: true });
  }, [key, place, pop, returning, targeted]);

  return (
    <>
      <a
        // Out of sight until it takes the focus, then in the top corner.
        className="absolute -top-96 left-3 z-30 rounded-small bg-surface px-3 py-2 whitespace-nowrap focus:fixed focus:top-[calc(12px+var(--safe-top))] focus:left-[calc(12px+var(--safe-left))]"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <TopBar chapter={chapter} view={view} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} menuToggle={menuToggle} />
      <div className="grid min-h-[calc(100dvh-var(--bar)-var(--tabs))] grid-cols-[var(--rail-col)_minmax(0,1fr)] standalone:min-h-0 standalone:flex-1 standalone:grid-rows-[minmax(0,1fr)] drawer:block standalone:drawer:grid standalone:drawer:grid-cols-[minmax(0,1fr)]">
        {/* The drawer stays mounted (closed, it renders nothing) so that widening past 800px closes it the ordinary way, focus and all. */}
        {drawer && (
          <drawer.RailDrawer
            open={menuOpen}
            onOpenChange={setMenuOpen}
            activeChapter={activeChapter}
            view={view}
            onFollowLink={() => {
              followedLink.current = true;
            }}
            returnFocus={() => {
              // Widened past 800px while open: the menu button is hidden at that width, so the focus goes into the page.
              if (!isNarrow()) return mainRef.current ?? false;
              // A link to another page: Layout puts the focus in the page after the move (or on what the address points at).
              if (window.location.pathname !== openedOn.current) return false;
              // The current chapter's link moves nothing, so the focus goes into the page from here.
              if (followedLink.current) return mainRef.current ?? false;
              return menuToggle.current ?? false;
            }}
          />
        )}
        {!narrow && <Rail activeChapter={activeChapter} view={view} />}
        <main
          id="main"
          tabIndex={-1}
          ref={mainRef}
          // --gutter is the page's side padding, --pad-end the room under it (and both get the notch and the home indicator on top, but on a
          // phone the tab bar covers the home indicator, so the room under the page is --pad-end alone).
          // The page is at most 1460px wide, centred. In the installed app <main> is what scrolls, so it takes the whole width (the
          // scrollbar and the wheel then belong to the window's edges) and --center is the margin that centring would have made.
          className="mx-auto w-full max-w-[1460px] min-w-0 pt-6 pr-[calc(var(--gutter)+var(--center,0px)+var(--safe-right))] pb-[calc(var(--pad-end)+var(--safe-bottom))] pl-[calc(var(--gutter)+var(--center,0px))] outline-none [--gutter:clamp(23px,3.25vw,53px)] [--pad-end:50px] standalone:max-w-none standalone:scroll-pt-6 standalone:overflow-y-auto standalone:overscroll-contain standalone:[--center:max(0px,calc((100%-1460px)/2))] drawer:pt-[18px] drawer:pl-[calc(var(--gutter)+var(--safe-left))] drawer:[--gutter:18px] drawer:[--pad-end:30px] phone:pt-[13px] phone:pb-(--pad-end) phone:[--gutter:12px] phone:[--pad-end:25px]"
        >
          {children}
        </main>
      </div>
      {phone && <MainNav chapter={chapter} view={view} place="bottom" />}
      <DialogHost />
      <ToastHost />
      <TooltipHost />
      <div id="status" className="sr-only" role="status">
        {announcement}
      </div>
    </>
  );
}
