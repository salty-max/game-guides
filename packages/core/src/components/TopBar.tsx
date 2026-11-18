import { Button as BaseButton } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import type { RefObject } from "react";
import { Link } from "react-router";
import iconUrl from "virtual:icon-urls";
import { MainNav } from "./MainNav";
import { IconButton } from "./ui";
import { brand } from "../guide";
import { tileSizes, tileSrc, tileSrcSet } from "../icons";
import { useProgress } from "../store/progress";
import { useTheme } from "../store/theme";
import { useSyncStatus, type SyncPhase } from "../store/sync";
import { useUi } from "../store/ui";
import { usePhone } from "../useNarrow";
import { useResolvedTheme } from "../useThemeEffects";
import { pressClasses } from "./press-style";

function ThemeToggle() {
  const dark = useResolvedTheme() === "dark";
  const setPreference = useTheme((s) => s.setPreference);
  const announce = useUi((s) => s.announce);
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  return (
    <IconButton
      icon={dark ? "sun" : "moon"}
      label={label}
      tooltip
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
  // The words are drawn joined by a dot and named joined by a full stop, so the name always carries what is shown.
  const words = error ? ["Storage unavailable"] : phase === "off" ? ["Progress saved"] : ["Progress saved", syncWords[phase]];
  // One destination in every state: the Sync screen, linked or not, which also carries the storage warning. The guide's settings are the
  // chapters menu's "Change settings" (the rail beside the page on a wide screen) and the Progress page's Import progress.
  return (
    <BaseButton
      className={`${pressClasses} flex min-h-10 items-center gap-2 rounded-control border border-control-line bg-transparent px-3 py-1.5 text-12 font-bold whitespace-nowrap text-muted hover:bg-raised drawer:h-(--icon-h,2.5rem) drawer:w-(--icon-w,2.5rem) drawer:justify-center drawer:gap-0 drawer:p-0 drawer:text-[0px]`}
      data-error={error || ["offline", "paused", "error"].includes(phase) ? "" : undefined}
      aria-label={`${words.join(". ")}. Open sync devices`}
      onClick={() => openDialog({ kind: "sync" })}
    >
      <span className="block size-2 rounded-full bg-ok shadow-[0_0_0_3px_color-mix(in_srgb,var(--ok)_15%,transparent)] in-data-error:bg-warn" />
      {words.join(" · ")}
    </BaseButton>
  );
}

// The brand is the part of the bar that gives way: when the pages and the buttons leave it less than its width, at any screen or text size,
// its name ellipsizes. With no room left for a few letters of it, the name wraps to a second line, which the link's height (the tile's)
// clips: the tile shows alone rather than a cut letter. Clipped, not hidden, so find in page can't scroll the link to the name. Under 361px
// only the tile shows.
const brandLink = cva(
  `${pressClasses} flex h-10 min-w-0 flex-wrap content-start items-center gap-x-3 overflow-clip px-6 mid:pl-4 drawer:h-8.5 drawer:gap-x-2 drawer:px-2`,
);

// The guide's painting, its square the dark surface: a hairline in the guide's line keeps the cornered tile on a dark bar.
// (an outline inset over the edge, not a border, so the painting draws at the size it was written for)
const brandTile = cva("size-10 shrink-0 rounded-control outline-1 -outline-offset-1 outline-line drawer:size-8.5");

interface TopBarProps {
  /** The chapter the Guide link opens. */
  chapter: number;
  /** Which page the reader is on, for the link that says so. */
  view: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  menuToggle: RefObject<HTMLButtonElement | null>;
}

/**
 * The bar across the top: the chapters menu (800px and under), the brand, the three pages, and the theme and save buttons. On a phone it is a
 * title bar: the pages are in the tab bar at the bottom (Layout), and the theme toggle stays, one press away as on a wider screen.
 */
export function TopBar({ chapter, view, menuOpen, onToggleMenu, menuToggle }: TopBarProps) {
  const phone = usePhone();
  return (
    // The bar runs across the screen; what's in it sits on the frame the rail and the page share (--frame-max, Layout), centred the same
    // way, so on a wide screen the brand stays over the rail and the buttons end over the page's edge.
    <header className="sticky top-0 z-10 h-(--bar) border-b border-line bg-surface pt-(--safe-top) pr-(--safe-right) pl-(--safe-left) text-ink standalone:relative standalone:flex-none standalone:select-none standalone:[-webkit-touch-callout:none] phone:[--icon-h:2.75rem] phone:[--icon-w:2.75rem]">
      {/* Beside the rail the brand's columns come to the rail's width or the brand's, whichever is wider, so the pages start over the page
          when there's room. The pages and the buttons share the last column, `1fr`, whose minimum is the pages' words (their icons wrap
          away first, MainNav) and the buttons, so the pages never shrink past their words: the brand's columns give way. That column gets
          anything over its minimum only after the brand has all its width. */}
      <div className="mx-auto grid h-full max-w-(--frame-max) grid-cols-[minmax(0,var(--rail-w))_minmax(0,auto)_1fr] items-center drawer:grid-cols-[auto_minmax(0,auto)_1fr] phone:grid-cols-[auto_minmax(0,1fr)_auto]">
        {/* Shown only under 800px: `hidden` is the class's own, and `drawer:block` brings it back. */}
        <div className="ml-3 hidden drawer:block tiny:ml-2">
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
        {/* Beside the rail the brand spans the rail's column and one that fits whatever of the brand runs past it. */}
        <div className="col-span-2 flex min-w-0 items-center drawer:col-span-1">
          <Link
            className={brandLink()}
            to={`/guide/${chapter}`}
            aria-label={`${brand.name} home`}
          >
            {/* The guide's own painting, as the home screen shows it (pnpm icons writes the sizes). The link carries the name. */}
            <img src={iconUrl(tileSrc(tileSizes[0]))} srcSet={tileSrcSet(iconUrl)} alt="" width={40} height={40} className={brandTile()} />
            {/* (wraps away, rather than ellipsizing, when there isn't room for 5ch of the body text, or all of the name if it's shorter; then grows to all of it) */}
            <span className="grid max-w-max min-w-0 grow basis-[5ch] gap-1 leading-[1.1] tiny:hidden">
              <strong className="truncate font-display text-21 leading-[1.05] font-bold tracking-[-0.01em] drawer:text-17">{brand.mark}</strong>
              {/* The space isn't drawn (it's a grid), but without it the link's visible text reads "KoholintHundo", which its name, "Koholint Hundo home", doesn't contain. */}
              {" "}
              <small className="text-11 font-extrabold tracking-[0.2em] text-primary uppercase drawer:hidden">Hundo</small>
            </span>
          </Link>
        </div>
        {/* The pages and the buttons. Beside the rail the pages sit between two equal sides, the buttons at the end of the second (the
            `before:` is the first), so with room on both sides they're centred over the page's column (over what's right of the brand,
            where a long name runs past the rail). The buttons' side is never narrower than the buttons, so with less room the pages move
            towards the brand rather than over the buttons. This is a grid of its own so that the brand's columns still fill first: the
            pages' icons and the centring only get what the brand leaves. Under 800px there's no rail to line up with, and the pages are
            centred in what the brand and the buttons leave. */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center before:content-[''] drawer:grid-cols-[1fr_auto] drawer:before:hidden phone:flex">
          {!phone && <MainNav chapter={chapter} view={view} place="top" />}
          <div className="mr-6 flex items-center gap-2 justify-self-end drawer:mr-3 drawer:gap-1.5 tiny:mr-2 tiny:gap-1">
            <ThemeToggle />
            <SaveStatus />
          </div>
        </div>
      </div>
    </header>
  );
}
