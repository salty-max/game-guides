/*
 * The store speaks Redis commands, in batches. The API runs on Upstash Redis over its REST pipeline; tests and the local
 * dev server run the same commands on MemoryStore. A contract test holds the two to the same answers.
 */

export type Command = readonly (string | number)[];

export interface Store {
  /** Run the commands in order and return their results. A batch is not a transaction. */
  exec(commands: readonly Command[]): Promise<unknown[]>;
}

/** The store is down, out of quota or refused the commands. The API answers 503. */
export class StoreError extends Error {}

/** A hash or sorted set read back as [field, value] pairs, whether the store sent a flat list or an object. */
export function toPairs(result: unknown): [string, string][] {
  if (Array.isArray(result)) {
    const out: [string, string][] = [];
    for (let i = 0; i + 1 < result.length; i += 2) out.push([String(result[i]), String(result[i + 1])]);
    return out;
  }
  if (result && typeof result === "object") return Object.entries(result).map(([field, value]) => [field, String(value)]);
  return [];
}

/** Upstash Redis over its REST API: one POST to /pipeline per batch. */
export class UpstashStore implements Store {
  constructor(
    private readonly url: string,
    private readonly token: string,
    private readonly request: typeof fetch = fetch,
  ) {}

  async exec(commands: readonly Command[]): Promise<unknown[]> {
    if (commands.length === 0) return [];
    let response: Response;
    try {
      response = await this.request(`${this.url.replace(/\/$/, "")}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(commands),
      });
    } catch (error) {
      throw new StoreError(`store unreachable: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (!response.ok) throw new StoreError(`store answered ${response.status}`);
    const rows = (await response.json()) as { result?: unknown; error?: string }[];
    return rows.map((row) => {
      if (row.error) throw new StoreError(row.error);
      return row.result ?? null;
    });
  }
}

/** The store named by the environment, or null when it isn't set up. Accepts Upstash's own names and Vercel KV's. */
export function storeFromEnv(env: Record<string, string | undefined> = process.env): Store | null {
  const url = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;
  return url && token ? new UpstashStore(url, token) : null;
}

type Slot =
  | { kind: "string"; value: string; expires?: number }
  | { kind: "hash"; value: Map<string, string>; expires?: number }
  | { kind: "zset"; value: Map<string, number>; expires?: number };

interface MemoryOptions {
  now?: () => number;
  /** Awaited between commands, so tests can let concurrent batches interleave the way separate requests do. */
  between?: () => Promise<void>;
}

/** The dozen commands the API uses, with Redis's answers. Keys expire against `now`. */
export class MemoryStore implements Store {
  private readonly data = new Map<string, Slot>();
  private readonly now: () => number;
  private readonly between?: () => Promise<void>;
  /** How many commands have run, for cost checks. */
  commands = 0;

  constructor(options: MemoryOptions = {}) {
    this.now = options.now ?? Date.now;
    this.between = options.between;
  }

  async exec(commands: readonly Command[]): Promise<unknown[]> {
    const out: unknown[] = [];
    for (const command of commands) {
      if (this.between) await this.between();
      this.commands++;
      out.push(this.run(command.map(String)));
    }
    return out;
  }

  /** Every live key, for tests. */
  keys(): string[] {
    return [...this.data.keys()].filter((key) => this.live(key));
  }

  /** Everything stored, as text, for tests that look for what must never be there. */
  snapshot(): string {
    return JSON.stringify([...this.data].filter(([name]) => this.live(name)).map(([name, slot]) => [name, slot.kind === "string" ? slot.value : [...slot.value]]));
  }

  /** Seconds left on a key, or null when it has no expiry. */
  ttl(key: string): number | null {
    const slot = this.live(key);
    return slot?.expires === undefined ? null : Math.ceil((slot.expires - this.now()) / 1000);
  }

  private live(key: string): Slot | undefined {
    const slot = this.data.get(key);
    if (slot && slot.expires !== undefined && slot.expires <= this.now()) {
      this.data.delete(key);
      return undefined;
    }
    return slot;
  }

  private typed<K extends Slot["kind"]>(key: string, kind: K): Extract<Slot, { kind: K }> | undefined {
    const slot = this.live(key);
    if (slot && slot.kind !== kind) throw new StoreError("WRONGTYPE Operation against a key holding the wrong kind of value");
    return slot as Extract<Slot, { kind: K }> | undefined;
  }

  private make<K extends "hash" | "zset">(key: string, kind: K): Extract<Slot, { kind: K }> {
    const slot = this.typed(key, kind);
    if (slot) return slot;
    const created = { kind, value: new Map() } as Extract<Slot, { kind: K }>;
    this.data.set(key, created);
    return created;
  }

  private run([name, ...args]: string[]): unknown {
    switch (name.toUpperCase()) {
      case "GET":
        return this.typed(args[0], "string")?.value ?? null;
      case "GETDEL": {
        const slot = this.typed(args[0], "string");
        this.data.delete(args[0]);
        return slot?.value ?? null;
      }
      case "SET": {
        const [key, value, ...flags] = args;
        const nx = flags.some((flag) => flag.toUpperCase() === "NX");
        if (nx && this.live(key)) return null;
        const ex = flags.findIndex((flag) => flag.toUpperCase() === "EX");
        this.data.set(key, { kind: "string", value, expires: ex >= 0 ? this.now() + Number(flags[ex + 1]) * 1000 : undefined });
        return "OK";
      }
      case "INCR": {
        const slot = this.typed(args[0], "string");
        const next = Number(slot?.value ?? 0) + 1;
        this.data.set(args[0], { kind: "string", value: String(next), expires: slot?.expires });
        return next;
      }
      case "EXPIRE": {
        const slot = this.live(args[0]);
        if (!slot) return 0;
        // EXPIRE key seconds NX: only a key that has no expiry yet, so a counter's window is set once.
        if (args[2]?.toUpperCase() === "NX" && slot.expires !== undefined) return 0;
        slot.expires = this.now() + Number(args[1]) * 1000;
        return 1;
      }
      case "DEL": {
        let removed = 0;
        for (const key of args) if (this.live(key) && this.data.delete(key)) removed++;
        return removed;
      }
      case "HSET": {
        const [key, ...pairs] = args;
        const hash = this.make(key, "hash").value;
        let added = 0;
        for (let i = 0; i + 1 < pairs.length; i += 2) {
          if (!hash.has(pairs[i])) added++;
          hash.set(pairs[i], pairs[i + 1]);
        }
        return added;
      }
      case "HGET":
        return this.typed(args[0], "hash")?.value.get(args[1]) ?? null;
      case "HMGET": {
        const hash = this.typed(args[0], "hash")?.value;
        return args.slice(1).map((field) => hash?.get(field) ?? null);
      }
      case "HGETALL":
        return [...(this.typed(args[0], "hash")?.value ?? [])].flat();
      case "HDEL": {
        const slot = this.typed(args[0], "hash");
        let removed = 0;
        for (const field of args.slice(1)) if (slot?.value.delete(field)) removed++;
        if (slot && slot.value.size === 0) this.data.delete(args[0]);
        return removed;
      }
      case "HLEN":
        return this.typed(args[0], "hash")?.value.size ?? 0;
      case "ZADD": {
        const [key, ...pairs] = args;
        const zset = this.make(key, "zset").value;
        let added = 0;
        for (let i = 0; i + 1 < pairs.length; i += 2) {
          if (!zset.has(pairs[i + 1])) added++;
          zset.set(pairs[i + 1], Number(pairs[i]));
        }
        return added;
      }
      case "ZREM": {
        const slot = this.typed(args[0], "zset");
        let removed = 0;
        for (const member of args.slice(1)) if (slot?.value.delete(member)) removed++;
        if (slot && slot.value.size === 0) this.data.delete(args[0]);
        return removed;
      }
      case "ZCARD":
        return this.typed(args[0], "zset")?.value.size ?? 0;
      case "ZRANGE": {
        // Only the whole set, as the API reads it: ZRANGE key 0 -1 [WITHSCORES], by score and then by name.
        const members = [...(this.typed(args[0], "zset")?.value ?? [])].sort(([ma, sa], [mb, sb]) => sa - sb || (ma < mb ? -1 : ma > mb ? 1 : 0));
        return args[3]?.toUpperCase() === "WITHSCORES" ? members.flatMap(([member, score]) => [member, String(score)]) : members.map(([member]) => member);
      }
      default:
        throw new StoreError(`ERR unknown command '${name}'`);
    }
  }
}
