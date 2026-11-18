// A stand-in for vite-plugin-pwa's virtual:pwa-register/react, which only a guide's build has: a story that draws the whole frame (Layout,
// through ToastHost) gets a page with no service worker, nothing ready offline and no update waiting.
export function useRegisterSW() {
  return {
    offlineReady: [false, () => {}] as const,
    needRefresh: [false, () => {}] as const,
    updateServiceWorker: async () => {},
  };
}
