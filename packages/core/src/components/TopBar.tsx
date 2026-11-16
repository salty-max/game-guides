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
import { press } from "./press-style";

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
  const linked = phase !== "off";
  const word = linked && !error ? syncWords[phase] : "";
  // A linked device opens the Sync screen from here, where the settings are one button away; one that isn't opens the settings as before.
  return (
    <BaseButton
      className={`${press} flex min-h-10 items-center gap-2 rounded-control border border-control-line bg-transparent px-3 py-1.5 text-[12px] font-bold whitespace-nowrap text-muted hover:bg-raised drawer:h-(--icon-h,2.5rem) drawer:w-(--icon-w,2.5rem) drawer:justify-center drawer:gap-0 drawer:p-0 drawer:text-[0px]`}
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
    </BaseButton>
  );
}

// On a phone the brand gives way: its name ellipsizes before the buttons beside it move, and under 361px only the tile shows.
const brandLink = cva(`${press} flex w-max shrink-0 items-center gap-[11px] px-6 mid:pl-[17px] drawer:gap-[7px] drawer:px-2.5 phone:w-auto phone:min-w-0 phone:shrink`);

// The guide's painting, its square the dark surface: a hairline in the guide's line keeps the cornered tile on a dark bar.
// (an outline inset over the edge, not a border, so the painting draws at the size it was written for)
const brandTile = cva("size-10 shrink-0 rounded-control outline-1 -outline-offset-1 outline-line drawer:size-[34px]");

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
    <header className="sticky top-0 z-10 grid h-(--bar) grid-cols-[var(--rail-w)_1fr_auto] items-center border-b border-line bg-surface pt-(--safe-top) pr-(--safe-right) pl-(--safe-left) text-ink standalone:relative standalone:flex-none standalone:select-none standalone:[-webkit-touch-callout:none] drawer:grid-cols-[auto_auto_1fr_auto] phone:grid-cols-[auto_minmax(0,1fr)_auto] phone:[--icon-h:2.75rem] phone:[--icon-w:2.75rem]">
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
      <div className="flex min-w-0 items-center">
        <Link
          className={brandLink()}
          to={`/guide/${chapter}`}
          aria-label={`${brand.name} home`}
        >
          {/* The guide's own painting, as the home screen shows it (pnpm icons writes the sizes). The link carries the name. */}
          <img src={iconUrl(tileSrc(tileSizes[0]))} srcSet={tileSrcSet(iconUrl)} alt="" width={40} height={40} className={brandTile()} />
          <span className="grid min-w-0 gap-[3px] leading-[1.1] tiny:hidden">
            <strong className="truncate font-display text-[21px] leading-[1.05] font-bold tracking-[-0.01em] drawer:text-[17px]">{brand.mark}</strong>
            {/* The space isn't drawn (it's a grid), but without it the link's visible text reads "KoholintHundo", which its name, "Koholint Hundo home", doesn't contain. */}
            {" "}
            <small className="text-[11px] font-extrabold tracking-[0.2em] text-primary uppercase drawer:hidden">Hundo</small>
          </span>
        </Link>
      </div>
      {!phone && <MainNav chapter={chapter} view={view} place="top" />}
      <div className="mr-[25px] flex items-center gap-[9px] drawer:mr-[11px] drawer:gap-1.5 tiny:mr-[7px] tiny:gap-1">
        <ThemeToggle />
        <SaveStatus />
      </div>
    </header>
  );
}
