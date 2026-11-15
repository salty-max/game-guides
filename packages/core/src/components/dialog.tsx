import { Dialog } from "@base-ui/react/dialog";
import { Separator } from "@base-ui/react/separator";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

// The parts a dialog screen is made of. The host (DialogHost.tsx) supplies the frame, the title and the close button; a screen
// (screens.tsx) supplies its body from these. Like Button, none of them takes a className or a style.

const text = cva("my-2.5", {
  variants: { size: { default: "text-sm", small: "text-[13px]" }, tone: { quiet: "text-muted", error: "text-error" } },
});

const status = cva("my-2.5 min-h-5 text-sm", { variants: { tone: { quiet: "text-muted", error: "text-error" } } });

/** The middle of a dialog: a tall screen scrolls here, so the title and the close button stay in view on a phone. */
export function DialogBody({ children }: { children: ReactNode }) {
  return <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>;
}

/** A row of actions at the end of a section. */
export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="mt-2 flex flex-wrap gap-1.75">{children}</div>;
}

/** A paragraph. `small` is for the fine print, `error` for a problem that isn't tied to a field. */
export function DialogText({ children, small = false, error = false }: { children: ReactNode; small?: boolean; error?: boolean }) {
  return <p className={text({ size: small ? "small" : "default", tone: error ? "error" : "quiet" })}>{children}</p>;
}

/** The paragraph that says what the dialog is about: the dialog is described by it for screen readers. */
export function DialogDescription({ children }: { children: ReactNode }) {
  return <Dialog.Description className={text({ size: "default", tone: "quiet" })}>{children}</Dialog.Description>;
}

/**
 * A polite live region inside the dialog, for what happens in it: "Code expired", "Linked". Everything behind a modal dialog is hidden
 * from screen readers, so the page's own announcer can't be heard while one is open; announce here instead. It has to be on the screen
 * before its text changes, so render it always and put the message in its children.
 */
export function DialogStatus({ children, error = false }: { children?: ReactNode; error?: boolean }) {
  return (
    <p role="status" className={status({ tone: error ? "error" : "quiet" })}>
      {children}
    </p>
  );
}

export function DialogSeparator() {
  return <Separator className="my-4 h-px bg-line" />;
}
