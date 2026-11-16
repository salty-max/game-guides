import { useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { chunks } from "./chunks";
import { useLoadable, whenIdle } from "../loadable";
import { useUi } from "../store/ui";
import { settleUpdate, watchForUpdates } from "../sw-updates";

/**
 * The toasts' shell, on every page: the toasts themselves (Toasts.tsx, Base UI's toast) are a chunk of their own, fetched once the page is
 * idle, or as soon as there is something to say. What there is to say comes from the store (an undo, a sync note, a load
 * failure) and from the service worker, which this registers when the app starts, so it has to stay in the first download. A new build
 * found as the guide starts takes over without a word; only one found mid-session asks (sw-updates.ts).
 */
export function ToastHost() {
  const toast = useUi((s) => s.toast);
  // The registration's callbacks are the first render's, and the worker answers long after it: they reach the hook's own update through a ref.
  const takeOver = useRef<() => void>(undefined);
  const [asked, setAsked] = useState(false);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW: (_url, registration) => {
      if (registration) watchForUpdates(registration);
    },
    onNeedRefresh: () =>
      settleUpdate(
        () => takeOver.current?.(),
        () => setAsked(true),
      ),
  });
  useEffect(() => {
    takeOver.current = () => void updateServiceWorker(true);
  }, [updateServiceWorker]);
  const update = needRefresh && asked ? "refresh" : offlineReady ? "offline" : null;
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
        setAsked(false);
      }}
    />
  );
}
