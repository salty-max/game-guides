import { handle, type Deps } from "./app";
import { MemoryStore, type Store } from "./store";

/* Test helpers: a fake clock, a store, and devices that carry their own cookie jar and call the handler like a browser. */

export const KOHOLINT = "https://koholint.hundo.quest";
export const RDR = "https://rdr.hundo.quest";
export const PREVIEW = "https://hundo-koholint-git-sync-jellycat.vercel.app";
export const LOCAL = "http://localhost:5173";
export const GUIDE = "links-awakening";

/** A small seeded generator, so property tests repeat. */
export function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Reply {
  status: number;
  body: Record<string, unknown> & { entries?: Record<string, [number, unknown]>; devices?: unknown };
  /** The Set-Cookie headers of this reply. */
  cookies: string[];
  headers: Headers;
}

export class World {
  clock = { now: Date.UTC(2026, 10, 15, 12, 0, 0) };
  store: MemoryStore;
  deps: Deps;
  private visitors = 0;

  constructor(options: { between?: () => Promise<void>; store?: Store } = {}) {
    this.store = new MemoryStore({ now: () => this.clock.now, between: options.between });
    this.deps = { store: options.store ?? this.store, now: () => this.clock.now, salt: "test-salt" };
  }

  /** A browser (or an installed app): one cookie jar and one IP address. */
  device(ip = `203.0.113.${++this.visitors}`) {
    return new Device(this, ip);
  }

  advance(ms: number) {
    this.clock.now += ms;
  }
}

export class Device {
  jar = new Map<string, string>();
  /** When each cookie dies, from its Max-Age, on the world's clock: a cookie past its life is not sent, as in a browser. */
  private dies = new Map<string, number>();
  /** The Set-Cookie headers of the last reply. */
  set: string[] = [];

  constructor(
    private readonly world: World,
    public ip: string,
  ) {}

  async post(path: string, body: Record<string, unknown> = {}, options: { origin?: string; direct?: boolean; headers?: Record<string, string>; raw?: string; deps?: Deps | null } = {}): Promise<Reply> {
    const origin = options.origin ?? KOHOLINT;
    const host = new URL(origin).host;
    for (const [name, at] of this.dies) {
      if (at <= this.world.clock.now) {
        this.jar.delete(name);
        this.dies.delete(name);
      }
    }
    const cookie = [...this.jar].map(([name, value]) => `${name}=${value}`).join("; ");
    const headers: Record<string, string> = {
      "content-type": "application/json",
      origin,
      // Behind a guide's rewrite the API sees its own host and no x-forwarded-host for the guide's (seen on the first preview); called
      // direct, as through a dev server's proxy, it sees the page's. Nothing depends on either.
      host: options.direct ? host : "api.hundo.quest",
      "x-real-ip": this.ip,
      ...(cookie ? { cookie } : {}),
      ...options.headers,
    };
    const request = new Request(`https://api.hundo.quest${path}`, { method: "POST", headers, body: options.raw ?? JSON.stringify({ p: 1, ...body }) });
    const response = await handle(request, options.deps === undefined ? this.world.deps : options.deps);
    const cookies = response.headers.getSetCookie();
    this.set = cookies;
    for (const line of cookies) {
      const [pair, ...attributes] = line.split(";").map((part) => part.trim());
      const at = pair.indexOf("=");
      const name = pair.slice(0, at);
      const maxAge = Number(attributes.find((attribute) => attribute.startsWith("Max-Age="))?.slice(8));
      if (maxAge === 0) {
        this.jar.delete(name);
        this.dies.delete(name);
      } else {
        this.jar.set(name, pair.slice(at + 1));
        if (Number.isFinite(maxAge)) this.dies.set(name, this.world.clock.now + maxAge * 1000);
      }
    }
    return { status: response.status, body: (await response.json()) as Reply["body"], cookies, headers: response.headers };
  }

  /** Start a pairing and give the code. */
  async show(options?: Parameters<Device["post"]>[2]) {
    const reply = await this.post("/api/pair/start", { label: "Test device" }, options);
    return { reply, code: String(reply.body.code) };
  }

  claim(code: string, label = "Other device", options?: Parameters<Device["post"]>[2]) {
    return this.post("/api/pair/claim", { code, label }, options);
  }

  sync(entries: Record<string, unknown> = {}, extra: Record<string, unknown> = {}, options?: Parameters<Device["post"]>[2]) {
    return this.post("/api/sync", { guide: GUIDE, entries, ...extra }, options);
  }

  status(options?: Parameters<Device["post"]>[2]) {
    return this.post("/api/status", {}, options);
  }
}

/** Link two fresh devices: `a` shows the code, `b` types it. */
export async function link(world: World, options?: Parameters<Device["post"]>[2]) {
  const a = world.device();
  const b = world.device();
  const { code } = await a.show(options);
  const claimed = await b.claim(code, "Second device", options);
  await a.status(options);
  return { a, b, claimed };
}
