import { cva } from "class-variance-authority";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Icon } from "./Icon";
import { IconButton } from "./ui";
import { brand } from "../guide";
import { useProgress } from "../store/progress";
import { useTheme } from "../store/theme";
import { useSyncStatus, type SyncPhase } from "../store/sync";
import { useUi } from "../store/ui";
import { useResolvedTheme } from "../useThemeEffects";

/**
 * Whether there is somewhere in the app to go back to, in the guide installed as an app, which has no browser back button. (iOS lets
 * a reader swipe in from the left edge, and Android has its back button, but neither says so on the screen.) A browser tab has its
 * own button, so there it is never true. The dialogs have no need of one: they close with their own button, as a sheet does.
 */
function useCanGoBack() {
  // The router keeps each entry's position in the history in its state: 0 is where the app opened. A move changes the location.
  useLocation();
  const position = (window.history.state as { idx?: number } | null)?.idx ?? 0;
  return document.documentElement.dataset.standalone !== undefined && position > 0;
}

function ThemeToggle() {
  const dark = useResolvedTheme() === "dark";
  const setPreference = useTheme((s) => s.setPreference);
  const announce = useUi((s) => s.announce);
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  return (
    <IconButton
      icon={dark ? "sun" : "moon"}
      label={label}
      title={label}
      onClick={() => {
        const next = dark ? "light" : "dark";
        setPreference(next);
        announce(next === "dark" ? "Dark mode enabled." : "Light mode enabled.");
      }}
    />
  );
}

/** What the topbar says about sync, once a device is linked. */
const syncWords: Record<Exclude<SyncPhase, "off">, string> = {
  joining: "Syncing",
  waiting: "Syncing",
  synced: "Synced",
  offline: "Offline",
  paused: "Sync paused",
  error: "Sync problem",
};

function SaveStatus() {
  const error = useProgress((s) => s.storageError);
  const phase = useSyncStatus((s) => s.phase);
  const openDialog = useUi((s) => s.openDialog);
  const linked = phase !== "off";
  const word = linked && !error ? syncWords[phase] : "";
  // A linked device opens the Sync screen from here, where the settings are one button away; one that isn't opens the settings as before.
  return (
    <button
      className="flex min-h-10 items-center gap-2 rounded-control border border-control-line bg-transparent px-3 py-1.5 text-[12px] font-bold whitespace-nowrap text-muted hover:bg-raised drawer:w-(--icon-w,2.5rem) drawer:justify-center drawer:gap-0 drawer:p-0 drawer:text-[0px]"
      type="button"
      data-error={error || ["offline", "paused", "error"].includes(phase) ? "" : undefined}
      aria-label={
        error
          ? "Storage unavailable. Open progress settings"
          : linked
            ? `Progress saved. ${word}. Open sync`
            : "Progress saved. Open progress settings"
      }
      onClick={() => openDialog({ kind: linked && !error ? "sync" : "settings" })}
    >
      <span className="block size-2 rounded-full bg-ok shadow-[0_0_0_3px_color-mix(in_srgb,var(--ok)_15%,transparent)] in-data-error:bg-warn" />
      {error ? "Storage unavailable" : word ? `Progress saved · ${word}` : "Progress saved"}
    </button>
  );
}

const navs = [
  ["guide", "Guide", "book"],
  ["checklist", "Checklist", "checkList"],
  ["dashboard", "Progress", "chart"],
] as const;

// Where there is a way back, the brand gives its place to it under 1041px (a phone, or an iPad in portrait): there's no room for both
// beside the menu and the pages. Checked with Echoes, whose name is the longest, at 820px, where its text ran into the Guide link.
const brandLink = cva("flex w-max shrink-0 items-center gap-[11px] px-6 mid:pl-[17px] drawer:gap-[7px] drawer:px-2.5 slim:px-1.5", {
  variants: { canGoBack: { true: "mid:hidden", false: "" } },
});

interface TopBarProps {
  /** The chapter the Guide link opens. */
  chapter: number;
  /** Which page the reader is on, for the link that says so. */
  view: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  menuToggle: RefObject<HTMLButtonElement | null>;
}

/** The bar across the top: the way back (installed app only), the brand, the three pages, and the theme and save buttons. */
export function TopBar({ chapter, view, menuOpen, onToggleMenu, menuToggle }: TopBarProps) {
  const canGoBack = useCanGoBack();
  const navigate = useNavigate();
  const brandLinkRef = useRef<HTMLAnchorElement>(null);
  const backHadFocus = useRef(false);
  // React runs a ref's cleanup before it removes the node, while the node still has the focus (a browser may fire blur as it goes, so a
  // blur handler can't tell). The callback is stable, so the cleanup runs only when the button really goes.
  const backRef = useCallback((node: HTMLButtonElement | null) => {
    return () => {
      if (node && document.activeElement === node) backHadFocus.current = true;
    };
  }, []);
  // The Back button goes when the reader gets back to where the app opened, and the focus would fall to the page. It goes to the brand
  // (Layout then moves it to the page's main area, unless the address points at something to scroll to).
  useEffect(() => {
    if (!canGoBack && backHadFocus.current) {
      backHadFocus.current = false;
      brandLinkRef.current?.focus();
    }
  }, [canGoBack]);
  const to = (id: (typeof navs)[number][0]) => (id === "guide" ? `/guide/${chapter}` : `/${id}`);
  return (
    <header className="sticky top-0 z-10 grid h-(--bar) grid-cols-[var(--rail-w)_1fr_auto] items-center border-b border-line bg-surface pt-(--safe-top) pr-(--safe-right) pl-(--safe-left) text-ink standalone:relative standalone:flex-none standalone:select-none standalone:[-webkit-touch-callout:none] drawer:grid-cols-[auto_auto_1fr_auto] tiny:[--icon-w:34px]">
      {/* Shown only under 800px: `hidden` is the class's own, and `drawer:block` brings it back. */}
      <div className="ml-[11px] hidden drawer:block tiny:ml-[7px]">
        <IconButton
          ref={menuToggle}
          icon="menu"
          label={menuOpen ? "Close chapters" : "Open chapters"}
          aria-haspopup="dialog"
          aria-controls={menuOpen ? "chapter-rail" : undefined}
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
        />
      </div>
      <div className="flex items-center">
        {canGoBack && (
          <div className="ml-4 drawer:ml-1.5">
            <IconButton
              icon="left"
              label="Back"
              ref={backRef}
              onClick={() => void navigate(-1)}
            />
          </div>
        )}
        <Link
          ref={brandLinkRef}
          className={brandLink({ canGoBack })}
          to={`/guide/${chapter}`}
          aria-label={`${brand.name} home`}
        >
          <span className="grid size-10 place-items-center rounded-control bg-primary text-on-primary drawer:size-[34px]">
            <Icon name={brand.icon} className="svg-icon size-6 drawer:size-5" />
          </span>
          <span className="grid gap-[3px] leading-[1.1] slim:hidden">
            <strong className="font-display text-[21px] leading-[1.05] font-bold tracking-[-0.01em] drawer:text-[17px]">{brand.mark}</strong>
            {/* The space isn't drawn (it's a grid), but without it the link's visible text reads "KoholintHundo", which its name, "Koholint Hundo home", doesn't contain. */}
            {" "}
            <small className="text-[11px] font-extrabold tracking-[0.2em] text-primary uppercase drawer:hidden">Hundo</small>
          </span>
        </Link>
      </div>
      <nav id="top-nav" className="ml-[-42px] flex gap-2 justify-self-center drawer:ml-0 drawer:gap-0.5" aria-label="Main navigation">
        {navs.map(([id, label, icon]) => (
          <Link
            key={id}
            to={to(id)}
            aria-current={view === id ? "page" : undefined}
            className="flex min-h-10 items-center gap-2 rounded-button px-3.5 py-2.5 text-[14px] leading-[1.2] font-bold whitespace-nowrap text-muted hover:bg-raised hover:text-ink drawer:gap-1 drawer:p-2 phone:grid phone:justify-items-center phone:gap-[3px] phone:px-1.5 phone:py-[5px] phone:text-[11px] tiny:px-[3px] [&[aria-current=page]:not(:hover)]:bg-soft [&[aria-current=page]:not(:hover)]:text-soft-ink"
          >
            <Icon name={icon} className="svg-icon size-4 drawer:size-3.5" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="mr-[25px] flex items-center gap-[9px] drawer:mr-[11px] drawer:gap-1.5 tiny:mr-[7px] tiny:gap-1">
        <ThemeToggle />
        <SaveStatus />
      </div>
    </header>
  );
}
