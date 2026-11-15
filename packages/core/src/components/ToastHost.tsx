import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { chunks } from "./chunks";
import { useLoadable, whenIdle } from "../loadable";
import { useUi } from "../store/ui";

/**
 * The toasts' shell, on every page: the toasts themselves (Toasts.tsx, Base UI's toast) are a chunk of their own, fetched once the page is
 * idle, or as soon as there is something to say. What there is to say comes from the store (an undo, a sync note, a load
 * failure) and from the service worker, which this registers when the app starts, so it has to stay in the first download.
 */
export function ToastHost() {
  const toast = useUi((s) => s.toast);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  const update = needRefresh ? "refresh" : offlineReady ? "offline" : null;
  const loaded = useLoadable(chunks.toasts, false);
  useEffect(() => whenIdle(chunks.toasts.warm), []);
  // Each toast asks for the chunk until it's there. One that can't be shown (no chunk, no connection) is said in the page's status
  // region, so a screen reader still hears it, and cleared: it is the toast's own close that clears it otherwise, and that never comes.
  useEffect(() => {
    if (!toast || loaded) return;
    chunks.toasts.load().catch(() => {
      const ui = useUi.getState();
      ui.announce(toast.message);
      ui.dismissToast(toast.id);
    });
  }, [toast, loaded]);
  useEffect(() => {
    if (update && !loaded) chunks.toasts.warm();
  }, [update, loaded]);
  if (!loaded) return null;
  return (
    <loaded.Toasts
      toast={toast}
      update={update}
      reload={() => void updateServiceWorker(true)}
      dismissUpdate={() => {
        setOfflineReady(false);
        setNeedRefresh(false);
      }}
    />
  );
}
