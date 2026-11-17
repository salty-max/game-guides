import type { Deps } from "./app";
import { storeFromEnv } from "./store";

let cached: Deps | null | undefined;

/** The store and salt named by the environment, built once per instance; null until the project has both. */
export function depsFromEnv(): Deps | null {
  if (cached === undefined) {
    const store = storeFromEnv();
    const salt = process.env.SYNC_IP_SALT;
    cached = store && salt ? { store, salt, now: Date.now, spent: new Set() } : null;
  }
  return cached;
}
