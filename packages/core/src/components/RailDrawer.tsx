import { Drawer } from "@base-ui/react/drawer";
import { useRef } from "react";
import { RailContent } from "./Rail";
import { railHeading, railPanel } from "./rail-style";
import { IconButton } from "./ui";
import { lastInput } from "../lastInput";

// Base UI's drawer layers. The viewport covers the whole screen, the top bar included, and takes no touch: a finger on the dimmed page
// or on the bar can't drag anything behind it (the installed app's page can't be scroll-locked, see DialogFrames.tsx), and a tap there
// is a press outside the drawer, which closes it, so the bar's menu button still reads as a toggle. The backdrop and the drawer start
// under the bar, which stays as it is. The backdrop is placed the way the dialog's is (DialogFrames.tsx): against the screen in a browser
// tab, against the fixed body in the installed app on iOS.
const backdrop =
  "fixed inset-x-0 top-(--bar) bottom-0 z-20 bg-backdrop opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-200 standalone:supports-[-webkit-touch-callout:none]:absolute data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 motion-reduce:transition-none";

const viewport = "fixed inset-0 z-20 touch-none";

// The drawer scrolls on its own (a finger's touch-action is decided where something scrolls). It follows the finger as it's swiped shut to
// the left: Base UI moves it itself while the finger is down, and leaves where it got to in --drawer-swipe-movement-x for the release, so
// the slide out (or back, for a swipe too short to close it) starts from there. This is the pattern of Base UI's own drawer page.
const popup =
  "absolute top-(--bar) bottom-0 left-0 w-[min(var(--rail-col),calc(100%-30px))] [transform:translateX(var(--drawer-swipe-movement-x,0px))] scrollbar-thin [scrollbar-color:var(--edge)_var(--rail)] overflow-y-auto border-r border-line bg-rail touch-auto overscroll-contain outline-none transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:[transform:translateX(-100%)] data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*200ms)] data-starting-style:[transform:translateX(-100%)] data-swiping:duration-0 data-swiping:select-none motion-reduce:transition-none";

interface RailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeChapter: number;
  view: string;
  /** Where the focus goes when the drawer closes; false leaves it where it is (Layout moves it to the page when a link was followed). */
  returnFocus: () => HTMLElement | false;
  /** A link in the drawer was followed (and the drawer is closing for it). */
  onFollowLink: () => void;
}

/**
 * The chapter rail under 800px: Base UI's drawer from the left edge, for Layout to load once the page is idle or the menu is first opened
 * (chunks.ts). A modal: the focus stays inside, Escape, a press outside, the close button and a swipe to the left close it. There's no
 * swipe to open it from the edge, which the installed app on iOS keeps for going back.
 */
export function RailDrawer({ open, onOpenChange, activeChapter, view, returnFocus, onFollowLink }: RailDrawerProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="left">
      <Drawer.Portal>
        <Drawer.Backdrop className={backdrop} />
        <Drawer.Viewport className={viewport}>
          <Drawer.Popup
            ref={popupRef}
            id="chapter-rail"
            className={popup}
            initialFocus={() => {
              const rail = popupRef.current;
              // Opened by a touch, the drawer itself takes the focus (it is named), not a link round which nobody pressed (see DialogFrames).
              if (lastInput() === "touch") return rail ?? true;
              return rail?.querySelector<HTMLElement>('[aria-current="page"]') ?? rail?.querySelector<HTMLElement>("nav a, nav button") ?? true;
            }}
            finalFocus={returnFocus}
          >
            <Drawer.Content
              className={railPanel({ frame: "drawer" })}
              // A chapter followed from the drawer closes it, the current one too (its address doesn't change, so Layout wouldn't).
              onClick={(event) => {
                if (!(event.target instanceof Element && event.target.closest("a"))) return;
                onFollowLink();
                onOpenChange(false);
              }}
            >
              {/* Named "Chapters", as the menu button and the column it stands for are. */}
              <Drawer.Title className="sr-only">Chapters</Drawer.Title>
              <RailContent
                activeChapter={activeChapter}
                view={view}
                heading={
                  <div className="-mt-2.5 mb-1 flex items-center justify-between">
                    <div className={railHeading}>Walkthrough</div>
                    <Drawer.Close render={<IconButton label="Close chapters" icon="x" />} />
                  </div>
                }
              />
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
