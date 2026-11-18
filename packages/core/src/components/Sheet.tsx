import { Drawer } from "@base-ui/react/drawer";
import { useRef, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { IconButton } from "./ui";
import { lastInput } from "../lastInput";
import { useBeforeBack } from "../beforeBack";

// Base UI's drawer layers, as in RailDrawer.tsx, from the bottom of the screen. The backdrop dims the whole screen, bars included, and is
// placed the way the dialog's is (DialogFrames.tsx): against the screen in a browser tab, against the fixed body in the installed app on
// iOS. The viewport takes no touch, so a finger on the dimmed page drags nothing behind it, and a tap there closes the sheet.
const backdrop =
  "fixed inset-0 z-50 min-h-dvh bg-backdrop opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-200 standalone:supports-[-webkit-touch-callout:none]:absolute data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 motion-reduce:transition-none";

const viewport = "fixed inset-0 z-50 touch-none";

// The sheet follows the finger as it's swiped down: Base UI moves it while the finger is down and leaves where it got to in
// --drawer-swipe-movement-y for the release (the pattern of Base UI's own drawer page). Its top corners are the guide's hero corners, and
// its foot clears the home indicator.
const popup =
  "absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-hero border-t border-control-line bg-surface pr-(--safe-right) pb-[calc(0.875rem+var(--safe-bottom))] pl-(--safe-left) text-ink shadow-[0_-12px_60px_var(--shadow)] outline-none [transform:translateY(var(--drawer-swipe-movement-y,0px))] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:[transform:translateY(100%)] data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*200ms)] data-starting-style:[transform:translateY(100%)] data-swiping:duration-0 data-swiping:select-none motion-reduce:transition-none";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The sheet's name, shown at its top and read out as it opens. */
  title: string;
  children: ReactNode;
  /** The buttons along its foot, which stay put while the rest scrolls. */
  footer?: ReactNode;
  /** Where the focus goes when it closes; false leaves it where it is. */
  returnFocus: () => HTMLElement | false;
}

/**
 * A sheet from the bottom of the screen: Base UI's drawer, for a page to load when it may be needed (chunks.ts). A modal: the focus stays
 * inside, and Escape, a press outside, its close button and a swipe down close it. The checklist's filters on a phone.
 */
export function Sheet({ open, onOpenChange, title, children, footer, returnFocus }: SheetProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const actions = useRef<Drawer.Root.Actions>(null);
  const leaving = useRef(false);
  // Back while it's open (the one way off a page past a modal sheet): gone at once, with no slide, while the page is still on screen. A
  // page kept out of sight (Pages) runs no transition and no effect, so a sheet closed later would slide away as the page comes back.
  useBeforeBack(() => {
    leaving.current = true;
    flushSync(() => actions.current?.close());
    flushSync(() => actions.current?.unmount());
    leaving.current = false;
  }, open);
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next, details) => {
        if (!next && leaving.current) details.preventUnmountOnClose();
        onOpenChange(next);
      }}
      actionsRef={actions}
      swipeDirection="down"
    >
      <Drawer.Portal>
        <Drawer.Backdrop className={backdrop} />
        <Drawer.Viewport className={viewport}>
          <Drawer.Popup
            ref={popupRef}
            className={popup}
            // Opened by a touch, the sheet itself takes the focus (it is named), not a control nobody pressed (see DialogFrames).
            initialFocus={() => (lastInput() === "touch" ? (popupRef.current ?? true) : true)}
            finalFocus={returnFocus}
          >
            {/* The handle says the sheet can be swiped; the close button is the way that doesn't need a swipe. */}
            <div aria-hidden="true" className="mx-auto mt-2 h-1.25 w-9 shrink-0 rounded-full bg-control-line" />
            <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-1">
              <Drawer.Title className="font-display text-22 leading-[1.2] font-bold tracking-[-0.015em]">{title}</Drawer.Title>
              <Drawer.Close render={<IconButton label="Close" icon="x" />} />
            </div>
            <Drawer.Content className="min-h-0 touch-auto overflow-y-auto overscroll-contain px-4 pt-2 pb-4">{children}</Drawer.Content>
            {footer && <div className="flex shrink-0 gap-2 border-t border-line px-4 pt-3 *:flex-1">{footer}</div>}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
