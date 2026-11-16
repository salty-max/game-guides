import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { cva } from "class-variance-authority";
import type { MouseEvent } from "react";
import { Link, useLocation } from "react-router";
import { Icon } from "./Icon";
import { press } from "./press-style";

const pages = [
  ["guide", "Guide", "book"],
  ["checklist", "Checklist", "checkList"],
  ["dashboard", "Progress", "chart"],
] as const;

// Where the three pages are: in the top bar from 551px up, and in a bar across the bottom on a phone (Layout picks one, so there is only
// ever one main navigation). The bottom bar is in the page's flow, pinned to the bottom of the screen as the top bar is to the top; in the
// installed app it is the last row of the fixed frame. It is --tabs tall, edge and all, so what keeps clear of it keeps clear of exactly
// that much; its own padding covers the home indicator, and it goes while a field you type in
// has the focus on a touch screen, since the keyboard covers it anyway.
const root = cva("", {
  variants: {
    place: {
      top: "ml-[-42px] justify-self-center drawer:ml-0",
      bottom:
        "sticky bottom-0 z-10 h-(--tabs) border-t border-line bg-surface pr-(--safe-right) pb-(--safe-bottom) pl-(--safe-left) text-ink pointer-coarse:in-[body:has(input:not([type=checkbox],[type=radio]):focus)]:hidden standalone:relative standalone:flex-none standalone:select-none standalone:[-webkit-touch-callout:none]",
    },
  },
});

const list = cva("", { variants: { place: { top: "flex gap-2 drawer:gap-0.5", bottom: "grid h-full grid-cols-3" } } });

// The page the reader is on: a tint behind its words in the top bar, and behind its icon in the bottom bar, in the guide's own button
// corners. A press tints the whole cell.
const link = cva(`${press} group/page font-bold whitespace-nowrap text-muted`, {
  variants: {
    place: {
      top: "flex min-h-10 items-center gap-2 rounded-button px-3.5 py-2.5 text-[14px] leading-[1.2] hover:bg-raised hover:text-ink drawer:gap-1 drawer:p-2 [&[aria-current=page]:not(:hover)]:bg-soft [&[aria-current=page]:not(:hover)]:text-soft-ink",
      bottom: "grid h-full content-center justify-items-center gap-[3px] text-[11px] leading-none aria-[current=page]:text-soft-ink",
    },
  },
});

const icon = cva("", {
  variants: {
    place: {
      top: "size-4 drawer:size-3.5",
      bottom: "box-content size-[22px] rounded-button px-4 py-[3px] group-aria-[current=page]/page:bg-soft",
    },
  },
});

/** A press on the bottom bar's link to the page you're on: back to that page's top, and nowhere else. */
function scrollUp(event: MouseEvent<HTMLAnchorElement>) {
  // A new tab or window (a modifier, or not the main button) is the browser's business.
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  // In the installed app the main area scrolls, not the page.
  window.scrollTo({ top: 0, behavior });
  document.getElementById("main")?.scrollTo({ top: 0, behavior });
}

interface MainNavProps {
  /** The chapter the Guide link opens. */
  chapter: number;
  /** Which page the reader is on, for the link that says so. */
  view: string;
  place: "top" | "bottom";
}

/** Guide, Checklist and Progress: Base UI's navigation menu, its links the router's. The current page is marked for a screen reader too. */
export function MainNav({ chapter, view, place }: MainNavProps) {
  const { pathname } = useLocation();
  return (
    <NavigationMenu.Root className={root({ place })} aria-label="Main navigation">
      <NavigationMenu.List className={list({ place })}>
        {pages.map(([id, label, name]) => {
          const to = id === "guide" ? `/guide/${chapter}` : `/${id}`;
          return (
            <NavigationMenu.Item key={id}>
              <NavigationMenu.Link
                active={view === id}
                className={link({ place })}
                // A tap on the tab of the page you're on takes you to its top, as a phone's tab bar does.
                onClick={place === "bottom" && to === pathname ? scrollUp : undefined}
                render={<Link to={to} />}
              >
                <Icon name={name} className={icon({ place })} />
                {label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
