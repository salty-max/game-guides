import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Dialog } from "@base-ui/react/dialog";
import { cva } from "class-variance-authority";
import { useRef, useState } from "react";
import { DialogBody } from "./dialog";
import { screens, type DialogScreen } from "./screen-list";
import { IconButton } from "./ui";
import { lastInput } from "../lastInput";
import { useUi } from "../store/ui";

// Base UI's own dialog layers (the "inside scroll" pattern in https://base-ui.com/react/components/dialog): a backdrop, a viewport that
// positions the popup, and a popup whose body scrolls inside it. That page makes the backdrop absolute where `@supports (-webkit-touch-callout: none)`
// holds (iOS), for iOS 26 and later, where a fixed backdrop doesn't cover everything the reader can see. Here that is for the installed
// app only (`standalone:`), where `body` is fixed and is what the backdrop is placed against. In a browser tab `body` isn't positioned, so an
// absolute backdrop is probably placed at the top of the document and scrolled out of sight: a tab on an iPhone (iOS 18.7) showed no dim at
// all, though the iOS 27.2 Simulator dimmed the same tab, so the cause isn't settled.
// (Tailwind reads class names out of comments too: don't write the utility's own name here.)
const backdrop =
  "fixed inset-0 z-50 min-h-dvh bg-backdrop transition-opacity duration-100 standalone:supports-[-webkit-touch-callout:none]:absolute data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none";

// The viewport is the part of the screen the reader can see: --vv-top and --vv-height are the visual viewport's (followVisualViewport),
// which an on-screen keyboard shrinks, and fall back to the layout viewport where there is no visual viewport to ask. The notch and the
// home indicator are its padding. `touch-none` keeps a finger on the dimmed page, or on the dialog's frame, from dragging anything: the
// body scrolls on its own (touch-action stops at an element that scrolls), and the page behind is inert.
const viewport =
  "fixed top-[var(--vv-top,0px)] left-0 z-50 flex h-[var(--vv-height,100dvh)] w-full touch-none items-center justify-center overflow-hidden pt-[calc(1rem+var(--safe-top))] pr-[calc(0.75rem+var(--safe-right))] pb-[calc(1rem+var(--safe-bottom))] pl-[calc(0.75rem+var(--safe-left))]";

const popup = cva(
  "relative flex max-h-full min-h-0 w-full flex-col rounded-card border border-control-line bg-surface p-5 text-ink shadow-[0_18px_85px_var(--shadow)] outline-hidden transition-[opacity,scale] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none",
  {
    variants: { size: { default: "max-w-132.5", wide: "max-w-180" } },
    defaultVariants: { size: "default" },
  },
);

/** A field you type in: the one place where focus on a touch screen is wanted, because it brings the keyboard up. */
const takesText = (el: HTMLElement) => el.matches("input:not([type=checkbox], [type=radio], [type=file], [type=button], [type=submit]), textarea");

/**
 * What the visual viewport is, kept in --vv-top and --vv-height on the dialog's viewport layer (a ref callback: the layer is in a portal and
 * mounts a moment after the dialog is asked for). The layout viewport doesn't change when the on-screen
 * keyboard opens (on iOS it stays the size of the screen), so a dialog centred in it would be half behind the keyboard; the visual
 * viewport is the part the reader can actually see, and it shrinks.
 */
function followVisualViewport(layer: HTMLElement | null) {
  const visual = window.visualViewport;
  if (!layer || !visual) return;
  const sync = () => {
    layer.style.setProperty("--vv-top", `${visual.offsetTop}px`);
    layer.style.setProperty("--vv-height", `${visual.height}px`);
  };
  sync();
  visual.addEventListener("resize", sync);
  visual.addEventListener("scroll", sync);
  return () => {
    visual.removeEventListener("resize", sync);
    visual.removeEventListener("scroll", sync);
  };
}

/**
 * Where the focus goes when a screen opens: the element the screen marks with data-autofocus, else the first field. A radio's hidden
 * input is aria-hidden and the radio itself is the field, so only the chosen radio counts; the unchosen ones aren't a place to land.
 */
const firstField = (root: HTMLElement | null): HTMLElement | null =>
  root?.querySelector<HTMLElement>("[data-autofocus]") ??
  root?.querySelector<HTMLElement>(
    "[role=radio][aria-checked=true], select:not(:disabled), input:not([type=hidden]):not([aria-hidden=true]):not(:disabled), [role=combobox]:not([aria-disabled=true])",
  ) ??
  null;

/**
 * One frame, for one kind of dialog. An alert dialog (a question that needs an answer, not dismissed by a click outside) and a plain
 * one are different Base UI roots, so each has its own frame, and both stay mounted: a root that mounts already open doesn't animate.
 */
function Frame({ alert }: { alert: boolean }) {
  const dialog = useUi((s) => s.dialog);
  const closeDialog = useUi((s) => s.closeDialog);
  const key = useUi((s) => s.dialogKey);
  const popupRef = useRef<HTMLDivElement>(null);
  const mine = dialog && Boolean(screens[dialog.kind].alert) === alert ? dialog : null;
  // The store clears the screen the moment the dialog closes; keep showing it while the dialog fades out. Each opening has its own key,
  // so a screen opened again during the fade starts afresh instead of inheriting the last one's state.
  const [last, setLast] = useState(mine && { dialog: mine, key });
  if (mine && key !== last?.key) setLast({ dialog: mine, key });

  const shown = last?.dialog;
  const screen = shown ? (screens[shown.kind] as DialogScreen<typeof shown>) : null;
  const Root = alert ? AlertDialog.Root : Dialog.Root;
  return (
    <Root
      open={mine !== null}
      onOpenChange={(open) => {
        if (!open) closeDialog();
      }}
      onOpenChangeComplete={(open) => {
        // Only the close of the dialog the action was set for runs it: the other frame may be closing from an earlier dialog.
        const { afterClose } = useUi.getState();
        if (open || !afterClose || afterClose.key !== last?.key) return;
        useUi.setState({ afterClose: null });
        // With no animation to wait for (jsdom, and reduced motion, where nothing animates) Base UI reports the close just before it unmounts
        // the dialog and lets screen readers back into the page; one task later they are. DialogHost.test.tsx holds this.
        setTimeout(afterClose.run, 0);
      }}
    >
      {shown && screen && (
        <Dialog.Portal>
          <Dialog.Backdrop className={backdrop} />
          <Dialog.Viewport ref={followVisualViewport} className={viewport}>
            <Dialog.Popup
              ref={popupRef}
              className={popup({ size: screen.size })}
              initialFocus={() => {
                const field = firstField(popupRef.current);
                // Opened by a touch: a button or a radio taking the focus would show the focus mark a keyboard user needs, round something nobody
                // pressed. The dialog takes it instead (it is named, and a screen reader says so), except for a field you type in.
                return field && lastInput() === "touch" && !takesText(field) ? (popupRef.current ?? true) : (field ?? true);
              }}
            >
              <Dialog.Title className="pr-11 font-display text-25 leading-[1.2] font-bold tracking-[-0.015em]">{screen.title(shown)}</Dialog.Title>
              <div className="absolute top-3 right-3">
                <IconButton label="Close dialog" icon="x" onClick={closeDialog} />
              </div>
              <DialogBody>
                <screen.Body key={last?.key} dialog={shown} />
              </DialogBody>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      )}
    </Root>
  );
}

/**
 * The dialog itself, for DialogHost to load once the page is idle or a dialog is first asked for (chunks.ts). Its content is a screen
 * from screen-list.ts, chosen by the UI store. A modal dialog: focus stays inside, Escape closes it and focus goes back to what opened it.
 */
export function DialogFrames() {
  return (
    <>
      <Frame alert={false} />
      <Frame alert />
    </>
  );
}
