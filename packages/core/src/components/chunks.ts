import { loadable } from "../loadable";
import { useUi } from "../store/ui";

/**
 * The parts of core that load on use, each a chunk of its own. Base UI's popups (a dialog, a select's list) and the floating-ui code
 * under them are most of what it weighs, and a page can be read without any of them. Each has a shell the page imports, which loads the
 * chunk behind it: DialogHost for the dialogs, Select for the select, ToastHost for the toasts. Nothing else may import the modules behind them (a static import
 * from the page's own code puts them back in the first download). Tests and stories load these first (test/setup.ts, preview.tsx) so
 * that what they render is the real thing, not the stand-in.
 */
export const chunks = {
  /** Both dialogs, and every screen they can show. */
  dialog: loadable(() => import("./DialogFrames")),
  /** The select's trigger and list. */
  select: loadable(() => import("./select-impl")),
  /** The toasts: an undo, a sync note, a load failure, the service worker's news. */
  toasts: loadable(() => import("./Toasts")),
};

/**
 * Tells the reader that something they asked for couldn't be fetched. Online, the likelier cause is that a newer version of the guide
 * has replaced the file the page was built to ask for, so the advice is to reload; offline, it's the connection.
 */
export const loadFailed = () =>
  useUi
    .getState()
    .showToast(navigator.onLine ? "Couldn't open that. Reload the page to get the latest version." : "Couldn't open that. Check your connection and try again.");
