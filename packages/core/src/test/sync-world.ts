import { vi } from "vitest";
import { KOHOLINT, World, type Device } from "../../../../services/sync/src/harness";
import { useProgress } from "../store/progress";
import { useSyncStatus } from "../store/sync";

/*
 * Browsers for the sync tests: each has its own storage, cookie jar and address, and talks to the real API handler on an in-memory store.
 * Only one is "entered" at a time, since the page code reads the one localStorage and document.cookie there is. The server's clock is
 * the page's, so fake timers move both together.
 */

export { KOHOLINT, World };

export function makeWorld() {
  const world = new World();
  Object.defineProperty(world.clock, "now", { get: () => Date.now(), set: () => {}, configurable: true });
  return world;
}

const LINK = "hundo_link";

export class Browser {
  readonly device: Device;
  private storage = new Map<string, string>();
  /** The calls the page made, as path and body. */
  calls: { path: string; body: Record<string, unknown> }[] = [];
  /** Answer this call with a failure, as the network or the service would, once or while it stays set. */
  fail: ((path: string) => Response | Error | null) | null = null;

  constructor(
    world: World,
    private readonly origin = KOHOLINT,
  ) {
    this.device = world.device();
  }

  /** Reflect the link cookie into the page, as a browser does for a cookie that isn't HttpOnly. */
  private mirror() {
    const value = this.device.jar.get(LINK);
    document.cookie = value ? `${LINK}=${value}; path=/` : `${LINK}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  readonly fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const path = new URL(String(input), "https://page.test").pathname;
    const body = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;
    this.calls.push({ path, body });
    const failure = this.fail?.(path);
    if (failure instanceof Error) throw failure;
    if (failure) return failure;
    const reply = await this.device.post(path, body, { origin: this.origin });
    this.mirror();
    return new Response(JSON.stringify(reply.body), { status: reply.status });
  };

  /** Run page code as this browser: its storage, link cookie and network. Leaves them as the code left them. */
  async run<T>(job: () => Promise<T> | T): Promise<T> {
    localStorage.clear();
    for (const [key, value] of this.storage) localStorage.setItem(key, value);
    this.mirror();
    vi.stubGlobal("fetch", this.fetch);
    useProgress.getState().reloadFromStorage();
    useSyncStatus.setState({ phase: "off", devices: 0, lastSync: null });
    try {
      return await job();
    } finally {
      this.storage = new Map(Object.entries({ ...localStorage }));
      this.mirror();
      vi.unstubAllGlobals();
    }
  }
}

/** Link two browsers the way the dialog does: `shower` shows a code, `typer` types it, and the shower finds out. */
export async function pair(shower: Browser, typer: Browser, label = "Test") {
  const { startCode, claimCode, checkStatus } = await import("../sync/pairing");
  const shown = await shower.run(() => startCode());
  if (!shown.ok) throw new Error("no code");
  const claimed = await typer.run(() => claimCode(shown.code));
  if (!claimed.ok) throw new Error(`claim failed: ${claimed.why} (${label})`);
  await shower.run(() => checkStatus());
}
