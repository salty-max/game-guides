import { Toast } from "@base-ui/react/toast";
import { useEffect, useRef } from "react";
import { buttonClass } from "./buttonStyle";
import { useUi, type Toast as StoreToast } from "../store/ui";

/** What the service worker has to say: a new version is waiting, or the guide has just become usable offline. */
export type UpdateNotice = "refresh" | "offline";

interface ToastsProps {
  /** The store's toast (an undo, a sync note, a load failure), or null. */
  toast: StoreToast | null;
  update: UpdateNotice | null;
  reload: () => void;
  dismissUpdate: () => void;
}

interface ToastData {
  undo?: () => void;
}

const updateWords: Record<UpdateNotice, string> = {
  refresh: "A new version of the guide is ready. Your progress is already saved.",
  offline: "The guide now works offline.",
};

// Bottom right, clear of the notch and the home indicator; the width of the screen on a phone. The toasts stack in the flow (there are
// two at most), so none of Base UI's overlapping-stack variables are used, only the swipe's.
const viewport =
  "pointer-events-none fixed right-[calc(16px+var(--safe-right))] bottom-[calc(16px+var(--safe-bottom))] z-40 grid max-w-[min(380px,calc(100%-32px))] gap-2.5 outline-none standalone:select-none standalone:[-webkit-touch-callout:none] phone:right-[calc(12px+var(--safe-right))] phone:bottom-[calc(12px+var(--safe-bottom))] phone:left-[calc(12px+var(--safe-left))] phone:max-w-none";

const root =
  "pointer-events-auto translate-x-(--toast-swipe-movement-x) translate-y-(--toast-swipe-movement-y) rounded-card border border-control-line bg-surface px-4 py-3.5 text-ink shadow-[0_12px_40px_var(--shadow)] transition-[opacity,translate] duration-200 data-ending-style:opacity-0 data-starting-style:translate-y-4 data-starting-style:opacity-0 data-swiping:transition-none motion-reduce:transition-none";

/**
 * The toasts, for ToastHost to load once the page is idle or a toast is first wanted (chunks.ts). The store and the service worker say
 * what to show; Base UI's toast manager shows it: it times the undo toast out (pausing while the reader's pointer or focus is on it, or
 * the window is hidden), lets a swipe or F6 reach it, and announces it.
 */
export function Toasts(props: ToastsProps) {
  return (
    <Toast.Provider>
      <Feed {...props} />
      <Toast.Portal>
        <Toast.Viewport className={viewport}>
          <List reload={props.reload} />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

/**
 * Hands the store's toast and the service worker's notice to the manager, and closes each when its source moves on. A close that the
 * manager makes (the timer, a button, a swipe) tells the source; a close made here doesn't, or a newer toast, or React's second run of
 * an effect in development, would clear what it replaced.
 */
function Feed({ toast, update, dismissUpdate }: ToastsProps) {
  const manager = Toast.useToastManager<ToastData>();
  const api = useRef(manager);
  const done = useRef(dismissUpdate);
  // Declared first, so they run first: the effects below use whatever the latest render passed.
  useEffect(() => {
    api.current = manager;
    done.current = dismissUpdate;
  });

  useEffect(() => {
    if (!toast) return;
    let ours = false;
    const id = api.current.add({
      type: "undo",
      title: toast.message,
      timeout: 8000,
      data: { undo: toast.undo },
      onClose: () => {
        if (!ours) useUi.getState().dismissToast(toast.id);
      },
    });
    return () => {
      ours = true;
      api.current.close(id);
    };
  }, [toast]);

  useEffect(() => {
    if (!update) return;
    let ours = false;
    const id = api.current.add({
      type: update,
      title: updateWords[update],
      timeout: 0,
      onClose: () => {
        if (!ours) done.current();
      },
    });
    return () => {
      ours = true;
      api.current.close(id);
    };
  }, [update]);

  return null;
}

function List({ reload }: { reload: () => void }) {
  const { toasts, close } = Toast.useToastManager<ToastData>();
  return toasts.map((toast) => {
    const undo = toast.data?.undo;
    return (
      <Toast.Root key={toast.id} toast={toast} className={root}>
        <Toast.Title render={<p />} className="mt-0 mb-2.5 text-[14px]" />
        <div className="flex flex-wrap gap-2">
          {undo && (
            <Toast.Action
              className={buttonClass("", "default")}
              onClick={() => {
                undo();
                close(toast.id);
              }}
            >
              Undo
            </Toast.Action>
          )}
          {toast.type === "refresh" && (
            <Toast.Action className={buttonClass("", "default")} onClick={reload}>
              Reload
            </Toast.Action>
          )}
          {/* Base UI hides its close button from screen readers until the toasts are hovered or focused, which suits an icon on a stacked
              toast; this one is a labelled button, and the offline notice's only one. */}
          <Toast.Close className={buttonClass("outline", "default")} aria-hidden={false}>{toast.type === "refresh" ? "Later" : toast.type === "offline" ? "Got it" : "Dismiss"}</Toast.Close>
        </div>
      </Toast.Root>
    );
  });
}
