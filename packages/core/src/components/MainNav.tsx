import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { cva } from "class-variance-authority";
import { useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router";
import { Icon } from "./Icon";
import { config } from "../guide";
import type { IconName } from "./Icon";
import { pages } from "../nav";
import { press, pressPart } from "./press-style";
import { placeOf, safePlace, tabPlaces } from "../store/place";
import { useProgress } from "../store/progress";

// Where the four pages are: in the top bar from 551px up, and in a bar across the bottom on a phone (Layout picks one, so there is only
// ever one main navigation). In a browser tab the bottom bar is fixed to the bottom of the screen, and Layout leaves --tabs of room under
// the page so its end scrolls clear of the bar; in the installed app it is the last row of the fixed frame. Fixed rather than sticky:
// a row passing under a sticky bar counts, for axe's target-size audit, as a target the bar's links cover, and a fixed one doesn't.
// It is --tabs tall, edge and all, so what keeps clear of it keeps clear of exactly that much; its own padding covers the home indicator,
// and it goes while a field you type in has the focus on a touch screen, since the keyboard covers it anyway.
const root = cva("", {
  variants: {
    place: {
      // Centred where TopBar puts it (over the page's column when there's room): its column is never narrower than it, margins included,
      // so a tight bar still keeps a gap on either side of the links.
      top: "mx-2 justify-self-center",
      bottom:
        "fixed inset-x-0 bottom-0 z-10 h-(--tabs) border-t border-line bg-surface pr-(--safe-right) pb-(--safe-bottom) pl-(--safe-left) text-ink pointer-coarse:in-[body:has(input:not([type=checkbox],[type=radio]):focus)]:hidden standalone:relative standalone:flex-none standalone:select-none standalone:[-webkit-touch-callout:none]",
    },
  },
});

const list = cva("", { variants: { place: { top: "flex gap-2 drawer:gap-0.5", bottom: "grid h-full grid-cols-4" } } });

// The page the reader is on: a tint behind its words in the top bar, and behind its icon in the bottom bar, in the guide's own button
// corners. A press tints the whole cell.
// In the top bar a link's icon gives way before anything else does. The link is one line as tall as itself (the `/10` line height on its
// text) that may wrap, laid out from its end (`flex-row-reverse`) with the icon ordered after the words, so the icon is what wraps, onto a
// second line that the link's height clips. Its narrowest is then its words alone, which is the least the pages' column takes (TopBar): the
// brand gets its whole width before the links get room for their icons, and with less than all four need, every link narrows a little and
// all four icons go together. So the icons show exactly when the bar has room for them, in every guide's fonts and at any text size, with
// no width named for it.
const link = cva(`${press} group/page font-bold whitespace-nowrap text-muted`, {
  variants: {
    place: {
      top: "flex h-10 flex-row-reverse flex-wrap content-start items-center justify-center gap-x-2 overflow-clip rounded-button px-3.5 text-[14px]/10 hover:bg-raised hover:text-ink drawer:gap-x-1 drawer:px-2 [&[aria-current=page]:not(:hover)]:bg-soft [&[aria-current=page]:not(:hover)]:text-soft-ink",
      bottom: "grid h-full content-center justify-items-center gap-[3px] text-[11px] leading-none aria-[current=page]:text-soft-ink",
    },
  },
});

const icon = cva("", {
  variants: {
    place: {
      // (after the words, so it is the part that wraps away: `link` above. The tab bar keeps its icons.)
      top: "order-1 size-4",
      bottom: `${pressPart} box-content size-[22px] rounded-button px-4 py-[3px] group-aria-[current=page]/page:bg-soft`,
    },
  },
});

// A new tab or window (a modifier, or not the main button) is the browser's business.
const elsewhere = (event: MouseEvent<HTMLAnchorElement>) => event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

/** A press on the bottom bar's link to the page you're on: back to that page's top, and nowhere else. */
function scrollUp(event: MouseEvent<HTMLAnchorElement>) {
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

// The installed app's shortcuts are the three pages of nav.ts; the bar has the guide's Questlines page too, named by the guide.
const [guidePage, checklistPage, dashboardPage] = pages;
const links: (readonly [id: string, label: string, icon: IconName])[] = [guidePage, checklistPage, ["questlines", config.questlines.tab, "scroll"], dashboardPage];

/** Guide, Checklist, Questlines and Progress: Base UI's navigation menu, its links the router's. The current page is marked for a screen reader too. */
export function MainNav({ chapter, view, place }: MainNavProps) {
  const { pathname, key } = useLocation();
  // The link pressed, marked at once: the router moves in a transition, which keeps the page and the address as they were until the new
  // page is drawn, and the bar would say nothing until then. Forgotten as the address moves (to that page, or anywhere else).
  const [pressed, setPressed] = useState<{ id: string; at: string } | null>(null);
  if (pressed && pressed.at !== key) setPressed(null);
  const current = pressed?.id ?? view;
  const data = useProgress((s) => s.data);
  // Each page's link goes back to it as the reader left it (store/place.ts): the checklist at its last address (a category, a chapter),
  // unless that chapter is hidden now, and every page at its scroll offset and with its filters.
  const checklist = view === "checklist" ? placeOf(pathname, chapter) : (safePlace(tabPlaces.checklist, data) ?? "/checklist");
  const targets: Record<string, string> = { guide: `/guide/${chapter}`, checklist, questlines: "/questlines", dashboard: "/dashboard" };
  return (
    <NavigationMenu.Root className={root({ place })} aria-label="Main navigation">
      <NavigationMenu.List className={list({ place })}>
        {links.map(([id, label, name]) => {
          const to = targets[id];
          return (
            <NavigationMenu.Item key={id}>
              <NavigationMenu.Link
                active={current === id}
                className={link({ place })}
                onClick={(event) => {
                  if (elsewhere(event)) return;
                  // A tap on the tab of the page you're on takes you to its top, as a phone's tab bar does.
                  if (place === "bottom" && to === pathname) scrollUp(event);
                  // (a press back on the page's own tab, while another is still on its way, unmarks that one)
                  else setPressed(id === view ? null : { id, at: key });
                }}
                render={<Link to={to} state={{ restore: true }} />}
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
