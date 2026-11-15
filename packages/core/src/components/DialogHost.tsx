import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Dialog } from "@base-ui/react/dialog";
import { cva } from "class-variance-authority";
import { useRef, useState } from "react";
import { DialogBody } from "./dialog";
import { screens, type DialogScreen } from "./screen-list";
import { IconButton } from "./ui";
import { useUi } from "../store/ui";

const backdrop =
  "fixed inset-0 z-50 bg-backdrop transition-opacity duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none";

const popup = cva(
  "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-30px)] -translate-1/2 flex-col rounded-card border border-control-line bg-surface p-5 text-ink shadow-[0_18px_85px_var(--shadow)] outline-hidden transition-[opacity,scale] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none",
  {
    variants: { size: { default: "w-[min(530px,calc(100%-26px))]", wide: "w-[min(720px,calc(100%-26px))]" } },
    defaultVariants: { size: "default" },
  },
);

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
        // With no animation to wait for (jsdom, and reduced motion, where the transition is off) Base UI reports the close just before it unmounts
        // the dialog and lets screen readers back into the page; one task later they are. DialogHost.test.tsx holds this.
        setTimeout(afterClose.run, 0);
      }}
    >
      {shown && screen && (
        <Dialog.Portal>
          <Dialog.Backdrop className={backdrop} />
          <Dialog.Popup ref={popupRef} className={popup({ size: screen.size })} initialFocus={() => firstField(popupRef.current) ?? true}>
            <Dialog.Title className="pr-11 font-display text-[25px] leading-[1.2] font-bold tracking-[-0.015em]">{screen.title(shown)}</Dialog.Title>
            <div className="absolute top-3 right-3.25">
              <IconButton label="Close dialog" icon="x" onClick={closeDialog} />
            </div>
            <DialogBody>
              <screen.Body key={last?.key} dialog={shown} />
            </DialogBody>
          </Dialog.Popup>
        </Dialog.Portal>
      )}
    </Root>
  );
}

/**
 * The one dialog for the whole app. Its content is a screen from screen-list.ts, chosen by the UI store. A modal dialog: focus stays
 * inside, Escape closes it and focus goes back to what opened it.
 */
export function DialogHost() {
  return (
    <>
      <Frame alert={false} />
      <Frame alert />
    </>
  );
}
